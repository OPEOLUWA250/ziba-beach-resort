import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Universal Receipt Lookup API
 * Searches across all booking types (rooms, day-pass, honeymoon)
 * Accepts Ziba references (ZB-xxx) or Paystack references
 * Email is optional for additional verification
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ref = searchParams.get("ref");
    const email = searchParams.get("email"); // Optional

    console.log("[Receipt Lookup] Search parameters:", { ref, email });

    if (!ref) {
      return NextResponse.json(
        { error: "Reference number is required" },
        { status: 400 },
      );
    }

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[Receipt Lookup] Missing Supabase credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine reference type
    const isZibaRef = ref.startsWith("ZB-");
    const isPaystackRef = !isZibaRef;

    let booking = null;
    let bookingType = null;

    // Search Room Bookings
    if (isZibaRef) {
      console.log("[Receipt Lookup] Searching room bookings for:", ref);
      console.log(
        "[Receipt Lookup] isZibaRef:",
        isZibaRef,
        "isPaystackRef:",
        isPaystackRef,
      );
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          booking_reference_code,
          guest_email,
          guest_name,
          guest_phone,
          room_id,
          check_in_date,
          check_out_date,
          number_of_guests,
          special_requests,
          room_price_ngn,
          number_of_nights,
          total_amount_ngn,
          payment_status,
          payment_type,
          paystack_reference,
          date_of_booking,
          created_at
        `,
        )
        .eq("booking_reference_code", ref)
        .maybeSingle();

      if (error) {
        console.error("[Receipt Lookup] Room bookings query error:", error);
        return NextResponse.json(
          { error: "Unable to query room bookings" },
          { status: 500 },
        );
      }

      console.log("[Receipt Lookup] Room booking data:", data);
      console.log("[Receipt Lookup] Room booking found:", !!data);
      console.log(
        "[Receipt Lookup] Email check - provided email:",
        email,
        "booking email:",
        data?.guest_email,
      );

      if (data) {
        const emailMatches =
          !email || data.guest_email.toLowerCase() === email.toLowerCase();
        console.log(
          "[Receipt Lookup] Email matches:",
          emailMatches,
          "email required:",
          !!email,
        );

        if (emailMatches) {
          console.log("[Receipt Lookup] Setting booking to room booking");
          booking = {
            ...data,
            bookingReferenceCode: data.booking_reference_code,
            guestEmail: data.guest_email,
            guestName: data.guest_name,
            guestPhone: data.guest_phone,
            roomId: data.room_id,
            checkInDate: data.check_in_date,
            checkOutDate: data.check_out_date,
            numberOfGuests: data.number_of_guests,
            specialRequests: data.special_requests,
            roomPriceNgn: data.room_price_ngn,
            numberOfNights: data.number_of_nights,
            totalAmountNgn: data.total_amount_ngn,
            paymentStatus: data.payment_status,
            paymentType: data.payment_type,
            paystackReference: data.paystack_reference,
            dateOfBooking: data.date_of_booking,
            createdAt: data.created_at,
          };
          bookingType = "room";
        } else {
          console.log(
            "[Receipt Lookup] Email mismatch - booking found but email doesn't match",
          );
        }
      }
    }

    // Search Day-Pass Bookings
    if (!booking && isZibaRef) {
      console.log("[Receipt Lookup] Searching day-pass bookings for:", ref);
      const { data, error } = await supabase
        .from("day_pass_bookings")
        .select("*")
        .eq("reference_code", ref)
        .maybeSingle();

      if (error) {
        console.error("[Receipt Lookup] Day-pass bookings query error:", error);
        return NextResponse.json(
          { error: "Unable to query day-pass bookings" },
          { status: 500 },
        );
      }

      console.log("[Receipt Lookup] Day-pass booking found:", !!data);

      if (
        data &&
        (!email || data.email.toLowerCase() === email.toLowerCase())
      ) {
        booking = {
          ...data,
          referenceCode: data.reference_code,
          fullName: data.full_name,
          visitDate: data.visit_date,
          totalAmount: data.total_amount,
          paymentStatus: data.payment_status,
          paymentType: data.payment_type,
          paystackReference: data.paystack_reference,
          dateOfBooking: data.date_of_booking,
          createdAt: data.created_at,
        };
        bookingType = "day-pass";
      }
    }

    // Search by Paystack Reference (across all booking types)
    if (!booking && isPaystackRef) {
      console.log("[Receipt Lookup] Searching by Paystack reference:", ref);
      // Try room bookings first
      const { data: roomData, error: roomError } = await supabase
        .from("bookings")
        .select(
          `
          id,
          booking_reference_code,
          guest_email,
          guest_name,
          guest_phone,
          room_id,
          check_in_date,
          check_out_date,
          number_of_guests,
          special_requests,
          room_price_ngn,
          number_of_nights,
          total_amount_ngn,
          payment_status,
          payment_type,
          paystack_reference,
          date_of_booking,
          created_at
        `,
        )
        .eq("paystack_reference", ref)
        .maybeSingle();

      if (roomError) {
        console.error(
          "[Receipt Lookup] Room Paystack search error:",
          roomError,
        );
        return NextResponse.json(
          { error: "Unable to query room bookings by payment reference" },
          { status: 500 },
        );
      }

      if (roomData) {
        console.log("[Receipt Lookup] Found room booking by Paystack ref");
      }

      if (
        roomData &&
        (!email || roomData.guest_email.toLowerCase() === email.toLowerCase())
      ) {
        booking = {
          ...roomData,
          bookingReferenceCode: roomData.booking_reference_code,
          guestEmail: roomData.guest_email,
          guestName: roomData.guest_name,
          guestPhone: roomData.guest_phone,
          roomId: roomData.room_id,
          checkInDate: roomData.check_in_date,
          checkOutDate: roomData.check_out_date,
          numberOfGuests: roomData.number_of_guests,
          specialRequests: roomData.special_requests,
          roomPriceNgn: roomData.room_price_ngn,
          numberOfNights: roomData.number_of_nights,
          totalAmountNgn: roomData.total_amount_ngn,
          paymentStatus: roomData.payment_status,
          paymentType: roomData.payment_type,
          paystackReference: roomData.paystack_reference,
          dateOfBooking: roomData.date_of_booking,
          createdAt: roomData.created_at,
        };
        bookingType = "room";
      }

      // Try day-pass bookings
      if (!booking) {
        const { data: dayPassData, error: dpError } = await supabase
          .from("day_pass_bookings")
          .select("*")
          .eq("paystack_reference", ref)
          .maybeSingle();

        if (dpError) {
          console.error(
            "[Receipt Lookup] Day-pass Paystack search error:",
            dpError,
          );
          return NextResponse.json(
            { error: "Unable to query day-pass bookings by payment reference" },
            { status: 500 },
          );
        }

        if (dayPassData) {
          console.log(
            "[Receipt Lookup] Found day-pass booking by Paystack ref",
          );
        }

        if (
          dayPassData &&
          (!email || dayPassData.email.toLowerCase() === email.toLowerCase())
        ) {
          booking = {
            ...dayPassData,
            referenceCode: dayPassData.reference_code,
            fullName: dayPassData.full_name,
            visitDate: dayPassData.visit_date,
            totalAmount: dayPassData.total_amount,
            paymentStatus: dayPassData.payment_status,
            paymentType: dayPassData.payment_type,
            paystackReference: dayPassData.paystack_reference,
            dateOfBooking: dayPassData.date_of_booking,
            createdAt: dayPassData.created_at,
          };
          bookingType = "day-pass";
        }
      }
    }

    if (!booking) {
      console.log("[Receipt Lookup] No booking found for reference:", ref);
      return NextResponse.json(
        {
          error: email
            ? "No booking found with that reference and email"
            : "No booking found with that reference",
        },
        { status: 404 },
      );
    }

    console.log(
      "[Receipt Lookup] Successfully found booking of type:",
      bookingType,
    );
    return NextResponse.json(
      {
        success: true,
        booking,
        bookingType,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Receipt Lookup] Unexpected error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch booking",
      },
      { status: 500 },
    );
  }
}
