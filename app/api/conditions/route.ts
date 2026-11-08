import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/server/http";
import { RESORT } from "@/lib/site";

/**
 * Today's sunset time and the current temperature at the resort, from
 * Open-Meteo (free, no key). Cached for 30 minutes so visitors never wait on
 * it; if Open-Meteo is down the site simply hides the line.
 */
export const revalidate = 1800;

export interface ResortConditions {
  /** e.g. "6:52pm" in Lagos time, or null if unknown. */
  sunset: string | null;
  /** Whole degrees Celsius, or null if unknown. */
  temperatureC: number | null;
}

function formatLagosTime(iso: string) {
  // Open-Meteo returns local time without an offset, e.g. "2026-11-08T18:41".
  const [, time] = iso.split("T");
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

export async function GET() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${RESORT.latitude}` +
    `&longitude=${RESORT.longitude}&current=temperature_2m&daily=sunset` +
    `&timezone=${encodeURIComponent(RESORT.timeZone)}&forecast_days=1`;

  try {
    const res = await fetchWithTimeout(url, { next: { revalidate } }, 5000);
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = (await res.json()) as {
      current?: { temperature_2m?: number };
      daily?: { sunset?: string[] };
    };
    const body: ResortConditions = {
      sunset: data.daily?.sunset?.[0] ? formatLagosTime(data.daily.sunset[0]) : null,
      temperatureC:
        typeof data.current?.temperature_2m === "number"
          ? Math.round(data.current.temperature_2m)
          : null,
    };
    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.warn("[conditions]", error instanceof Error ? error.message : error);
    const empty: ResortConditions = { sunset: null, temperatureC: null };
    return NextResponse.json(empty, { headers: { "Cache-Control": "public, s-maxage=300" } });
  }
}
