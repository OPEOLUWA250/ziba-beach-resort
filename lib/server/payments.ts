import { after } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  allowUnverifiedPayments,
  type PaystackTransaction,
  verifyTransaction,
} from "@/lib/server/paystack";
import { sendRoomConfirmationEmail } from "@/lib/server/booking-emails";
import { sendDayPassEmail } from "@/lib/server/day-pass-emails";

export type BookingKind = "room" | "day_pass";

interface KindConfig {
  table: string;
  amountColumn: string;
  /** Status of a booking created online and awaiting payment. */
  unpaidStatus: string;
  /** Status a booking moves to once payment is verified. */
  paidStatus: string;
  /** Statuses that mean payment has already been recorded. */
  postPaymentStatuses: string[];
  paidFields: () => Record<string, unknown>;
}

export const BOOKING_KINDS: Record<BookingKind, KindConfig> = {
  room: {
    table: "bookings",
    amountColumn: "total_amount_ngn",
    unpaidStatus: "RESERVED",
    paidStatus: "PENDING", // admin then approves to CONFIRMED
    postPaymentStatuses: ["PENDING", "CONFIRMED", "CHECKED_IN", "COMPLETED"],
    paidFields: () => {
      const now = new Date().toISOString();
      return { paid_at: now, updated_at: now };
    },
  },
  day_pass: {
    table: "day_pass_bookings",
    amountColumn: "total_amount",
    unpaidStatus: "RESERVED",
    paidStatus: "PENDING",
    postPaymentStatuses: ["PENDING", "CONFIRMED", "ACTIVATED", "COMPLETED"],
    paidFields: () => ({ updated_at: new Date().toISOString() }),
  },
};

export type ConfirmOutcome =
  | "confirmed"
  | "already_processed"
  | "not_paid"
  | "mismatch"
  | "not_found"
  | "invalid_state"
  | "error";

export interface ConfirmResult {
  outcome: ConfirmOutcome;
  message: string;
  booking?: Record<string, any> | null;
  paystackStatus?: string;
}

export const HTTP_STATUS_FOR_OUTCOME: Record<ConfirmOutcome, number> = {
  confirmed: 200,
  already_processed: 200,
  not_paid: 400,
  mismatch: 400,
  not_found: 404,
  invalid_state: 409,
  error: 500,
};

/** Guess the booking kind from the payment reference prefix. */
export function kindForReference(reference: string): BookingKind | null {
  if (reference.startsWith("ziba-")) return "room";
  if (reference.startsWith("dp-")) return "day_pass";
  return null;
}

/**
 * Record a verified payment against a booking. Safe to call any number of
 * times from any source (client callback, webhook, cron): only the first
 * call that observes the unpaid status moves it forward.
 *
 * The payment is accepted only if Paystack reports a successful NGN charge
 * for the booking's own stored reference, for at least the booking's amount.
 * A reference supplied by the client is never trusted or stored.
 */
export async function confirmBookingPayment(input: {
  kind: BookingKind;
  bookingId?: string;
  reference?: string;
  /** Pre-verified transaction (e.g. from a signature-checked webhook). */
  transaction?: PaystackTransaction;
}): Promise<ConfirmResult> {
  const cfg = BOOKING_KINDS[input.kind];

  let query = supabaseServer.from(cfg.table).select("*");
  if (input.bookingId) {
    query = query.eq("id", input.bookingId);
  } else if (input.reference) {
    query = query.eq("paystack_reference", input.reference);
  } else {
    return { outcome: "not_found", message: "Booking not found" };
  }

  const { data: booking, error: findError } = await query.maybeSingle();
  if (findError) {
    if (findError.code === "22P02") {
      return { outcome: "not_found", message: "Invalid booking id" };
    }
    console.error(`[Payments] Lookup failed (${cfg.table}):`, findError.message);
    return { outcome: "error", message: "Database error" };
  }
  if (!booking) {
    return { outcome: "not_found", message: "Booking not found" };
  }

  if (cfg.postPaymentStatuses.includes(booking.payment_status)) {
    return { outcome: "already_processed", message: "Payment already recorded", booking };
  }
  if (booking.payment_status !== cfg.unpaidStatus) {
    if (input.transaction) {
      // Money arrived for a booking that was cancelled/expired: needs a human.
      console.error(
        `[Payments] ACTION REQUIRED: payment ${booking.paystack_reference} received for ${cfg.table} ${booking.id} in status ${booking.payment_status}. Refund or reinstate manually.`,
      );
    }
    return {
      outcome: "invalid_state",
      message: `Booking is ${booking.payment_status}; payment cannot be applied`,
      booking,
    };
  }

  const reference: string | null = booking.paystack_reference;
  if (!reference) {
    return { outcome: "invalid_state", message: "Booking has no online payment", booking };
  }

  let tx = input.transaction;
  if (!tx) {
    if (allowUnverifiedPayments()) {
      console.warn(`[Payments] DEMO MODE: accepting unverified payment for ${reference}`);
    } else {
      const verified = await verifyTransaction(reference);
      if (!verified.ok) {
        return {
          outcome: verified.status === "unavailable" || verified.status === "unconfigured" ? "error" : "not_paid",
          message: verified.message,
          paystackStatus: verified.status,
        };
      }
      tx = verified.transaction;
    }
  }

  if (tx) {
    const expectedKobo = Math.round(Number(booking[cfg.amountColumn] || 0) * 100);
    const currency = (tx.currency || "NGN").toUpperCase();
    const problems: string[] = [];
    if (tx.status !== "success") problems.push(`status=${tx.status}`);
    if (tx.reference !== reference) problems.push("reference mismatch");
    if (currency !== "NGN") problems.push(`currency=${currency}`);
    if (!(expectedKobo > 0) || Number(tx.amount) < expectedKobo) {
      problems.push(`amount ${tx.amount} < expected ${expectedKobo}`);
    }
    if (problems.length > 0) {
      console.error(
        `[Payments] Rejected payment for ${cfg.table} ${booking.id}: ${problems.join(", ")}`,
      );
      return {
        outcome: tx.status === "success" ? "mismatch" : "not_paid",
        message: "Payment does not match this booking",
        paystackStatus: tx.status,
      };
    }
  }

  // Optimistic concurrency: the update only applies while the row is still
  // unpaid, so concurrent confirmations cannot double-apply or regress state.
  const applyUpdate = (fields: Record<string, unknown>) =>
    supabaseServer
      .from(cfg.table)
      .update({ payment_status: cfg.paidStatus, ...fields })
      .eq("id", booking.id)
      .eq("payment_status", cfg.unpaidStatus)
      .select();

  let { data: updated, error: updateError } = await applyUpdate(cfg.paidFields());
  if (updateError?.code === "42703") {
    // Optional column (paid_at/updated_at) missing on this deployment.
    ({ data: updated, error: updateError } = await applyUpdate({}));
  }
  if (updateError) {
    console.error(`[Payments] Update failed (${cfg.table} ${booking.id}):`, updateError.message);
    return { outcome: "error", message: "Failed to record payment" };
  }

  if (!updated || updated.length === 0) {
    const { data: current } = await supabaseServer
      .from(cfg.table)
      .select("*")
      .eq("id", booking.id)
      .maybeSingle();
    if (current && cfg.postPaymentStatuses.includes(current.payment_status)) {
      return { outcome: "already_processed", message: "Payment already recorded", booking: current };
    }
    return { outcome: "invalid_state", message: "Booking changed during confirmation", booking: current };
  }

  const confirmed = updated[0];
  console.log(`[Payments] Recorded payment for ${cfg.table} ${confirmed.id}`);

  if (input.kind === "room") {
    await flagRoomConflicts(confirmed);
  }

  // Send the guest email from the server so it no longer depends on the
  // browser staying open. after() keeps the function alive past the
  // response on Vercel. Failures are retried by the daily cron jobs.
  const send = () =>
    (input.kind === "room"
      ? sendRoomConfirmationEmail(String(confirmed.id))
      : sendDayPassEmail("confirmation", String(confirmed.id))
    ).catch((error) => console.error("[Payments] Confirmation email failed:", error?.message));
  try {
    after(send);
  } catch {
    await send(); // called outside a request scope
  }

  return { outcome: "confirmed", message: "Payment recorded; awaiting admin approval", booking: confirmed };
}

/**
 * A RESERVED hold lasts ROOM_HOLD_MINUTES. If the guest paid after the hold
 * lapsed and someone else booked the same dates meanwhile, surface it loudly
 * so staff can resolve it before approving.
 */
async function flagRoomConflicts(booking: Record<string, any>) {
  const { data: conflicts } = await supabaseServer
    .from("bookings")
    .select("id")
    .eq("room_id", booking.room_id)
    .neq("id", booking.id)
    .in("payment_status", ["PENDING", "CONFIRMED", "CHECKED_IN"])
    .gt("check_out_date", booking.check_in_date)
    .lt("check_in_date", booking.check_out_date);

  if (conflicts && conflicts.length > 0) {
    console.error(
      `[Payments] ACTION REQUIRED: paid booking ${booking.id} overlaps booking(s) ${conflicts
        .map((c) => c.id)
        .join(", ")} for room ${booking.room_id}.`,
    );
  }
}

/** Try every booking table for a reference (used when the prefix is unknown). */
export async function confirmPaymentByReference(
  reference: string,
  transaction?: PaystackTransaction,
): Promise<ConfirmResult> {
  const guess = kindForReference(reference);
  const order: BookingKind[] = guess
    ? [guess, ...(["room", "day_pass"] as BookingKind[]).filter((k) => k !== guess)]
    : ["room", "day_pass"];

  for (const kind of order) {
    const result = await confirmBookingPayment({ kind, reference, transaction });
    if (result.outcome !== "not_found") return result;
  }
  return { outcome: "not_found", message: "No booking for this reference" };
}
