import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Confirm payment and update booking status to CONFIRMED
 * Called immediately after successful Paystack payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, reference } = body;
    const normalizedBookingId =
      typeof bookingId === "string" ? bookingId.trim() : bookingId;

    if (!normalizedBookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    console.log(
      `[Confirm Payment] Updating booking ${normalizedBookingId} to CONFIRMED`,
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

    // Try full update first. If paid_at column doesn't exist, fall back to status-only update.
    let data: any[] | null = null;
    let error: any = null;

    const fullUpdate = await supabase
      .from("bookings")
      .update({
        payment_status: "CONFIRMED",
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
        "[Confirm Payment] paid_at column missing. Falling back to payment_status-only update.",
      );

      const fallbackUpdate = await supabase
        .from("bookings")
        .update({
          payment_status: "CONFIRMED",
        })
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
      message: "Payment confirmed and booking updated",
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
