import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRoomAvailable } from "@/lib/services/booking";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      guestEmail,
      guestName,
      guestPhone,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      roomPriceNGN,
      numberOfNights,
      paymentStatus,
    } = body;

    // Validation
    if (
      !guestEmail ||
      !guestName ||
      !guestPhone ||
      !roomId ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests ||
      !roomPriceNGN ||
      !numberOfNights
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 },
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 },
      );
    }

    // Calculate total
    const totalAmountNGN = roomPriceNGN * numberOfNights;

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check availability BEFORE creating booking
    const isAvailable = await isRoomAvailable(roomId, checkIn, checkOut);

    if (!isAvailable) {
      return NextResponse.json(
        {
          error:
            "Room is not available for the selected dates. Please choose different dates.",
        },
        { status: 409 },
      );
    }

    // Generate booking reference code: ZB-YYYY-NNNNN (Always generated)
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 90000) + 10000; // 5 digit random number
    const bookingReferenceCode = `ZB-${year}-${randomNumber}`;

    // Determine if this is admin-created (PENDING) or customer booking (RESERVED)
    const isAdminCreated = paymentStatus === "PENDING";

    // Only generate Paystack reference for customer bookings, not for admin-created
    const paystackReference = isAdminCreated
      ? null
      : `ziba-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Save booking to database
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        guest_email: guestEmail,
        guest_name: guestName,
        guest_phone: guestPhone,
        room_id: roomId,
        check_in_date: checkIn.toISOString(),
        check_out_date: checkOut.toISOString(),
        number_of_guests: numberOfGuests,
        special_requests: specialRequests || "",
        room_price_ngn: roomPriceNGN,
        number_of_nights: numberOfNights,
        total_amount_ngn: totalAmountNGN,
        payment_status: paymentStatus || "RESERVED",
        paystack_reference: paystackReference,
        booking_reference_code: bookingReferenceCode,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Error saving booking:", bookingError);
      return NextResponse.json(
        { error: `Failed to save booking: ${bookingError.message}` },
        { status: 500 },
      );
    }

    // Only perform Paystack operations for customer bookings (RESERVED status)
    if (!isAdminCreated) {
      // Initialize Paystack payment
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

      if (!paystackSecretKey) {
        console.error("Missing Paystack secret key");
        return NextResponse.json(
          { error: "Payment gateway configuration error" },
          { status: 500 },
        );
      }

      // Call Paystack API to initialize transaction
      const paystackResponse = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${paystackSecretKey}`,
          },
          body: JSON.stringify({
            email: guestEmail,
            amount: totalAmountNGN * 100, // Paystack uses kobo (1 NGN = 100 kobo)
            reference: paystackReference,
            metadata: {
              booking_id: booking.id,
              room_id: roomId,
              check_in_date: checkIn.toISOString(),
              check_out_date: checkOut.toISOString(),
              guest_name: guestName,
              guest_phone: guestPhone,
            },
          }),
        },
      );

      const paystackData = await paystackResponse.json();

      if (!paystackResponse.ok || !paystackData.status) {
        console.error("Paystack initialization failed:", paystackData);
        return NextResponse.json(
          { error: "Failed to initialize payment" },
          { status: 500 },
        );
      }

      // Update booking with Paystack details
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          paystack_access_code: paystackData.data.access_code,
          paystack_authorization_url: paystackData.data.authorization_url,
        })
        .eq("id", booking.id);

      if (updateError) {
        if (updateError.code !== "PGRST204") {
          console.error(
            "Error updating booking with Paystack details:",
            updateError,
          );
        }
      }

      return NextResponse.json(
        {
          success: true,
          booking: {
            id: booking.id,
            ...booking,
          },
          payment: {
            reference: paystackReference,
            authorizationUrl: paystackData.data.authorization_url,
            accessCode: paystackData.data.access_code,
          },
        },
        { status: 201 },
      );
    }

    // Admin-created bookings: return only booking details, no payment info
    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          ...booking,
        },
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
