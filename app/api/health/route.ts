import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Liveness/readiness probe for uptime monitors. Checks the database with a
 * cheap, bounded query and reports only up/down — no configuration details.
 */
export async function GET() {
  const started = Date.now();

  try {
    const { error } = await supabaseServer
      .from("rooms")
      .select("id", { head: true, count: "exact" })
      .limit(1)
      .abortSignal(AbortSignal.timeout(3000));

    if (error) throw error;

    return NextResponse.json(
      { status: "ok", database: "ok", latencyMs: Date.now() - started },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", database: "unreachable", latencyMs: Date.now() - started },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
