import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      email,
      firstName,
      lastName,
      phone,
      totalAmount,
    } = body;

    // Validation
    if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: roomId, checkInDate, checkOutDate, numberOfGuests",
        },
        { status: 400 },
      );
    }

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Guest email and first name are required" },
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

    // Generate booking ID
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create booking object (mock - no database call)
    const booking = {
      id: bookingId,
      roomId,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      numberOfGuests,
      specialRequests: specialRequests || "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const paystackReference = `${bookingId}-${Date.now()}`;

    return NextResponse.json(
      {
        success: true,
        booking: {
          ...booking,
          email,
          firstName,
          lastName,
          phone,
          totalAmount,
        },
        paystackReference,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create booking",
      },
      { status: 500 },
    );
  }
}
