import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";
import { toCheckInView } from "@/lib/server/check-in";
import { lagosDate } from "@/lib/utils/lagos-date";

export const dynamic = "force-dynamic";

/**
 * GET                 today's day-pass arrivals (Lagos date) + counts
 * GET ?q=<text>       search by reference, name, email or phone
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const today = lagosDate(0);
  // PostgREST .or() filter syntax uses , ( ) as delimiters: keep only safe chars.
  const q = (request.nextUrl.searchParams.get("q") || "")
    .replace(/[^a-zA-Z0-9@.+\-' ]/g, "")
    .trim()
    .slice(0, 60);

  let query = supabaseServer.from("day_pass_bookings").select("*");
  if (q.length >= 2) {
    const like = `%${q}%`;
    query = query
      .or(`reference_code.ilike.${like},full_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`)
      .order("visit_date", { ascending: false })
      .limit(25);
  } else {
    query = query
      .eq("visit_date", today)
      .neq("payment_status", "RESERVED")
      .order("full_name", { ascending: true })
      .limit(500);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[Check-in list] Query failed:", error.message);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }

  const bookings = (data || []).map((row) => toCheckInView(row, today));
  const arrivals = bookings.filter((b) => b.paymentStatus !== "CANCELLED");
  const checkedIn = arrivals.filter((b) => ["ACTIVATED", "COMPLETED"].includes(b.paymentStatus));

  return NextResponse.json(
    {
      today,
      mode: q.length >= 2 ? "search" : "today",
      bookings,
      counts:
        q.length >= 2
          ? null
          : {
              bookings: arrivals.length,
              guests: arrivals.reduce((sum, b) => sum + b.guests, 0),
              checkedIn: checkedIn.length,
              guestsCheckedIn: checkedIn.reduce((sum, b) => sum + b.guests, 0),
            },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
