import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { rateLimitByIp } from "@/lib/security/rate-limit";
import { ANALYTICS_EVENTS, cleanSource } from "@/lib/analytics-events";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2048;
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit/i;

const eventSchema = z.object({
  name: z.enum(ANALYTICS_EVENTS),
  sessionId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
  source: z.string().max(80).optional(),
  path: z.string().max(200).optional(),
  props: z
    .record(z.union([z.string().max(100), z.number().finite()]))
    .refine((value) => Object.keys(value).length <= 5)
    .optional(),
});

const noContent = () => new NextResponse(null, { status: 204 });

/**
 * Anonymous funnel event from the site (see lib/analytics.ts). Always
 * answers 204 so tracking problems never surface to visitors.
 */
export async function POST(request: NextRequest) {
  if (BOT_UA.test(request.headers.get("user-agent") || "")) return noContent();

  const rate = await rateLimitByIp(request.headers, "api:track", 120, 60_000);
  if (!rate.allowed) return noContent();

  const raw = await request.text().catch(() => "");
  if (!raw || raw.length > MAX_BODY_BYTES) return noContent();

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return noContent();
  }
  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) return noContent();

  const event = parsed.data;
  const { error } = await supabaseServer.from("analytics_events").insert({
    name: event.name,
    session_id: event.sessionId,
    source: cleanSource(event.source) || "direct",
    path: event.path?.split("?")[0] || null,
    props: event.props ?? null,
  });

  // Missing table = migration not applied yet; stay quiet about it.
  if (error && !["42P01", "PGRST205"].includes(error.code)) {
    console.warn("[Track] Insert failed:", error.message);
  }
  return noContent();
}
