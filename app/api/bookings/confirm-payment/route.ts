import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Confirm payment and update booking status to COMPLETED
 * Called immediately after successful Paystack payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, reference } = body;

    if (!bookingId || !reference) {
      return NextResponse.json(
        { error: "Missing bookingId or reference" },
        { status: 400 },
      );
    }

    console.log(`[Confirm Payment] Updating booking ${bookingId} to COMPLETED`);

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

    // Update booking status to COMPLETED
    const { data, error } = await supabase
      .from("bookings")
      .update({
        payment_status: "COMPLETED",
        paid_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select();

    if (error) {
      console.error("[Confirm Payment] Database error:", error);
      return NextResponse.json(
        { error: `Failed to update booking: ${error.message}` },
        { status: 500 },
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
