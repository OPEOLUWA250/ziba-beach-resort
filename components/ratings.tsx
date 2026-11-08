"use client";

import { ArrowUpRight } from "lucide-react";
import { GOOGLE_REVIEWS_SEARCH_URL, useGoogleReviews } from "@/hooks/use-google-reviews";
import { useReveal, revealClass } from "@/hooks/use-reveal";

// Booking.com and TripAdvisor scores have no public API; they are maintained
// by hand from the scores shown on zibabeachresort.com (checked 2026-10-24).
// The Google figure is live (see hooks/use-google-reviews.ts).
const STATIC_RATINGS = [
  { platform: "Booking.com", rating: "9.3", outOf: "/10", details: "Guest review score", href: null },
  { platform: "TripAdvisor", rating: "4.4", outOf: "/5", details: "Traveller rating", href: null },
];

export default function Ratings() {
  const { ref, visible } = useReveal<HTMLElement>();
  const { data } = useGoogleReviews();

  const ratings = [
    {
      platform: "Google",
      rating: data?.rating != null ? data.rating.toFixed(1) : null,
      outOf: "/5",
      details:
        data?.totalReviews != null
          ? `From ${data.totalReviews.toLocaleString("en-NG")} reviews`
          : "Read our reviews",
      href: data?.mapsUrl || GOOGLE_REVIEWS_SEARCH_URL,
    },
    ...STATIC_RATINGS,
  ];

  return (
    <section ref={ref} aria-label="Guest ratings" className="bg-white px-5 py-16 sm:px-8 lg:px-12">
      <dl className={`mx-auto grid max-w-5xl divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${revealClass(visible)}`}>
        {ratings.map((item) => {
          const body = (
            <>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-700">{item.platform}</dt>
              <dd className="mt-3">
                {item.rating ? (
                  <span className="font-cormorant text-5xl font-medium text-blue-950">
                    {item.rating}
                    <span className="text-2xl text-slate-400">{item.outOf}</span>
                  </span>
                ) : (
                  <span className="font-cormorant text-3xl font-medium text-blue-950">See reviews</span>
                )}
                <span className="mt-1 flex items-center justify-center gap-1 text-sm font-light text-slate-500">
                  {item.details}
                  {item.href && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                </span>
              </dd>
            </>
          );
          return (
            <div key={item.platform} className="px-6 py-8 text-center">
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80">
                  {body}
                </a>
              ) : (
                body
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
