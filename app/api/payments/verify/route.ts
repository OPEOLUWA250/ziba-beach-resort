import { NextRequest, NextResponse } from "next/server";

/**
 * Verify Paystack payment
 * This endpoint is called from the client after Paystack payment modal closes
 * It validates the transaction with Paystack servers
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Missing transaction reference" },
        { status: 400 },
      );
    }

    console.log(`[Payment Verify] Verifying transaction: ${reference}`);

    // Call Paystack API to verify payment
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (!data.status) {
      console.error(`[Payment Verify] Paystack error:`, data.message);
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Payment verification failed",
        },
        { status: 400 },
      );
    }

    const transaction = data.data;

    // Check if transaction is successful
    if (transaction.status === "success") {
      console.log(`[Payment Verify] Payment successful:`, {
        reference,
        amount: transaction.amount,
        customer: transaction.customer,
      });

      return NextResponse.json({
        success: true,
        status: transaction.status,
        reference: transaction.reference,
        amount: transaction.amount / 100, // Convert from kobo to naira
        email: transaction.customer.email,
        message: "Payment verified successfully",
      });
    } else {
      console.warn(`[Payment Verify] Payment not successful:`, {
        reference,
        status: transaction.status,
      });

      return NextResponse.json(
        {
          success: false,
          status: transaction.status,
          error: `Payment ${transaction.status}`,
        },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("[Payment Verify] Error:", {
      message: error.message,
      stack: error.stack?.split("\n")[0],
    });

    return NextResponse.json(
      { success: false, error: error.message || "Verification failed" },
      { status: 500 },
    );
  }
}
