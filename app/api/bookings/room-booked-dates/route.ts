import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "Missing roomId query parameter" },
        { status: 400 },
      );
    }

    // Import booking service
    const { getRoomBookings } = await import("@/lib/services/booking");

    // Fetch bookings for the next 365 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 365);

    const bookings = await getRoomBookings(roomId, startDate, endDate);

    // Extract booked dates from bookings
    const bookedDates: string[] = [];

    bookings.forEach((booking: any) => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);

      // Add all dates in the booking range
      const currentDate = new Date(checkIn);
      while (currentDate < checkOut) {
        bookedDates.push(currentDate.toISOString().split("T")[0]); // YYYY-MM-DD format
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return NextResponse.json({
      roomId,
      bookedDates: [...new Set(bookedDates)], // Remove duplicates
      bookingCount: bookings.length,
    });
  } catch (error: any) {
    console.error("Error fetching room booked dates:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch booked dates",
        bookedDates: [],
        roomId: request.nextUrl.searchParams.get("roomId"),
      },
      { status: 500 },
    );
  }
}
