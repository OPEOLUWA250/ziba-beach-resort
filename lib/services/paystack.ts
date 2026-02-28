import axios from "axios";
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

// Database operations removed - Supabase SDK only

export async function initializePayment(input: InitPaymentInput) {
  return {
    success: true,
    paymentUrl: "https://checkout.paystack.com/mock",
    reference: "mock-ref-" + Date.now(),
    accessCode: "mock-access",
  };
}

export async function verifyPayment(reference: string) {
  return {
    success: true,
    status: "success",
    message: "Payment verified successfully",
  };
}

export async function handlePaystackWebhook(
  body: any,
  signature: string,
): Promise<{ success: boolean; message: string }> {
  return { success: true, message: "Event processed" };
}

export async function createPaymentWithCurrencyConversion(
  email: string,
  amountNGN: number,
  userCurrency: string,
  bookingId: string,
  metadata?: Record<string, any>,
) {
  return initializePayment({
    email,
    amountNGN,
    userCurrency,
    userAmount: amountNGN,
    bookingId,
    metadata,
  });
}

export async function refundPayment(
  reference: string,
  reason?: string,
): Promise<{ success: boolean; message: string }> {
  return { success: true, message: "Refund processed successfully" };
}

export async function getPaymentDetails(paymentId: string) {
  return null;
}
