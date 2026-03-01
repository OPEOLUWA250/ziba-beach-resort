import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/services/paystack";

// Dynamic route: /api/payments/verify/[reference]
async function handleVerifyRequest(reference: string) {
  try {
    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 },
      );
    }

    const result = await verifyPayment(reference);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } },
) {
  return handleVerifyRequest(params.reference);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { reference: string } },
) {
  return handleVerifyRequest(params.reference);
}
