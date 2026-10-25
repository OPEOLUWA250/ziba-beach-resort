import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isRoomAvailable, ROOM_HOLD_MINUTES } from "@/lib/services/booking";
import { requireAdmin } from "@/lib/server/require-admin";
import { roomBookingCreateSchema } from "@/lib/security/validators";
import { generateRoomBookingReference } from "@/lib/utils/booking-reference";

export const dynamic = "force-dynamic";

const DAY_MS = 86_400_000;
const MAX_REFERENCE_ATTEMPTS = 5;

type InsertResult =
  | { ok: true; booking: Record<string, any> }
  | { ok: false; status: number; error: string };

/**
 * Reserve the room atomically. The create_room_booking RPC takes a per-room
 * advisory lock, re-checks overlap and inserts in one transaction, so two
 * concurrent requests cannot both book the same dates. If the migration that
 * creates the RPC has not been applied yet, fall back to the (racy)
 * check-then-insert so bookings keep working.
 */
async function insertBooking(row: Record<string, unknown>): Promise<InsertResult> {
  for (let attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS; attempt++) {
    const payload = { ...row, booking_reference_code: generateRoomBookingReference() };

    const rpc = await supabaseServer.rpc("create_room_booking", {
      p_booking: payload,
      p_hold_minutes: ROOM_HOLD_MINUTES,
    });

    let error = rpc.error;
    let booking = rpc.data as Record<string, any> | null;

    if (error?.code === "PGRST202" || error?.code === "42883") {
      console.warn(
        "[Create Booking] create_room_booking RPC missing; apply supabase/migrations. Using non-atomic fallback.",
      );
      const available = await isRoomAvailable(
        String(row.room_id),
        new Date(String(row.check_in_date)),
        new Date(String(row.check_out_date)),
      );
      if (!available) {
        return { ok: false, status: 409, error: "ROOM_UNAVAILABLE" };
      }
      const insert = await supabaseServer.from("bookings").insert(payload).select().single();
      error = insert.error;
      booking = insert.data;
    }

    if (!error && booking) return { ok: true, booking };

    if (error?.message?.includes("ROOM_UNAVAILABLE")) {
      return { ok: false, status: 409, error: "ROOM_UNAVAILABLE" };
    }
    // Unique violation on booking_reference_code: retry with a new code.
    if (error?.code === "23505" && error.message.includes("booking_reference_code")) {
      continue;
    }

    console.error("[Create Booking] Insert failed:", error?.message);
    return { ok: false, status: 500, error: "Failed to save booking" };
  }

  return { ok: false, status: 500, error: "Could not allocate a booking reference" };
}

/**
 * Create a manual room booking (admin only).
 *
 * Guests book rooms on the resort's IPMS booking engine, which owns room
 * availability and rates; this endpoint records walk-in / phone bookings
 * that staff take directly, for the operations and check-in tools.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const body = await request.json();
    const parsed = roomBookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      guestEmail,
      guestName,
      guestPhone,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
    } = parsed.data;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 },
      );
    }

    const numberOfNights = Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS);
    if (numberOfNights < 1 || numberOfNights > 60) {
      return NextResponse.json({ error: "Stay must be between 1 and 60 nights" }, { status: 400 });
    }

    // Staff may record the negotiated nightly rate; default to the room's price.
    const { data: room } = await supabaseServer
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .maybeSingle();

    const roomPriceNGN =
      parsed.data.roomPriceNGN ?? Number(room?.pricengn ?? room?.priceNGN ?? 0);

    if (!(roomPriceNGN > 0)) {
      return NextResponse.json({ error: "Enter the nightly rate for this booking" }, { status: 400 });
    }

    const result = await insertBooking({
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
      total_amount_ngn: roomPriceNGN * numberOfNights,
      payment_status: "PENDING",
      payment_type: "manual",
      date_of_booking: new Date().toISOString(),
      paystack_reference: null,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            result.error === "ROOM_UNAVAILABLE"
              ? "This room already has a booking on those dates."
              : result.error,
        },
        { status: result.status },
      );
    }

    console.log(`[Create Booking] ${auth.admin.username} created manual booking ${result.booking.id}`);
    return NextResponse.json(
      { success: true, booking: { id: result.booking.id, ...result.booking } },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[Create Booking] Error:", error?.message);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
