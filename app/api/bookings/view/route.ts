import { NextRequest, NextResponse } from "next/server";
import { getBookingByReference } from "@/lib/services/booking";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ref = searchParams.get("ref");
    const email = searchParams.get("email");

    if (!ref || !email) {
      return NextResponse.json(
        { error: "Booking reference and email are required" },
        { status: 400 },
      );
    }

    const booking = await getBookingByReference(ref, email);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        booking,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch booking",
      },
      { status: 500 },
    );
  }
}
