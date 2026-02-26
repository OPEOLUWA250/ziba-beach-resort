import { NextRequest, NextResponse } from "next/server";
import { getUserBookings } from "@/lib/services/booking";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 },
      );
    }

    const bookings = await getUserBookings(userId);

    return NextResponse.json({
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error("Error getting bookings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get bookings" },
      { status: 500 },
    );
  }
}
