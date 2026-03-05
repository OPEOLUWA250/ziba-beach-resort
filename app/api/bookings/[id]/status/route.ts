import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Update booking status
 * Allowed status transitions:
 * - PENDING → CONFIRMED (admin approval)
 * - CONFIRMED → CHECKED_IN (check-in)
 * - CHECKED_IN → COMPLETED (check-out)
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

    // Update booking status
    const { data, error } = await supabase
      .from("bookings")
      .update({ payment_status: status })
      .eq("id", id)
      .select();

    if (error) {
      console.error("[Booking Status Update] Database error:", error);
      return NextResponse.json(
        { error: `Failed to update booking: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log(`[Booking Status Update] Booking ${id} updated to ${status}`);

    return NextResponse.json({
      success: true,
      message: `Booking updated to ${status}`,
      booking: data[0],
    });
  } catch (error: any) {
    console.error("[Booking Status Update] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update booking status" },
      { status: 500 },
    );
  }
}
