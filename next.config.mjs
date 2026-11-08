const isDev = process.env.NODE_ENV === "development";
const onVercel = Boolean(process.env.VERCEL);

/*
 * What browsers may load and do on every page. Each outside address below is
 * something the site really uses; anything else is refused, so an injected
 * script can't load code from elsewhere or send data away.
 *   - Paystack: the inline checkout script, its payment window and its API.
 *   - Supabase: public reads (rooms, popups) made from the browser.
 *   - Vercel Analytics: its script (served from the site itself on Vercel).
 *   - Google Maps: the map on the contact page.
 * Images may come from any https address because blog, popup and Instagram
 * images are hosted elsewhere. Inline scripts stay allowed because Next.js
 * needs them without nonces. No other site may frame these pages, which stops
 * someone overlaying them to trick a click.
 */
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").origin;
  } catch {
    return "";
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.paystack.co https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline' https://paystack.com https://*.paystack.com https://*.paystack.co",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} https://*.supabase.co wss://*.supabase.co https://api.paystack.co https://*.paystack.co https://*.paystack.com https://va.vercel-scripts.com https://vitals.vercel-insights.com`.replace(/\s+/g, " "),
  "frame-src 'self' https://checkout.paystack.com https://*.paystack.co https://*.paystack.com https://www.google.com https://maps.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Local copies run on plain http, so only the live site upgrades requests.
  ...(onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), usb=(), interest-cohort=(), payment=(self "https://checkout.paystack.com" "https://js.paystack.co" "https://standard.paystack.co")',
  },
  // Browsers ignore this over plain http, so it's safe on local copies too.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the framework (and so which advisories might apply).
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next resizes and compresses photos for each screen (AVIF/WebP), so a
  // phone downloads a phone-sized photo instead of the 1600px original.
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 85, 90, 95],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    disablePostcssPresetEnv: false,
  },
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  turbopack: {
    root: ".",
    resolveAlias: {
      resend: "resend",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
