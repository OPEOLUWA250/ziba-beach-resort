import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/services/paystack";

// Dynamic route: /api/payments/verify/[reference]
async function handleVerifyRequest(reference: string) {
  try {
    console.log("🔍 Payment verify endpoint: reference =", reference);

    if (!reference) {
      console.error("❌ No reference provided");
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 },
      );
    }

    const result = await verifyPayment(reference);
    console.log("✅ Payment verified, result:", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error verifying payment:", error.message, error.stack);
    return NextResponse.json(
      {
        error: error.message || "Failed to verify payment",
        details: error.toString(),
      },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  return handleVerifyRequest(reference);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  return handleVerifyRequest(reference);
}
