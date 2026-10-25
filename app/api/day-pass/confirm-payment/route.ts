import { NextRequest, NextResponse } from "next/server";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";
import { confirmPaymentSchema } from "@/lib/security/validators";
import { confirmBookingPayment, HTTP_STATUS_FOR_OUTCOME } from "@/lib/server/payments";

export const dynamic = "force-dynamic";

/**
 * Confirm payment for a day-pass booking. The server verifies the booking's
 * own stored reference with Paystack (amount + currency); any client-supplied
 * reference is ignored. Status moves RESERVED -> PENDING for admin approval.
 */
export async function POST(request: NextRequest) {
  try {
    const rate = await rateLimitByIp(request.headers, "api:daypass:confirm-payment", 60, 60_000);
    if (!rate.allowed) {
      return tooManyRequests(rate, "Too many payment confirmation attempts. Please retry shortly.");
    }

    const parsed = confirmPaymentSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await confirmBookingPayment({ kind: "day_pass", bookingId: parsed.data.bookingId });
    const ok = result.outcome === "confirmed" || result.outcome === "already_processed";

    return NextResponse.json(
      ok
        ? { success: true, message: result.message, booking: result.booking ?? null }
        : { error: result.message, paystackStatus: result.paystackStatus },
      { status: HTTP_STATUS_FOR_OUTCOME[result.outcome] },
    );
  } catch (error: any) {
    console.error("[Day-Pass Confirm Payment] Error:", error?.message);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
