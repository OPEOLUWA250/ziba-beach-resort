import { NextRequest, NextResponse } from "next/server";
import { isRoomAvailable, getAvailableRooms } from "@/lib/services/booking";

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

    const available = await isRoomAvailable(roomId, checkIn, checkOut);

    return NextResponse.json({
      roomId,
      available,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });
  } catch (error: any) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check availability" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: "Missing required query params: checkInDate, checkOutDate" },
        { status: 400 },
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const availableRooms = await getAvailableRooms(checkIn, checkOut);

    return NextResponse.json({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      availableRoomsCount: availableRooms.length,
      availableRooms,
    });
  } catch (error: any) {
    console.error("Error getting available rooms:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get available rooms" },
      { status: 500 },
    );
  }
}
