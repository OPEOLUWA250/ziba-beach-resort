import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/server/google-reviews";

// Cached on the server for 6 hours; the CDN serves the cached copy while it
// revalidates. Keeps Places API usage to a handful of calls per day.
export const revalidate = 21600;

export async function GET() {
  const data = await getGoogleReviews();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
