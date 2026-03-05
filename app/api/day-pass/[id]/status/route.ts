import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Update day-pass booking status
 * Allowed status transitions:
 * - PENDING → CONFIRMED (admin approval)
 * - CONFIRMED → ACTIVATED (guest arrival - activate day pass)
 * - ACTIVATED → COMPLETED (guest checkout)
 * - Any → CANCELLED (admin cancellation)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing booking ID or status" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Update day-pass booking status
    const { data, error } = await supabase
      .from("day_pass_bookings")
      .update({ payment_status: status })
      .eq("id", id)
      .select();

    if (error) {
      console.error("[Day-Pass Status Update] Database error:", error);
      return NextResponse.json(
        { error: `Failed to update booking: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Day-pass booking not found" },
        { status: 404 },
      );
    }

    console.log(`[Day-Pass Status Update] Booking ${id} updated to ${status}`);

    return NextResponse.json({
      success: true,
      message: `Day-pass booking updated to ${status}`,
      booking: data[0],
    });
  } catch (error: any) {
    console.error("[Day-Pass Status Update] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update day-pass booking status" },
      { status: 500 },
    );
  }
}
