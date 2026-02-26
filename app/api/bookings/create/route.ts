import { NextRequest, NextResponse } from "next/server";
import { createBooking, calculateBookingPrice } from "@/lib/services/booking";
import { createPaymentWithCurrencyConversion } from "@/lib/services/paystack";
import { getUserById } from "@/lib/services/auth";
import prisma from "@/lib/services/prisma";

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
    } = body;

    // Validation
    if (
      !userId ||
      !roomId ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get user for currency information
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get room information
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Calculate total booking price
    const totalPriceNGN = calculateBookingPrice(
      room.priceNGN,
      checkIn,
      checkOut,
    );

    // Create booking with atomic transaction
    const booking = await createBooking({
      userId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      specialRequests,
    });

    // Initialize payment if email exists
    if (user.email) {
      try {
        const paymentResult = await createPaymentWithCurrencyConversion(
          user.email,
          totalPriceNGN,
          user.currency || "NGN",
          booking.id,
          {
            roomTitle: room.title,
            checkInDate: checkIn.toISOString(),
            checkOutDate: checkOut.toISOString(),
            numberOfGuests,
          },
        );

        return NextResponse.json(
          {
            success: true,
            booking,
            payment: {
              amountNGN: totalPriceNGN,
              userCurrency: user.currency,
              paymentUrl: paymentResult.paymentUrl,
              reference: paymentResult.reference,
            },
          },
          { status: 201 },
        );
      } catch (paymentError) {
        console.error("Payment initialization failed:", paymentError);
        // Return booking even if payment init fails
        return NextResponse.json(
          {
            success: true,
            booking,
            payment: { error: "Payment initialization failed" },
          },
          { status: 201 },
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        booking,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating booking:", error);

    // Handle specific error cases
    if (
      error.message.includes("double-booked") ||
      error.message.includes("not available")
    ) {
      return NextResponse.json(
        { error: error.message || "Room is not available for selected dates" },
        { status: 409 },
      );
    }

    if (error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "This room has been booked for the selected dates" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 },
    );
  }
}
