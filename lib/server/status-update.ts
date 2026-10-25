import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Move a booking to `nextStatus` if the transition is allowed from its
 * current status. Uses compare-and-set (`.eq("payment_status", current)`) so
 * a concurrent change makes this update a no-op (409) instead of silently
 * overwriting it.
 */
export async function transitionBookingStatus(
  table: "bookings" | "day_pass_bookings",
  id: string,
  nextStatus: unknown,
  transitions: Record<string, string[]>,
) {
  if (!id || typeof nextStatus !== "string" || !nextStatus) {
    return NextResponse.json({ error: "Missing booking ID or status" }, { status: 400 });
  }

  const { data: current, error: findError } = await supabaseServer
    .from(table)
    .select("id, payment_status")
    .eq("id", id)
    .maybeSingle();

  if (findError && findError.code !== "22P02") {
    console.error(`[Status Update] ${table} lookup failed:`, findError.message);
    return NextResponse.json({ error: "Failed to load booking" }, { status: 500 });
  }
  if (!current) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const from = current.payment_status as string;
  if (from === nextStatus) {
    return NextResponse.json({ success: true, message: `Booking already ${nextStatus}`, booking: current });
  }
  if (!(transitions[from] || []).includes(nextStatus)) {
    return NextResponse.json(
      { error: `Cannot change status from ${from} to ${nextStatus}` },
      { status: 409 },
    );
  }

  const apply = (fields: Record<string, unknown>) =>
    supabaseServer
      .from(table)
      .update({ payment_status: nextStatus, ...fields })
      .eq("id", id)
      .eq("payment_status", from)
      .select();

  let { data, error } = await apply({ updated_at: new Date().toISOString() });
  if (error?.code === "42703") ({ data, error } = await apply({}));

  if (error) {
    console.error(`[Status Update] ${table} update failed:`, error.message);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Booking was changed by someone else. Refresh and try again." },
      { status: 409 },
    );
  }

  console.log(`[Status Update] ${table} ${id}: ${from} -> ${nextStatus}`);
  return NextResponse.json({
    success: true,
    message: `Booking updated to ${nextStatus}`,
    booking: data[0],
  });
}
