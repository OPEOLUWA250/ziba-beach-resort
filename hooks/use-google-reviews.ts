"use client";

import { useEffect, useState } from "react";
import type { GoogleReviewsResult } from "@/lib/server/google-reviews";

/** Fallback when the API is unconfigured or unreachable: link to Google. */
export const GOOGLE_REVIEWS_SEARCH_URL =
  "https://www.google.com/maps/search/?api=1&query=Ziba+Beach+Resort+Okun+Ajah+Lagos";

export function useGoogleReviews() {
  const [data, setData] = useState<GoogleReviewsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!cancelled) setData(body);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
