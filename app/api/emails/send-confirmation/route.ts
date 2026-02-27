import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, email, bookingDetails } = body;

    if (!bookingId || !email) {
      return NextResponse.json(
        { error: "Missing bookingId or email" },
        { status: 400 },
      );
    }

    // Dynamically import to avoid build-time issues
    const { sendBookingConfirmation } = await import("@/lib/services/email");

    // If booking details passed directly (from payment page), use them
    if (bookingDetails) {
      const result = await sendBookingConfirmation(email, {
        id: bookingDetails.id || bookingId,
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        roomTitle: bookingDetails.roomTitle,
        totalAmount: bookingDetails.totalAmount,
        numberOfGuests: bookingDetails.numberOfGuests,
      });

      if (result.error) {
        console.error("Resend error:", result.error);
        return NextResponse.json(
          { error: "Failed to send email", details: result.error },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Confirmation email sent successfully",
        result,
      });
    }

    // Fall back to database lookup if details not provided
    const { default: prisma } = await import("@/lib/services/prisma");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Calculate total amount
    const nights = Math.ceil(
      (new Date(booking.checkOutDate).getTime() -
        new Date(booking.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalAmount = booking.room.priceNGN * nights;

    // Send email via Resend
    const result = await sendBookingConfirmation(email, {
      id: booking.id,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      roomTitle: booking.room.title,
      totalAmount,
      numberOfGuests: booking.numberOfGuests,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
      result,
    });
  } catch (error: any) {
    console.error("Email endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send confirmation email" },
      { status: 500 },
    );
  }
}
