import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitByIp } from "@/lib/security/rate-limit";
import { confirmPaymentSchema } from "@/lib/security/validators";

/**
 * Confirm payment and update booking with Paystack reference
 * Called immediately after successful Paystack payment
 * Status stays PENDING until admin reviews payment and clicks "Approve" button
 */
export async function POST(request: NextRequest) {
  try {
    const rate = rateLimitByIp(
      request.headers,
      "api:bookings:confirm-payment",
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
    const normalizedBookingId =
      typeof bookingId === "string" ? bookingId.trim() : bookingId;

    if (!normalizedBookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    console.log(
      `[Confirm Payment] Updating booking ${normalizedBookingId} with Paystack reference (status remains PENDING until admin approves)`,
    );

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      console.error("[Confirm Payment] NEXT_PUBLIC_SUPABASE_URL is missing!");
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL not configured" },
        { status: 500 },
      );
    }

    if (!serviceRoleKey) {
      console.error("[Confirm Payment] SUPABASE_SERVICE_ROLE_KEY is missing!");
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
        console.warn("[Confirm Payment] Paystack verification failed", {
          bookingId: normalizedBookingId,
          reference: normalizedReference,
          paystackStatus: transactionStatus,
        });

        return NextResponse.json(
          {
            error: "Payment not verified yet",
            paystackStatus: transactionStatus || "unknown",
          },
          { status: 400 },
        );
      }
    }

    // Build update object - payment confirmed, now await admin verification/approval
    const updateData: any = {
      payment_status: "PENDING",
      updated_at: new Date().toISOString(),
    };

    // Update paystack_reference if reference is provided (actual Paystack transaction ref)
    if (reference) {
      updateData.paystack_reference = reference;
    }

    // Try full update first. If paid_at column exists, add it
    let data: any[] | null = null;
    let error: any = null;

    const fullUpdate = await supabase
      .from("bookings")
      .update({
        ...updateData,
        paid_at: new Date().toISOString(),
      })
      .eq("id", normalizedBookingId)
      .select();

    data = fullUpdate.data as any[] | null;
    error = fullUpdate.error;

    const missingPaidAtColumn =
      !!error &&
      (error.code === "42703" ||
        String(error.message || "")
          .toLowerCase()
          .includes("paid_at") ||
        String(error.details || "")
          .toLowerCase()
          .includes("paid_at"));

    if (missingPaidAtColumn) {
      console.warn(
        "[Confirm Payment] paid_at column missing. Falling back to reference-only update.",
      );

      const fallbackUpdate = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", normalizedBookingId)
        .select();

      data = fallbackUpdate.data as any[] | null;
      error = fallbackUpdate.error;
    }

    if (error) {
      if (error.code === "22P02") {
        return NextResponse.json(
          { error: "Invalid bookingId format" },
          { status: 400 },
        );
      }

      console.error("[Confirm Payment] Database error:", error);
      return NextResponse.json(
        { error: `Failed to update booking: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      console.error("[Confirm Payment] No booking row updated", {
        bookingId,
        reference,
      });

      const existing = await supabase
        .from("bookings")
        .select("id,payment_status")
        .eq("id", normalizedBookingId)
        .maybeSingle();

      if (existing.data?.id && existing.data.payment_status === "CONFIRMED") {
        return NextResponse.json({
          success: true,
          message: "Booking already confirmed",
          booking: existing.data,
        });
      }

      return NextResponse.json(
        { error: "Booking not found or could not be updated" },
        { status: 404 },
      );
    }

    console.log("[Confirm Payment] Booking updated successfully:", {
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
    console.error("[Confirm Payment] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm payment" },
      { status: 500 },
    );
  }
}
