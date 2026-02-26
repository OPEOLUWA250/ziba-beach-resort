import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/**
 * Paystack Webhook Handler
 * Receives events from Paystack for successful payments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handlePaystackWebhook } = await import("@/lib/services/paystack");
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
