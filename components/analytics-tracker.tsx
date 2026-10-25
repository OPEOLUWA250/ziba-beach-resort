"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import type { AnalyticsEvent } from "@/lib/analytics-events";

// Funnel steps that are simply "visited this page".
const PAGE_STEPS: Record<string, AnalyticsEvent> = {
  "/day-pass": "daypass_view",
  "/day-pass/cart": "daypass_cart_view",
  "/day-pass/checkout": "daypass_checkout_view",
};

/** Where on the site an outbound click happened, e.g. "home", "experience". */
export function pageContext(pathname: string) {
  return pathname === "/" ? "home" : pathname.split("/").filter(Boolean)[0] || "home";
}

/**
 * Mounted once in the root layout: records page views, the day-pass page
 * steps, and clicks on links that hand the guest off to IPMS (rooms),
 * WhatsApp or the phone. Buttons that navigate in JS call track() directly.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    track("page_view");
    const step = PAGE_STEPS[pathname];
    if (step) track(step);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const context = pageContext(window.location.pathname);

      if (/ipms247\.com|letsbook\.me/i.test(href)) {
        track("room_book_click", { context });
      } else if (/wa\.me|whatsapp\.com/i.test(href)) {
        track("whatsapp_click", { context });
      } else if (href.startsWith("tel:")) {
        track("phone_click", { context });
      }
    };
    // Capture phase: runs even if a handler stops propagation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
