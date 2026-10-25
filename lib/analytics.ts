import { type AnalyticsEvent, cleanSource } from "@/lib/analytics-events";

/**
 * First-party, anonymous funnel tracking (browser side).
 *
 * Vercel Web Analytics (already on the site) covers page views, but its
 * custom events need a paid plan, so funnel steps and outbound clicks are
 * recorded in our own database instead. No cookies and no personal data:
 * a random per-tab session id lives in sessionStorage, and the session's
 * first-touch source (utm_source or referring site) is kept with it.
 */

const SESSION_KEY = "ziba_sid";
const SOURCE_KEY = "ziba_src";

const REFERRER_SOURCES: Array<[RegExp, string]> = [
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$/, "facebook"],
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)(twitter|x)\.com$|^t\.co$/, "x"],
  [/(^|\.)whatsapp\.(com|net)$/, "whatsapp"],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, "linkedin"],
];

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null; // blocked (privacy mode, sandboxed iframe)
  }
}

function detectSource(): string {
  const params = new URLSearchParams(window.location.search);
  const utm = cleanSource(params.get("utm_source"));
  if (utm) return utm;
  if (params.has("gclid")) return "google-ads";
  if (params.has("fbclid")) return "facebook";

  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host && host !== window.location.hostname.replace(/^www\./, "")) {
      const known = REFERRER_SOURCES.find(([pattern]) => pattern.test(host));
      return known ? known[1] : cleanSource(host) || "referral";
    }
  } catch {
    // no or invalid referrer
  }
  return "direct";
}

function session(): { id: string; source: string } {
  const store = storage();
  let id = store?.getItem(SESSION_KEY) || "";
  let source = store?.getItem(SOURCE_KEY) || "";
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    store?.setItem(SESSION_KEY, id);
  }
  if (!source) {
    source = detectSource();
    store?.setItem(SOURCE_KEY, source);
  }
  return { id, source };
}

/** The current session's first-touch source, for attributing bookings. */
export function getSessionSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return session().source;
  } catch {
    return undefined;
  }
}

export function track(name: AnalyticsEvent, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    if (navigator.webdriver) return; // automated browsers / crawlers
    if (window.location.pathname.startsWith("/admin")) return; // staff, not guests
    if (/^(localhost|127\.|192\.168\.)/.test(window.location.hostname)) return; // local dev

    const { id, source } = session();
    const body = JSON.stringify({
      name,
      sessionId: id,
      source,
      path: window.location.pathname,
      props,
    });

    // sendBeacon survives the page unloading (e.g. clicks that leave the site).
    const sent =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    if (!sent) {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Tracking must never break the page.
  }
}
