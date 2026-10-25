import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isCronAuthorized } from "@/lib/server/cron-auth";
import {
  type DayPassEmailKind,
  EMAILABLE_DAY_PASS_STATUSES,
  sendDayPassEmail,
} from "@/lib/server/day-pass-emails";
import { lagosDate } from "@/lib/utils/lagos-date";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_SIZE = 100;
// Resend's default limit is 2 requests/second.
const SEND_SPACING_MS = 550;
// Stop starting new sends with headroom before maxDuration.
const TIME_BUDGET_MS = 50_000;
// Only retry confirmations for recent bookings, never old history.
const CONFIRMATION_RETRY_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Scheduled daily by vercel.json (16:00 UTC = 5 PM Lagos):
 *   1. Reminder to guests whose day-pass visit is tomorrow.
 *   2. Thank-you + Google review request to guests who visited yesterday.
 *      Sent to every guest alike (no filtering by expected sentiment), as
 *      Google's review policy requires.
 *   3. Retry of day-pass confirmation emails that failed at payment time
 *      (needs the sent-at columns from the guest-emails migration).
 */
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const today = lagosDate(0);
  const queue: Array<{ kind: DayPassEmailKind; id: string }> = [];
  const summary: Record<string, Record<string, number>> = {};

  const enqueue = async (kind: DayPassEmailKind, visitDate: string, statuses: string[]) => {
    const { data, error } = await supabaseServer
      .from("day_pass_bookings")
      .select("id")
      .eq("visit_date", visitDate)
      .in("payment_status", statuses)
      .limit(BATCH_SIZE);
    if (error) {
      console.error(`[Guest Emails] ${kind} query failed:`, error.message);
      summary[kind] = { query_error: 1 };
      return;
    }
    for (const row of data || []) queue.push({ kind, id: String(row.id) });
  };

  await enqueue("reminder", lagosDate(1), ["PENDING", "CONFIRMED"]);
  await enqueue("review", lagosDate(-1), EMAILABLE_DAY_PASS_STATUSES);

  const { data: unsent, error: unsentError } = await supabaseServer
    .from("day_pass_bookings")
    .select("id")
    .is("confirmation_email_sent_at", null)
    .in("payment_status", EMAILABLE_DAY_PASS_STATUSES)
    .gte("visit_date", today)
    .gt("created_at", new Date(Date.now() - CONFIRMATION_RETRY_WINDOW_MS).toISOString())
    .limit(BATCH_SIZE);
  if (!unsentError) {
    for (const row of unsent || []) queue.unshift({ kind: "confirmation", id: String(row.id) });
  }

  let deferred = 0;
  for (const [index, job] of queue.entries()) {
    if (Date.now() - started > TIME_BUDGET_MS) {
      deferred = queue.length - index;
      break;
    }
    if (index > 0) await sleep(SEND_SPACING_MS);
    const result = await sendDayPassEmail(job.kind, job.id);
    const counts = (summary[job.kind] ||= {});
    counts[result.status] = (counts[result.status] || 0) + 1;
  }

  if (deferred > 0) {
    console.error(`[Guest Emails] Time budget reached; ${deferred} email(s) not sent this run.`);
  }
  console.log("[Guest Emails] Summary:", JSON.stringify({ today, summary, deferred }));
  return NextResponse.json({ success: true, today, summary, deferred });
}
