import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Confirm payment and update day-pass booking status to PENDING
 * Called immediately after successful Paystack payment
 * Status: PENDING means payment confirmed, awaiting admin activation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, reference } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    console.log(
      `[Day-Pass Confirm Payment] Updating booking ${bookingId} to PENDING (payment confirmed, awaiting activation)`,
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

    // Update day-pass booking status to CONFIRMED (payment confirmed)
    const { data, error } = await supabase
      .from("day_pass_bookings")
      .update({
        payment_status: "CONFIRMED",
        updated_at: new Date().toISOString(),
      })
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
      message: "Payment confirmed and booking updated",
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
