import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

export const dynamic = "force-dynamic";

const ALLOWED_DAYS = [7, 30, 90];
// Bookings that represent money received (online) or a staff-made booking.
const BOOKED_STATUSES = ["PENDING", "CONFIRMED", "ACTIVATED", "COMPLETED"];

/**
 * Booking-funnel summary for the admin Insights page.
 * Visitor behaviour comes from analytics_events (via the analytics_summary
 * RPC); bookings and revenue come from day_pass_bookings, the source of truth.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const requested = Number(request.nextUrl.searchParams.get("days"));
  const days = ALLOWED_DAYS.includes(requested) ? requested : 30;
  const since = new Date(Date.now() - days * 86_400_000).toISOString();

  const { data: summary, error: summaryError } = await supabaseServer.rpc("analytics_summary", {
    p_since: since,
  });
  const analyticsReady = !summaryError;
  if (summaryError && !["PGRST202", "42883", "42P01", "PGRST205"].includes(summaryError.code)) {
    console.error("[Insights] analytics_summary failed:", summaryError.message);
  }

  const selectBookings = (columns: string) =>
    supabaseServer
      .from("day_pass_bookings")
      .select(columns)
      .gte("created_at", since)
      .in("payment_status", BOOKED_STATUSES)
      .limit(5000);

  let { data: rows, error: bookingsError } = await selectBookings(
    "total_amount, payment_type, source",
  );
  if (bookingsError) {
    // `source` column not migrated yet.
    ({ data: rows, error: bookingsError } = await selectBookings("total_amount, payment_type"));
  }
  if (bookingsError) {
    console.error("[Insights] bookings query failed:", bookingsError.message);
    return NextResponse.json({ error: "Failed to load insights" }, { status: 500 });
  }

  const bookings = (rows || []) as unknown as Array<{
    total_amount: number;
    payment_type: string | null;
    source?: string | null;
  }>;
  const online = bookings.filter((b) => b.payment_type === "online");
  const bySource = new Map<string, { bookings: number; revenue: number }>();
  for (const b of online) {
    const key = b.source || "unknown";
    const entry = bySource.get(key) || { bookings: 0, revenue: 0 };
    entry.bookings += 1;
    entry.revenue += Number(b.total_amount) || 0;
    bySource.set(key, entry);
  }

  return NextResponse.json(
    {
      days,
      analyticsReady,
      analytics: analyticsReady ? summary : null,
      dayPass: {
        onlineBookings: online.length,
        onlineRevenue: online.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0),
        staffBookings: bookings.length - online.length,
        bySource: [...bySource.entries()]
          .map(([source, v]) => ({ source, ...v }))
          .sort((a, b) => b.revenue - a.revenue),
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
