/**
 * Server-only booking queries (service-role client). Browser code must go
 * through the API routes; admin pages use lib/services/admin-bookings.ts.
 */
import { supabaseServer as supabase } from "@/lib/supabase/server";

/** How long an unpaid online booking holds its dates while payment runs. */
export const ROOM_HOLD_MINUTES = 10;

/** Statuses that always occupy a room for their dates. */
export const BLOCKING_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN"];

function holdCutoffIso() {
  return new Date(Date.now() - ROOM_HOLD_MINUTES * 60 * 1000).toISOString();
}

/**
 * Bookings occupying `roomId` between the two dates: blocking statuses, plus
 * RESERVED rows still inside their payment hold. One query, using the
 * (room_id, check_in_date, check_out_date) index.
 */
async function getOccupyingBookings(roomId: string, startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, payment_status, check_in_date, check_out_date")
    .eq("room_id", roomId)
    .gt("check_out_date", startDate.toISOString())
    .lt("check_in_date", endDate.toISOString())
    .or(
      `payment_status.in.(${BLOCKING_STATUSES.join(",")}),and(payment_status.eq.RESERVED,created_at.gt.${holdCutoffIso()})`,
    );

  if (error) throw error;
  return data || [];
}

export async function isRoomAvailable(
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
): Promise<boolean> {
  try {
    const occupying = await getOccupyingBookings(roomId, checkInDate, checkOutDate);
    return occupying.length === 0;
  } catch (error) {
    console.error("Error checking room availability:", error);
    // SECURITY: Return false on error to prevent double bookings
    // Better to block a booking than allow a double booking
    return false;
  }
}

/** Date ranges only — no guest data — for the public booking calendar. */
export async function getRoomBookings(roomId: string, startDate: Date, endDate: Date) {
  try {
    return await getOccupyingBookings(roomId, startDate, endDate);
  } catch (error) {
    console.error("Error fetching room bookings:", error);
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
      if (error.code === "PGRST116" || error.code === "22P02") {
        return null;
      }
      throw error;
    }

    // Return all booking data as-is (confirmation page expects these fields)
    return data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return null;
  }
}

/**
 * Get booking by reference code and email (for guest lookups)
 */
export async function getBookingByReference(referenceCode: string, email: string) {
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
      // Case-insensitive exact match: escape LIKE wildcards (common "_" in emails).
      .ilike("guest_email", email.trim().replace(/[\\%_]/g, "\\$&"))
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Error fetching booking by reference:", error.message);
      }
      return null;
    }

    return booking;
  } catch (error) {
    console.error("Error in getBookingByReference:", error);
    return null;
  }
}
