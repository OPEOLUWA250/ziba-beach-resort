import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitByIp } from "@/lib/security/rate-limit";
import { confirmPaymentSchema } from "@/lib/security/validators";

export const dynamic = "force-dynamic";

/**
 * Confirm payment and update day-pass booking payment reference
 * Called immediately after successful Paystack payment
 * Status stays PENDING until admin reviews and clicks "Approve" button
 */
export async function POST(request: NextRequest) {
  try {
    const rate = rateLimitByIp(
      request.headers,
      "api:daypass:confirm-payment",
      60,
      60_000,
    );
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error:
            "Too many payment confirmation attempts. Please retry shortly.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const body = await request.json();
    const parsed = confirmPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { bookingId, reference } = parsed.data;

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    console.log(
      `[Day-Pass Confirm Payment] Updating booking ${bookingId} with Paystack reference (status remains PENDING until admin approves)`,
    );

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      console.error(
        "[Day-Pass Confirm Payment] NEXT_PUBLIC_SUPABASE_URL is missing!",
      );
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL not configured" },
        { status: 500 },
      );
    }

    if (!serviceRoleKey) {
      console.error(
        "[Day-Pass Confirm Payment] SUPABASE_SERVICE_ROLE_KEY is missing!",
      );
      return NextResponse.json(
        {
          error:
            "SUPABASE_SERVICE_ROLE_KEY not configured - payments cannot be confirmed",
        },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify payment with Paystack when possible before exposing booking to admin.
    const normalizedReference =
      typeof reference === "string" ? reference.trim() : "";
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (normalizedReference && paystackSecretKey) {
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${normalizedReference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
          },
        },
      );

      const verifyData = await verifyRes.json();
      const transactionStatus = verifyData?.data?.status;
      const isSuccessful =
        verifyData?.status && transactionStatus === "success";

      if (!isSuccessful) {
        console.warn(
          "[Day-Pass Confirm Payment] Paystack verification failed",
          {
            bookingId,
            reference: normalizedReference,
            paystackStatus: transactionStatus,
          },
        );

        return NextResponse.json(
          {
            error: "Payment not verified yet",
            paystackStatus: transactionStatus || "unknown",
          },
          { status: 400 },
        );
      }
    }

    // Build update object - include reference if provided
    const updateData: any = {
      // Keep status as PENDING - admin must approve before next action
      // Once Approve button is clicked, admin will change to CONFIRMED
      payment_status: "PENDING",
      updated_at: new Date().toISOString(),
    };

    // Update paystack_reference if reference is provided (actual Paystack transaction ref)
    if (reference) {
      updateData.paystack_reference = reference;
    }

    // Update day-pass booking with payment confirmation (but keep status as PENDING until admin approves)
    const { data, error } = await supabase
      .from("day_pass_bookings")
      .update(updateData)
      .eq("id", bookingId)
      .select();

    if (error) {
      console.error("[Day-Pass Confirm Payment] Database error:", error);
      return NextResponse.json(
        { error: `Failed to update booking: ${error.message}` },
        { status: 500 },
      );
    }

    console.log("[Day-Pass Confirm Payment] Booking updated successfully:", {
      bookingId,
      reference,
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Payment confirmed and booking left pending for admin approval",
      booking: data?.[0] || null,
    });
  } catch (error: any) {
    console.error("[Day-Pass Confirm Payment] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm payment" },
      { status: 500 },
    );
  }
}
