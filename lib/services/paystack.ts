import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const PAYSTACK_API_BASE = "https://api.paystack.co";
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

interface InitPaymentInput {
  email: string;
  amountNGN: number;
  bookingId?: string;
  reference?: string;
  metadata?: Record<string, any>;
}

// Initialize Supabase client for database operations
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

/**
 * Initialize a payment transaction with Paystack
 */
export async function initializePayment(input: InitPaymentInput) {
  if (!PAYSTACK_SECRET) {
    throw new Error("PAYSTACK_SECRET_KEY not configured");
  }

  const { email, amountNGN, reference, metadata } = input;

  try {
    const response = await fetch(
      `${PAYSTACK_API_BASE}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amountNGN * 100), // Convert to kobo
          reference,
          metadata,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking-confirmation`,
        }),
      },
    );

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to initialize payment");
    }

    return {
      success: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw error;
  }
}

/**
 * Verify a payment transaction
 */
export async function verifyPayment(reference: string) {
  if (!PAYSTACK_SECRET) {
    throw new Error("PAYSTACK_SECRET_KEY not configured");
  }

  try {
    const response = await fetch(
      `${PAYSTACK_API_BASE}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      },
    );

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to verify payment");
    }

    const transaction = data.data;

    // Update booking status if payment is successful
    if (transaction.status === "success") {
      const supabase = getSupabaseClient();

      await supabase
        .from("bookings")
        .update({
          payment_status: "COMPLETED",
          paid_at: new Date().toISOString(),
        })
        .eq("paystack_reference", reference);
    }

    return {
      success: transaction.status === "success",
      status: transaction.status,
      reference: transaction.reference,
      amount: Math.floor(transaction.amount / 100), // Convert from kobo to NGN
      currency: transaction.currency,
      customer_email: transaction.customer?.email,
      paid_at: transaction.paid_at,
    };
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw error;
  }
}

/**
 * Handle Paystack webhook events
 */
export async function handlePaystackWebhook(
  body: any,
  signature: string,
): Promise<{ success: boolean; message: string }> {
  if (!PAYSTACK_SECRET) {
    throw new Error("PAYSTACK_SECRET_KEY not configured");
  }

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== signature) {
    throw new Error("Invalid webhook signature");
  }

  const event = body.event;
  const data = body.data;

  const supabase = getSupabaseClient();

  try {
    switch (event) {
      case "charge.success":
        await supabase
          .from("bookings")
          .update({
            payment_status: "COMPLETED",
            paid_at: new Date().toISOString(),
          })
          .eq("paystack_reference", data.reference);

        return { success: true, message: "Booking payment confirmed" };

      case "charge.failed":
        await supabase
          .from("bookings")
          .update({
            payment_status: "FAILED",
          })
          .eq("paystack_reference", data.reference);

        return { success: true, message: "Booking payment failed" };

      default:
        return { success: true, message: "Event processed" };
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    throw error;
  }
}

/**
 * Get payment details from Paystack
 */
export async function getPaymentDetails(reference: string) {
  if (!PAYSTACK_SECRET) {
    throw new Error("PAYSTACK_SECRET_KEY not configured");
  }

  try {
    const response = await fetch(
      `${PAYSTACK_API_BASE}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      },
    );

    const data = await response.json();

    if (!data.status) {
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return null;
  }
}

/**
 * Refund a payment
 */
export async function refundPayment(
  reference: string,
  reason?: string,
): Promise<{ success: boolean; message: string }> {
  if (!PAYSTACK_SECRET) {
    throw new Error("PAYSTACK_SECRET_KEY not configured");
  }

  try {
    const response = await fetch(`${PAYSTACK_API_BASE}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
      body: JSON.stringify({
        transaction: reference,
        reason: reason || "Customer requested refund",
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to process refund");
    }

    // Update booking status
    const supabase = getSupabaseClient();
    await supabase
      .from("bookings")
      .update({
        payment_status: "REFUNDED",
      })
      .eq("paystack_reference", reference);

    return {
      success: true,
      message: "Refund processed successfully",
    };
  } catch (error) {
    console.error("Paystack refund error:", error);
    throw error;
  }
}
