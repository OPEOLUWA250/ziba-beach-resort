import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, checkInDate, checkOutDate } = body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: "Missing required fields: roomId, checkInDate, checkOutDate" },
        { status: 400 },
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 },
      );
    }

    try {
      const { isRoomAvailable } = await import("@/lib/services/booking");
      const available = await isRoomAvailable(roomId, checkIn, checkOut);

      return NextResponse.json({
        roomId,
        available,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });
    } catch (dbError: any) {
      console.error("Database error checking availability:", dbError);
      // On database error, return unavailable for safety (prevent double bookings)
      return NextResponse.json({
        roomId,
        available: false,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        error: "Unable to verify availability at this time",
      });
    }
  } catch (error: any) {
    console.error("Error in check-availability endpoint:", error);
    // Return unavailable on error for safety (prevent double bookings)
    return NextResponse.json({
      available: false,
      error: error.message || "Could not verify availability, please try again",
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get("roomId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required query params: roomId, checkIn, checkOut" },
        { status: 400 },
      );
    }

    const checkInDate = new Date(checkIn + "T00:00:00.000Z");
    const checkOutDate = new Date(checkOut + "T00:00:00.000Z");

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 },
      );
    }

    try {
      const { isRoomAvailable } = await import("@/lib/services/booking");
      const available = await isRoomAvailable(
        roomId,
        checkInDate,
        checkOutDate,
      );

      return NextResponse.json({
        roomId,
        available,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
      });
    } catch (dbError: any) {
      console.error("Database error checking availability:", dbError);
      // On database error, return unavailable for safety (prevent double bookings)
      return NextResponse.json({
        roomId,
        available: false,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        error: "Unable to verify availability at this time",
      });
    }
  } catch (error: any) {
    console.error("Error in check-availability GET endpoint:", error);
    return NextResponse.json(
      {
        available: false,
        error: error.message || "Failed to check availability",
      },
      { status: 500 },
    );
  }
}
