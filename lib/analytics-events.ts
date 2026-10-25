/**
 * Booking-funnel events. Shared by the browser tracker and /api/track, which
 * rejects any name not listed here.
 */
export const ANALYTICS_EVENTS = [
  "page_view",
  // Day-pass funnel, in order.
  "daypass_view",
  "daypass_add_to_cart",
  "daypass_cart_view",
  "daypass_checkout_view",
  "daypass_payment_start",
  "daypass_paid",
  // Hand-offs that leave the site.
  "room_book_click",
  "whatsapp_click",
  "phone_click",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/** Normalised source label: lowercase, [a-z0-9._-], max 60 chars. */
export function cleanSource(value: string | null | undefined): string | null {
  const cleaned = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return cleaned || null;
}
