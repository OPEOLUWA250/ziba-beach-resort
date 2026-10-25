import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isCronAuthorized } from "@/lib/server/cron-auth";

export const dynamic = "force-dynamic";

// Real reads (not just an auth/health ping) so Supabase records database
// activity. Tables are ones every environment has.
const TABLES = ["rooms", "bookings"] as const;

// Funnel analytics are only useful for recent trends; cap table growth on
// the free tier's 500 MB.
const ANALYTICS_RETENTION_DAYS = 180;

/**
 * Scheduled by vercel.json. Free-tier Supabase projects are paused after 7
 * days without activity; a daily query keeps the project awake.
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, string> = {};
  let ok = true;

  for (const table of TABLES) {
    const { error } = await supabaseServer
      .from(table)
      .select("id")
      .limit(1)
      .abortSignal(AbortSignal.timeout(10000));

    results[table] = error ? error.message : "ok";
    if (error) ok = false;
  }

  // Housekeeping; a missing table (migration not applied) is not a failure.
  const cutoff = new Date(Date.now() - ANALYTICS_RETENTION_DAYS * 86_400_000).toISOString();
  const { error: pruneError } = await supabaseServer
    .from("analytics_events")
    .delete()
    .lt("created_at", cutoff);
  results.analytics_prune = pruneError ? pruneError.code || pruneError.message : "ok";

  console.log("[KeepAlive]", JSON.stringify(results));
  return NextResponse.json(
    { success: ok, results, at: new Date().toISOString() },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
