import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/require-admin";
import { checkInDayPass, loadCheckInView } from "@/lib/server/check-in";
import { isBookingId } from "@/lib/server/day-pass-qr";

export const dynamic = "force-dynamic";

/** Booking details + check-in verdict for the staff scan page. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isBookingId(id)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  try {
    const view = await loadCheckInView(id);
    if (!view) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ booking: view }, { headers: { "Cache-Control": "no-store" } });
  } catch (error: any) {
    console.error("[Check-in GET] Error:", error?.message);
    return NextResponse.json({ error: "Failed to load booking" }, { status: 500 });
  }
}

/**
 * Check a guest in. Body: { approve?: boolean, override?: boolean }, the
 * staff confirmations required by the booking's warnings.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isBookingId(id)) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  try {
    const result = await checkInDayPass(id, auth.admin, {
      approve: body?.approve === true,
      override: body?.override === true,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error, booking: result.view ?? null }, { status: result.status });
    }
    return NextResponse.json({ success: true, booking: result.view });
  } catch (error: any) {
    console.error("[Check-in POST] Error:", error?.message);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
