import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/require-admin";
import { transitionBookingStatus } from "@/lib/server/status-update";
import { BOOKING_STATUS_TRANSITIONS } from "@/lib/security/validators";

export const dynamic = "force-dynamic";

/**
 * Update booking status (admin only)
 * Allowed status transitions:
 * - PENDING → CONFIRMED (admin approval)
 * - CONFIRMED → CHECKED_IN (check-in)
 * - CHECKED_IN → COMPLETED (check-out)
 * - Any non-final → CANCELLED (admin cancellation)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    return await transitionBookingStatus("bookings", id, body?.status, BOOKING_STATUS_TRANSITIONS);
  } catch (error: any) {
    console.error("[Booking Status Update] Error:", error?.message);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
