import { fetchWithTimeout } from "@/lib/server/http";

/**
 * Live Google rating + reviews for the resort, via the Google Places API (New).
 *
 * Env:
 *   GOOGLE_PLACES_API_KEY  required. Restrict it to the Places API (New).
 *   GOOGLE_PLACE_ID        optional. If unset, the place is found once per
 *                          cache window with a Text Search for the resort.
 *
 * Google returns at most 5 reviews (its "most relevant" selection). Display
 * rules (Google Maps Platform terms): show each review's author attribution
 * and link, don't alter review text, and show Google attribution.
 */

const PLACES_API = "https://places.googleapis.com/v1";
const PLACE_QUERY = "Ziba Beach Resort, Ziba Beach Close, Okun Ajah, Lagos, Nigeria";
const CACHE_SECONDS = 6 * 60 * 60;

export interface GoogleReview {
  authorName: string;
  authorUrl: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string | null;
  reviewUrl: string | null;
}

export interface GoogleReviewsResult {
  configured: boolean;
  rating: number | null;
  totalReviews: number | null;
  mapsUrl: string | null;
  writeReviewUrl: string | null;
  reviews: GoogleReview[];
}

const EMPTY: GoogleReviewsResult = {
  configured: false,
  rating: null,
  totalReviews: null,
  mapsUrl: null,
  writeReviewUrl: null,
  reviews: [],
};

async function findPlaceId(apiKey: string): Promise<string | null> {
  const res = await fetchWithTimeout(
    `${PLACES_API}/places:searchText`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id",
      },
      body: JSON.stringify({ textQuery: PLACE_QUERY, maxResultCount: 1 }),
      next: { revalidate: CACHE_SECONDS },
    },
    5000,
  );
  if (!res.ok) {
    console.error("[Google Reviews] Text Search failed:", res.status);
    return null;
  }
  const body = await res.json();
  return body?.places?.[0]?.id ?? null;
}

export async function getGoogleReviews(): Promise<GoogleReviewsResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return EMPTY;

  try {
    const placeId = process.env.GOOGLE_PLACE_ID || (await findPlaceId(apiKey));
    if (!placeId) return { ...EMPTY, configured: true };

    const res = await fetchWithTimeout(
      `${PLACES_API}/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: CACHE_SECONDS },
      },
      5000,
    );

    if (!res.ok) {
      console.error("[Google Reviews] Place Details failed:", res.status);
      return { ...EMPTY, configured: true };
    }

    const place = await res.json();
    const reviews: GoogleReview[] = (place.reviews || [])
      .map((r: any) => ({
        authorName: r.authorAttribution?.displayName || "Google user",
        authorUrl: r.authorAttribution?.uri || null,
        authorPhotoUrl: r.authorAttribution?.photoUri || null,
        rating: Number(r.rating) || 0,
        text: r.text?.text || r.originalText?.text || "",
        relativeTime: r.relativePublishTimeDescription || "",
        publishTime: r.publishTime || null,
        reviewUrl: r.googleMapsUri || null,
      }))
      .filter((r: GoogleReview) => r.text);

    return {
      configured: true,
      rating: typeof place.rating === "number" ? place.rating : null,
      totalReviews: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      mapsUrl: place.googleMapsUri || null,
      writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews,
    };
  } catch (error: any) {
    console.error("[Google Reviews] Error:", error?.message);
    return { ...EMPTY, configured: true };
  }
}
