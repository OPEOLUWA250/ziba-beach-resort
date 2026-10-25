import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isCronAuthorized } from "@/lib/server/cron-auth";
import {
  BOOKING_KINDS,
  type BookingKind,
  confirmBookingPayment,
} from "@/lib/server/payments";
import { sendRoomConfirmationEmail } from "@/lib/server/booking-emails";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_SIZE = 25;
// Give the browser callback and webhook time to land before reconciling.
const MIN_AGE_MS = 15 * 60 * 1000;
// Unpaid online bookings older than this are cancelled.
const EXPIRE_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * Scheduled by vercel.json. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 *
 * 1. Unpaid online bookings (all three kinds) older than 15 min are verified
 *    with Paystack: paid ones are recorded (recovering lost webhooks /
 *    closed tabs), unpaid ones older than 24 h are cancelled to release the
 *    dates and keep the table small.
 * 2. Paid room bookings whose confirmation email never went out are retried.
 */
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary: Record<string, Record<string, number>> = {};
  const now = Date.now();

  for (const kind of Object.keys(BOOKING_KINDS) as BookingKind[]) {
    const cfg = BOOKING_KINDS[kind];
    const counts: Record<string, number> = {};
    summary[kind] = counts;

    const { data: stale, error } = await supabaseServer
      .from(cfg.table)
      .select("id, created_at")
      .eq("payment_status", cfg.unpaidStatus)
      .not("paystack_reference", "is", null)
      .lt("created_at", new Date(now - MIN_AGE_MS).toISOString())
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (error) {
      console.error(`[Reconcile] ${cfg.table} query failed:`, error.message);
      counts.query_error = 1;
      continue;
    }

    for (const row of stale || []) {
      const result = await confirmBookingPayment({ kind, bookingId: String(row.id) });
      counts[result.outcome] = (counts[result.outcome] || 0) + 1;

      const expired = now - new Date(row.created_at).getTime() > EXPIRE_AFTER_MS;
      if (result.outcome === "not_paid" && expired) {
        const { data: cancelled } = await supabaseServer
          .from(cfg.table)
          .update({ payment_status: "CANCELLED" })
          .eq("id", row.id)
          .eq("payment_status", cfg.unpaidStatus)
          .select("id");
        if (cancelled?.length) counts.expired = (counts.expired || 0) + 1;
      }
    }
  }

  // Email retries (only once the confirmation_email_sent_at column exists).
  const { data: unsent, error: unsentError } = await supabaseServer
    .from("bookings")
    .select("id")
    .in("payment_status", ["PENDING", "CONFIRMED"])
    .eq("payment_type", "online")
    .is("confirmation_email_sent_at", null)
    .limit(BATCH_SIZE);

  if (!unsentError) {
    const emailCounts: Record<string, number> = {};
    for (const row of unsent || []) {
      const result = await sendRoomConfirmationEmail(String(row.id));
      emailCounts[result.status] = (emailCounts[result.status] || 0) + 1;
    }
    summary.emails = emailCounts;
  }

  console.log("[Reconcile] Summary:", JSON.stringify(summary));
  return NextResponse.json({ success: true, summary });
}
