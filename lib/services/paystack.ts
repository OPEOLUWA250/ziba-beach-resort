import axios from "axios";
import prisma from "./prisma";
import { convertToNGN } from "./currency";
import crypto from "crypto";

const PAYSTACK_API_BASE = "https://api.paystack.co";
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface InitPaymentInput {
  email: string;
  amountNGN: number;
  userCurrency?: string;
  userAmount?: number;
  bookingId: string;
  metadata?: Record<string, any>;
}

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

/**
 * Initialize payment on Paystack
 */
export async function initializePayment(input: InitPaymentInput) {
  if (!PAYSTACK_PUBLIC_KEY || !PAYSTACK_SECRET) {
    throw new Error("Paystack credentials not configured");
  }

  try {
    const response = await axios.post<PaystackInitResponse>(
      `${PAYSTACK_API_BASE}/transaction/initialize`,
      {
        email: input.email,
        amount: Math.round(input.amountNGN * 100), // Paystack uses kobo (1/100 of naira)
        callback_url: `${APP_URL}/api/payments/callback`,
        metadata: {
          bookingId: input.bookingId,
          userCurrency: input.userCurrency || "NGN",
          userAmount: input.userAmount || input.amountNGN,
          ...input.metadata,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    // Store payment record
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: { userId: true },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId: input.bookingId,
        userId: booking.userId,
        amountNGN: input.amountNGN,
        userCurrency: input.userCurrency || "NGN",
        userAmount: input.userAmount || input.amountNGN,
        paystackReference: response.data.data?.reference,
        status: "PROCESSING",
        metadata: {
          access_code: response.data.data?.access_code,
        },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        bookingId: input.bookingId,
        paymentId: payment.id,
        type: "PAYMENT_INITIATED",
        amount: input.amountNGN,
        currency: "NGN",
        status: "PENDING",
        description: `Payment initialization for ${input.userAmount} ${input.userCurrency}`,
        metadata: {
          paystackReference: response.data.data?.reference,
        },
      },
    });

    return {
      success: true,
      paymentUrl: response.data.data?.authorization_url,
      reference: response.data.data?.reference,
      accessCode: response.data.data?.access_code,
    };
  } catch (error) {
    console.error("Error initializing payment:", error);
    throw error;
  }
}

/**
 * Verify payment on Paystack
 */
export async function verifyPayment(reference: string) {
  if (!PAYSTACK_SECRET) {
    throw new Error("Paystack credentials not configured");
  }

  try {
    const response = await axios.get(
      `${PAYSTACK_API_BASE}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      },
    );

    if (!response.data.status) {
      throw new Error("Payment verification failed");
    }

    const paymentData = response.data.data;

    // Update payment record
    const payment = await prisma.payment.findUnique({
      where: { paystackReference: reference },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (paymentData.status === "success") {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          metadata: {
            ...payment.metadata,
            paystackResponse: paymentData,
          },
        },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          bookingId: payment.bookingId,
          paymentId: payment.id,
          type: "PAYMENT_COMPLETED",
          amount: payment.amountNGN,
          currency: "NGN",
          status: "SUCCESS",
          description: `Payment verified with reference: ${reference}`,
          metadata: {
            paystackResponse: paymentData,
          },
        },
      });

      return {
        success: true,
        status: "success",
        message: "Payment verified successfully",
        payment,
      };
    } else if (paymentData.status === "abandoned") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      return {
        success: false,
        status: "abandoned",
        message: "Payment was abandoned",
      };
    }

    throw new Error(`Unexpected payment status: ${paymentData.status}`);
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}

/**
 * Handle Paystack webhook
 */
export async function handlePaystackWebhook(
  body: any,
  signature: string,
): Promise<{ success: boolean; message: string }> {
  if (!PAYSTACK_SECRET) {
    throw new Error("Paystack secret not configured");
  }

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== signature) {
    return { success: false, message: "Invalid webhook signature" };
  }

  try {
    const { event, data } = body;

    if (event === "charge.success") {
      const reference = data.reference;

      // Verify and update payment
      const payment = await prisma.payment.findUnique({
        where: { paystackReference: reference },
      });

      if (!payment) {
        return {
          success: false,
          message: "Payment record not found",
        };
      }

      if (payment.status !== "COMPLETED") {
        // Update payment status through verification
        await verifyPayment(reference);
      }

      return { success: true, message: "Payment processed successfully" };
    }

    return { success: true, message: "Event processed" };
  } catch (error) {
    console.error("Error handling webhook:", error);
    return { success: false, message: "Webhook processing failed" };
  }
}

/**
 * Create payment with automatic currency conversion
 */
export async function createPaymentWithCurrencyConversion(
  email: string,
  amountNGN: number,
  userCurrency: string,
  bookingId: string,
  metadata?: Record<string, any>,
) {
  let userAmount = amountNGN;

  // Convert from NGN to user's currency for display
  if (userCurrency && userCurrency !== "NGN") {
    try {
      const conversion = await convertToNGN(amountNGN, userCurrency);
      userAmount = amountNGN / conversion.rate;
    } catch (error) {
      console.warn("Currency conversion failed, using original amount:", error);
      userAmount = amountNGN;
    }
  }

  return initializePayment({
    email,
    amountNGN,
    userCurrency,
    userAmount,
    bookingId,
    metadata,
  });
}

/**
 * Process refund (useful for cancellations)
 */
export async function refundPayment(
  reference: string,
  reason?: string,
): Promise<{ success: boolean; message: string }> {
  if (!PAYSTACK_SECRET) {
    throw new Error("Paystack credentials not configured");
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { paystackReference: reference },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "COMPLETED") {
      throw new Error("Can only refund completed payments");
    }

    // Paystack refund API call
    const response = await axios.post(
      `${PAYSTACK_API_BASE}/refund`,
      {
        transaction: reference,
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      },
    );

    if (response.data.status) {
      // Update payment record
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "REFUNDED" },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          bookingId: payment.bookingId,
          paymentId: payment.id,
          type: "REFUND_INITIATED",
          amount: payment.amountNGN,
          currency: "NGN",
          status: "SUCCESS",
          description: `Refund initiated: ${reason || "No reason provided"}`,
          metadata: {
            paystackReference: reference,
          },
        },
      });

      return { success: true, message: "Refund processed successfully" };
    }

    throw new Error("Failed to process refund");
  } catch (error) {
    console.error("Error processing refund:", error);
    throw error;
  }
}

/**
 * Get payment details
 */
export async function getPaymentDetails(paymentId: string) {
  return prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: true,
      transactions: true,
    },
  });
}
