import { supabase } from "@/lib/supabase/client";

interface CreateBookingInput {
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
}

export async function isRoomAvailable(
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
): Promise<boolean> {
  try {
    const reservationHoldMinutes = 10;
    const reservedUntil = new Date(Date.now() - reservationHoldMinutes * 60 * 1000);

    // Check for CONFIRMED bookings (always blocking)
    const { data: confirmedBookings, error: confirmedError } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", roomId)
      .eq("payment_status", "CONFIRMED")
      .gt("check_out_date", checkInDate.toISOString())
      .lt("check_in_date", checkOutDate.toISOString());

    if (confirmedError) throw confirmedError;
    if (confirmedBookings && confirmedBookings.length > 0) {
      console.log(`[Availability] Room ${roomId} has CONFIRMED booking blocking dates`);
      return false;
    }

    // Check for non-expired RESERVED bookings (hold period still active)
    const { data: reservedBookings, error: reservedError } = await supabase
      .from("bookings")
      .select("id, created_at")
      .eq("room_id", roomId)
      .eq("payment_status", "RESERVED")
      .gt("created_at", reservedUntil.toISOString())
      .gt("check_out_date", checkInDate.toISOString())
      .lt("check_in_date", checkOutDate.toISOString());

    if (reservedError) throw reservedError;
    if (reservedBookings && reservedBookings.length > 0) {
      console.log(`[Availability] Room ${roomId} has active RESERVED booking(s) blocking dates`);
      return false;
    }

    console.log(`[Availability] Room ${roomId} is available for ${checkInDate.toDateString()} - ${checkOutDate.toDateString()}`);
    return true;
  } catch (error) {
    console.error("Error checking room availability:", error);
    return true;
  }
}

export async function getRoomBookings(
  roomId: string,
  startDate: Date,
  endDate: Date,
) {
  try {
    const reservationHoldMinutes = 10;
    const reservedUntil = new Date(Date.now() - reservationHoldMinutes * 60 * 1000);

    // Get all CONFIRMED bookings
    const { data: confirmedBookings, error: confirmedError } = await supabase
      .from("bookings")
      .select("*")
      .eq("room_id", roomId)
      .eq("payment_status", "CONFIRMED")
      .gt("check_out_date", startDate.toISOString())
      .lt("check_in_date", endDate.toISOString());

    if (confirmedError) throw confirmedError;

    // Get non-expired RESERVED bookings
    const { data: reservedBookings, error: reservedError } = await supabase
      .from("bookings")
      .select("*")
      .eq("room_id", roomId)
      .eq("payment_status", "RESERVED")
      .gt("created_at", reservedUntil.toISOString())
      .gt("check_out_date", startDate.toISOString())
      .lt("check_in_date", endDate.toISOString());

    if (reservedError) throw reservedError;

    // Combine both arrays
    const allBookings = [...(confirmedBookings || []), ...(reservedBookings || [])];
    return allBookings;
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    return [];
  }
}

export async function createBooking(input: CreateBookingInput) {
  try {
    const bookingId = `booking-${Date.now()}`;

    const { data, error } = await supabase.from("bookings").insert({
      id: bookingId,
      userId: input.userId,
      roomId: input.roomId,
      checkInDate: input.checkInDate.toISOString(),
      checkOutDate: input.checkOutDate.toISOString(),
      numberOfGuests: input.numberOfGuests,
      specialRequests: input.specialRequests || null,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (error) throw error;

    return {
      id: bookingId,
      ...input,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function cancelBooking(bookingId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "CANCELLED",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .eq("userId", userId);

    if (error) throw error;

    return { id: bookingId, status: "CANCELLED" };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}

export async function getUserBookings(userId: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}

export async function getBookingDetails(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        booking_reference_code,
        guest_name,
        guest_email,
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
        paystack_reference,
        created_at
      `,
      )
      .eq("id", bookingId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    // Return all booking data as-is (confirmation page expects these fields)
    return data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return null;
  }
}

export function calculateBookingPrice(
  pricePerNightNGN: number,
  checkInDate: Date,
  checkOutDate: Date,
): number {
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return pricePerNightNGN * nights;
}

export async function getAvailableRooms(checkInDate: Date, checkOutDate: Date) {
  try {
    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("status", "AVAILABLE");

    if (error) throw error;

    if (!rooms) return [];

    // Filter out rooms with conflicting bookings
    const availableRooms = [];

    for (const room of rooms) {
      const { data: conflictingBookings, error: conflictError } = await supabase
        .from("bookings")
        .select("id")
        .eq("roomId", room.id)
        .in("status", ["PENDING", "CONFIRMED"])
        .lt("checkOutDate", checkOutDate.toISOString())
        .gt("checkInDate", checkInDate.toISOString());

      if (
        !conflictError &&
        (!conflictingBookings || conflictingBookings.length === 0)
      ) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return [];
  }
}

/**
 * Get booking by reference code and email (for guest lookups)
 */
export async function getBookingByReference(
  referenceCode: string,
  email: string,
) {
  try {
    const { data: booking, error } = await supabase
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
        paystack_reference,
        created_at,
        paid_at
      `,
      )
      .eq("booking_reference_code", referenceCode)
      .eq("guest_email", email)
      .single();

    if (error) {
      console.error("Error fetching booking by reference:", error);
      return null;
    }

    return booking;
  } catch (error) {
    console.error("Error in getBookingByReference:", error);
    return null;
  }
}

/**
 * Get all bookings for admin dashboard
 */
export async function getAllBookings() {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        booking_reference_code,
        guest_name,
        guest_email,
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
        paystack_reference,
        created_at
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all bookings:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    return [];
  }
}

export async function getAllDayPassBookings() {
  try {
    const { data, error } = await supabase
      .from("day_pass_bookings")
      .select(
        `
        id,
        reference_code,
        full_name,
        email,
        phone,
        visit_date,
        items,
        total_amount,
        payment_status,
        paystack_reference,
        created_at
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all day-pass bookings:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllDayPassBookings:", error);
    return [];
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PAID"
    | "CHECKED_IN"
    | "COMPLETED"
    | "CANCELLED",
) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select();

    if (error) {
      console.error("Error updating booking status:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    return null;
  }
}

export async function updateDayPassBookingStatus(
  bookingId: string,
  status: "PENDING" | "COMPLETED" | "CANCELLED",
) {
  try {
    const { data, error } = await supabase
      .from("day_pass_bookings")
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select();

    if (error) {
      console.error("Error updating day-pass booking status:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error("Error in updateDayPassBookingStatus:", error);
    return null;
  }
}
