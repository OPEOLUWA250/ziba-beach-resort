"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { whatsappLink } from "@/lib/booking-links";
import { track } from "@/lib/analytics";
import { ROOM_CATALOG, formatPriceFrom } from "@/lib/room-catalog";

/** Pages with their own WhatsApp hand-off (or none wanted) skip the button. */
const HIDDEN_ON = [
  /^\/admin/,
  /^\/day-pass\/checkout/,
  /^\/celebrations/,
  // Room pages have their own "Ask about this room" button and a booking bar.
  /^\/bookings\/rooms\//,
];

const titleCase = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/**
 * The message the chat opens with, so the team knows straight away what the
 * guest was looking at. Exported for tests and for pages that link to chat.
 */
export function conciergeMessage(pathname: string): { context: string; text: string } {
  const room = pathname.match(/^\/bookings\/rooms\/(room\d+)/)?.[1];
  if (room && ROOM_CATALOG[room]) {
    const r = ROOM_CATALOG[room];
    return {
      context: `room:${room}`,
      text: `Hello Ziba, I'm interested in the ${r.name} (${formatPriceFrom(r.priceFrom)} per night). Could you help me with availability for my dates?`,
    };
  }
  const offer = pathname.match(/^\/(?:popups|offers)\/([a-z0-9-]+)/)?.[1];
  if (offer) {
    return {
      context: `offer:${offer}`,
      text: `Hello Ziba, I'd like to know more about the "${titleCase(offer)}" offer.`,
    };
  }
  const byPage: [RegExp, string, string][] = [
    [/^\/bookings/, "rooms", "Hello Ziba, I'd like help choosing a room for my stay."],
    [/^\/day-pass/, "day_pass", "Hello Ziba, I have a question about the day pass."],
    [/^\/gift/, "gift", "Hello Ziba, I'd like to buy a day-pass gift voucher."],
    [/^\/events/, "events", "Hello Ziba, I'd like to plan an event at the resort."],
    [/^\/experience/, "experiences", "Hello Ziba, I'd like to book an experience during my visit."],
    [/^\/offers/, "offers", "Hello Ziba, I'd like to know about your current offers."],
    [/^\/menu/, "dining", "Hello Ziba, I have a question about dining at the resort."],
  ];
  for (const [re, context, text] of byPage) {
    if (re.test(pathname)) return { context, text };
  }
  return { context: "general", text: "Hello Ziba, I'd like to make an enquiry." };
}

/** One floating button that opens WhatsApp with a message about this page. */
export default function WhatsAppConcierge() {
  const pathname = usePathname() || "/";
  const [shown, setShown] = useState(false);

  // Appears after a little scrolling, so it never covers the first screen.
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_ON.some((re) => re.test(pathname))) return null;
  const { context, text } = conciergeMessage(pathname);

  return (
    <a
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { context })}
      aria-label="Chat with Ziba on WhatsApp"
      className={`concierge-fab group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-blue-950 py-2 pl-2 pr-2 text-white shadow-[0_10px_30px_-10px_rgba(2,6,23,0.6)] transition-all duration-500 sm:bottom-7 sm:right-7 sm:pr-5 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]">
        <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5 text-white" />
      </span>
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}
