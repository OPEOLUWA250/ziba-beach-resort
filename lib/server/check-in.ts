import { supabaseServer } from "@/lib/supabase/server";
import { lagosDate, toDateKey } from "@/lib/utils/lagos-date";

/**
 * Gate check-in for day passes. Checking in moves a booking to ACTIVATED,
 * which is what makes a pass single-use: a second scan of the same QR code
 * (e.g. a forwarded screenshot) shows "already checked in".
 */

type Row = Record<string, any>;

export type CheckInState = "ready" | "warning" | "blocked";

export interface CheckInView {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phone: string;
  visitDate: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  guests: number;
  totalAmount: number;
  paymentStatus: string;
  paymentType: string | null;
  checkedInAt: string | null;
  checkedInBy: string | null;
  state: CheckInState;
  /** Shown to staff, most important first. */
  messages: string[];
  /** PENDING: staff must confirm payment/approval to check in. */
  requiresApproval: boolean;
  /** Visit date is not today: staff must confirm to check in anyway. */
  dateMismatch: "early" | "late" | null;
}

/** Guests admitted = ticket quantities (add-on experiences aren't people). */
function countGuests(items: CheckInView["items"]) {
  return items
    .filter((item) => /ticket/i.test(item.name))
    .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function toCheckInView(row: Row, today = lagosDate(0)): CheckInView {
  const items = Array.isArray(row.items) ? row.items : [];
  const visitDate = toDateKey(row.visit_date);
  const status = String(row.payment_status);
  const messages: string[] = [];
  let state: CheckInState = "ready";
  let requiresApproval = false;
  let dateMismatch: CheckInView["dateMismatch"] = null;

  const checkedInAt =
    row.checked_in_at ?? (["ACTIVATED", "COMPLETED"].includes(status) ? row.updated_at ?? null : null);

  if (status === "ACTIVATED" || status === "COMPLETED") {
    state = "blocked";
    messages.push("Already checked in. This pass has been used.");
  } else if (status === "CANCELLED") {
    state = "blocked";
    messages.push("This booking was cancelled.");
  } else if (status === "RESERVED") {
    state = "blocked";
    messages.push("Not paid. Payment was never completed for this booking.");
  } else {
    if (status === "PENDING") {
      requiresApproval = true;
      state = "warning";
      messages.push(
        row.payment_type === "online"
          ? "Paid online, but not yet approved by an admin."
          : "Manual booking: confirm the guest has paid before admitting.",
      );
    }
    if (visitDate !== today) {
      dateMismatch = visitDate > today ? "early" : "late";
      state = "warning";
      messages.push(
        dateMismatch === "early"
          ? `Booked for a later date (${visitDate}), not today.`
          : `Booked for an earlier date (${visitDate}), not today.`,
      );
    }
    if (state === "ready") messages.push("Valid for today.");
  }

  return {
    id: String(row.id),
    referenceCode: row.reference_code,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    visitDate,
    items,
    guests: countGuests(items),
    totalAmount: Number(row.total_amount) || 0,
    paymentStatus: status,
    paymentType: row.payment_type ?? null,
    checkedInAt,
    checkedInBy: row.checked_in_by ?? null,
    state,
    messages,
    requiresApproval,
    dateMismatch,
  };
}

export async function loadCheckInView(id: string) {
  const { data, error } = await supabaseServer
    .from("day_pass_bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error && error.code !== "22P02") throw new Error(error.message);
  return data ? toCheckInView(data) : null;
}

const isMissingColumn = (code?: string) => code === "42703" || code === "PGRST204";

export async function checkInDayPass(
  id: string,
  admin: { username?: string | null; email?: string | null },
  confirm: { approve?: boolean; override?: boolean },
): Promise<{ ok: true; view: CheckInView } | { ok: false; status: number; error: string; view?: CheckInView }> {
  const view = await loadCheckInView(id);
  if (!view) return { ok: false, status: 404, error: "Booking not found" };

  if (view.state === "blocked") {
    return { ok: false, status: 409, error: view.messages[0], view };
  }
  if (view.requiresApproval && !confirm.approve) {
    return { ok: false, status: 409, error: "Confirm approval to check in this booking", view };
  }
  if (view.dateMismatch && !confirm.override) {
    return { ok: false, status: 409, error: "Confirm to check in on a different date", view };
  }

  const now = new Date().toISOString();
  const attempts: Array<Record<string, unknown>> = [
    { checked_in_at: now, checked_in_by: admin.username || admin.email || "admin", updated_at: now },
    { updated_at: now }, // check-in columns not migrated yet
    {},
  ];

  for (const fields of attempts) {
    // Compare-and-set on the status we validated, so two staff scanning the
    // same pass at once can't both admit it.
    const { data, error } = await supabaseServer
      .from("day_pass_bookings")
      .update({ payment_status: "ACTIVATED", ...fields })
      .eq("id", id)
      .eq("payment_status", view.paymentStatus)
      .select();

    if (error && isMissingColumn(error.code)) continue;
    if (error) {
      console.error("[Check-in] Update failed:", error.message);
      return { ok: false, status: 500, error: "Failed to check in" };
    }
    if (!data || data.length === 0) {
      const latest = await loadCheckInView(id);
      return {
        ok: false,
        status: 409,
        error: "This booking just changed (possibly checked in on another device).",
        view: latest ?? undefined,
      };
    }
    console.log(`[Check-in] ${view.referenceCode} checked in by ${admin.username || admin.email}`);
    return { ok: true, view: toCheckInView(data[0]) };
  }

  return { ok: false, status: 500, error: "Failed to check in" };
}
