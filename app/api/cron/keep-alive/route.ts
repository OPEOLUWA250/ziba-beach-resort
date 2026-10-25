import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Real reads (not just an auth/health ping) so Supabase records database
// activity. Tables are ones every environment has.
const TABLES = ["rooms", "bookings"] as const;

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  return (
    header.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected))
  );
}

/**
 * Scheduled by vercel.json. Free-tier Supabase projects are paused after 7
 * days without activity; a daily query keeps the project awake.
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
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

  console.log("[KeepAlive]", JSON.stringify(results));
  return NextResponse.json(
    { success: ok, results, at: new Date().toISOString() },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
