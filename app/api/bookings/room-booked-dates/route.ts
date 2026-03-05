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
      // Parse dates as UTC to avoid timezone shifts
      const checkInStr = booking.check_in_date.split("T")[0]; // Get YYYY-MM-DD
      const checkOutStr = booking.check_out_date.split("T")[0]; // Get YYYY-MM-DD

      const [checkInYear, checkInMonth, checkInDay] = checkInStr
        .split("-")
        .map(Number);
      const [checkOutYear, checkOutMonth, checkOutDay] = checkOutStr
        .split("-")
        .map(Number);

      const checkIn = new Date(
        Date.UTC(checkInYear, checkInMonth - 1, checkInDay),
      );
      const checkOut = new Date(
        Date.UTC(checkOutYear, checkOutMonth - 1, checkOutDay),
      );

      // Add all dates in the booking range (check-in to day before check-out)
      const currentDate = new Date(checkIn);
      while (currentDate < checkOut) {
        const year = currentDate.getUTCFullYear();
        const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getUTCDate()).padStart(2, "0");
        bookedDates.push(`${year}-${month}-${day}`);
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
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
