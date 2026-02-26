import { NextRequest, NextResponse } from "next/server";
import { handlePaystackWebhook } from "@/lib/services/paystack";

/**
 * Paystack Webhook Handler
 * Receives events from Paystack for successful payments
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.json();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-paystack-signature header" },
        { status: 400 },
      );
    }

    const result = await handlePaystackWebhook(body, signature);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error handling Paystack webhook:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 },
    );
  }
}
