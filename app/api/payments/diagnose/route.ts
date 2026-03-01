import { NextRequest, NextResponse } from "next/server";

/**
 * Simple diagnostic endpoint to test Paystack API connectivity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Missing reference parameter" },
        { status: 400 },
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      return NextResponse.json(
        {
          error: "PAYSTACK_SECRET_KEY not configured",
          details: "Check Vercel env vars",
        },
        { status: 500 },
      );
    }

    console.log(
      `[Paystack Diagnostic] Testing verification for reference: ${reference}`,
    );

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      },
    );

    const paystackData = await verifyRes.json();

    console.log("[Paystack Diagnostic] Paystack API Response:", {
      httpStatus: verifyRes.status,
      paystackStatus: paystackData.status,
      transactionStatus: paystackData.data?.status,
      amount: paystackData.data?.amount,
      reference: paystackData.data?.reference,
    });

    return NextResponse.json({
      success: true,
      httpStatus: verifyRes.status,
      paystackResponse: paystackData,
    });
  } catch (error: any) {
    console.error("[Paystack Diagnostic] Error:", error);
    return NextResponse.json(
      { error: error.message || "Diagnostic failed" },
      { status: 500 },
    );
  }
}
