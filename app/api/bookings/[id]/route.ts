import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { getBookingDetails } = await import("@/lib/services/booking");
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const booking = await getBookingDetails(bookingId);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Error getting booking:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get booking" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { cancelBooking } = await import("@/lib/services/booking");
    const bookingId = params.id;
    const body = await request.json();
    const { userId, action } = body;

    if (!bookingId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, userId" },
        { status: 400 },
      );
    }

    // Only support cancel action for now
    if (action === "cancel") {
      const cancelledBooking = await cancelBooking(bookingId, userId);
      return NextResponse.json(cancelledBooking);
    }

    return NextResponse.json(
      { error: `Action '${action}' not supported` },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Error updating booking:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 },
    );
  }
}
