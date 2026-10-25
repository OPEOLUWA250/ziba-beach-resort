import { NextRequest, NextResponse } from "next/server";
import { getBookingDetails } from "@/lib/services/booking";
import { canViewBooking } from "@/lib/server/booking-access";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Booking details for the confirmation page. Requires `?ref=<paystack ref>`
 * matching the booking (or an admin session), so booking IDs cannot be
 * enumerated to read guest details.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rate = await rateLimitByIp(request.headers, "api:bookings:get", 60, 60_000);
    if (!rate.allowed) return tooManyRequests(rate);

    const { id: bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const booking = await getBookingDetails(bookingId);

    // Same response for "missing" and "not yours" so IDs can't be probed.
    if (!booking || !(await canViewBooking(request, booking))) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error("Error getting booking:", error?.message);
    return NextResponse.json({ error: "Failed to get booking" }, { status: 500 });
  }
}
