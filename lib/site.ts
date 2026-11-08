/**
 * Facts about the site and the resort used in many places: the public
 * address (for share previews and links), contact details and location.
 */

/**
 * The address this deployment is served from. NEXT_PUBLIC_SITE_URL wins;
 * otherwise Vercel's production address, so share previews and absolute
 * links point at pages and images that exist on this deployment.
 */
export const SITE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "https://ziba-beach-resort.vercel.app";
})();

export const RESORT = {
  name: "Ziba Beach Resort",
  tagline: "Nigeria's first overwater resort",
  address: "Ziba Beach Close, Okun Ajah, Lagos, Nigeria",
  phones: ["+234 704 730 0013", "+234 818 744 4447"],
  email: "bookings@zibabeachresort.com",
  instagram: "https://www.instagram.com/zibabeachresorts",
  mapsUrl:
    "https://maps.google.com/?q=Ziba+Beach+Close,+Okun+Ajah,+Lagos,+Nigeria",
  /** Okun Ajah beachfront, used for sunset times and weather. */
  latitude: 6.4446,
  longitude: 3.6075,
  timeZone: "Africa/Lagos",
} as const;

/** The default share image: the Grand Overwater Villa from the air. */
export const DEFAULT_SHARE_IMAGE = {
  url: "/ziba-hero-images/ziba-home/ziba-grand-overwater-villa.jpg",
  width: 1600,
  height: 900,
  alt: "Aerial view of Ziba Beach Resort's Grand Overwater Villa",
};
