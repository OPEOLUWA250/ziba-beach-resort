import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/require-admin";
import { transitionBookingStatus } from "@/lib/server/status-update";
import { DAY_PASS_STATUS_TRANSITIONS } from "@/lib/security/validators";

export const dynamic = "force-dynamic";

/**
 * Update day-pass booking status (admin only)
 * Allowed status transitions:
 * - PENDING → CONFIRMED (admin approval)
 * - CONFIRMED → ACTIVATED (guest arrival - activate day pass)
 * - ACTIVATED → COMPLETED (guest checkout)
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
    return await transitionBookingStatus("day_pass_bookings", id, body?.status, DAY_PASS_STATUS_TRANSITIONS);
  } catch (error: any) {
    console.error("[Day-Pass Status Update] Error:", error?.message);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
