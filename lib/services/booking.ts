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
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("roomId", roomId)
      .in("status", ["PENDING", "CONFIRMED"])
      .lt("checkOutDate", checkOutDate.toISOString())
      .gt("checkInDate", checkInDate.toISOString());

    if (error) throw error;

    return (data?.length || 0) === 0;
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
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("roomId", roomId)
      .in("status", ["PENDING", "CONFIRMED"])
      .gte("checkInDate", startDate.toISOString())
      .lte("checkOutDate", endDate.toISOString());

    if (error) throw error;

    return data || [];
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
      .select("*")
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

    // Transform Supabase snake_case to confirmation page format
    return {
      id: data.id,
      checkInDate: data.check_in_date,
      checkOutDate: data.check_out_date,
      numberOfGuests: data.number_of_guests,
      specialRequests: data.special_requests,
      room: {
        title: "Standard Room", // You may want to fetch room details separately
        priceNGN: data.room_price_ngn,
      },
      user: {
        firstName: data.guest_name?.split(" ")[0] || "",
        lastName: data.guest_name?.split(" ").slice(1).join(" ") || "",
        email: data.guest_email,
      },
      payment: {
        amountNGN: data.total_amount_ngn,
        paystackReference: data.paystack_reference,
        paymentStatus: data.payment_status,
      },
    };
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
