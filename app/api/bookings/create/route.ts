import { NextRequest, NextResponse } from "next/server";
import {
  createBooking,
  isRoomAvailable,
  calculateBookingPrice,
} from "@/lib/services/booking";
import { getUserByEmail } from "@/lib/services/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      email,
      firstName,
      lastName,
      phone,
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

    // Check room availability
    const available = await isRoomAvailable(roomId, checkIn, checkOut);
    if (!available) {
      return NextResponse.json(
        { error: "Room is not available for selected dates" },
        { status: 409 },
      );
    }

    // Find or create user
    let actualUserId = userId;
    if (!actualUserId && email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        actualUserId = existingUser.id;
      } else {
        // For guest bookings, generate a temporary ID
        actualUserId = `guest-${Date.now()}`;
      }
    }

    if (!actualUserId) {
      return NextResponse.json(
        { error: "User information is required" },
        { status: 400 },
      );
    }

    // Calculate price
    const totalAmount = await calculateBookingPrice(roomId, checkIn, checkOut);

    // Create booking
    const booking = await createBooking({
      userId: actualUserId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      specialRequests: specialRequests || "",
      status: "PENDING",
    });

    const paystackReference = `${booking.id}-${Date.now()}`;

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
