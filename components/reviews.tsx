"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import SectionHeading from "@/components/section-heading";
import { useReveal, revealClass } from "@/hooks/use-reveal";
import { GOOGLE_REVIEWS_SEARCH_URL, useGoogleReviews } from "@/hooks/use-google-reviews";
import type { GoogleReview } from "@/lib/server/google-reviews";

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={`${size} ${n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 260;
  const initial = review.authorName.trim().charAt(0).toUpperCase() || "G";

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_-20px_rgba(15,23,42,0.25)] sm:p-8">
      <Stars value={review.rating} />
      {/* Review text exactly as Google returns it (Google Maps Platform terms). */}
      <p
        className={`mt-5 whitespace-pre-line text-[15px] font-light leading-relaxed text-slate-700 ${
          long && !expanded ? "line-clamp-6" : ""
        }`}
      >
        {review.text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 self-start text-sm font-medium text-blue-800 hover:text-blue-600"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      <div className="mt-auto flex items-center gap-3 pt-7">
        {review.authorPhotoUrl ? (
          // Google's profile photo address; served as-is with its attribution.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.authorPhotoUrl}
            alt=""
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-sm font-semibold text-white">
            {initial}
          </span>
        )}
        <div className="min-w-0">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm font-semibold text-slate-900 hover:underline"
            >
              {review.authorName}
            </a>
          ) : (
            <p className="truncate text-sm font-semibold text-slate-900">{review.authorName}</p>
          )}
          <p className="text-xs font-light text-slate-500">
            {review.relativeTime}
            {review.reviewUrl && (
              <>
                {" · "}
                <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  View on Google
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Guest reviews pulled live from Google (Places API). Nothing here is written
 * by us: if Google isn't connected or returns no reviews, the section shows
 * links to read and leave reviews on Google instead.
 */
export default function Reviews() {
  const { ref, visible } = useReveal<HTMLElement>();
  const { data, loading } = useGoogleReviews();
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const reviews = data?.reviews ?? [];
  const readUrl = data?.mapsUrl || GOOGLE_REVIEWS_SEARCH_URL;
  const writeUrl = data?.writeReviewUrl || GOOGLE_REVIEWS_SEARCH_URL;

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, reviews.length]);

  const move = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-blue-950 transition hover:border-blue-900 hover:bg-blue-950 hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <section ref={ref} id="reviews" className="overflow-hidden bg-[#f7f4ee] py-20 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
        <SectionHeading align="left" eyebrow="Guest reviews" title="In our guests' words">
          {data?.rating && data.totalReviews ? (
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-cormorant text-3xl font-medium text-blue-950">
                {data.rating.toFixed(1)}
              </span>
              <Stars value={data.rating} size="h-5 w-5" />
              <span className="text-base">
                from {data.totalReviews.toLocaleString("en-NG")} Google reviews
              </span>
            </span>
          ) : (
            "Real reviews from guests who've stayed with us, as posted on Google."
          )}
        </SectionHeading>

        {reviews.length > 1 && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button type="button" onClick={() => move(-1)} disabled={atStart} className={arrow} aria-label="Previous reviews">
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => move(1)} disabled={atEnd} className={arrow} aria-label="More reviews">
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12" aria-hidden="true">
          {[0, 1, 2].map((n) => (
            <div key={n} className="h-72 animate-pulse rounded-3xl bg-white/70" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div
          ref={scroller}
          className={`mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:gap-6 sm:px-8 lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${revealClass(visible)}`}
          role="region"
          aria-label="Google reviews"
        >
          {reviews.map((review, i) => (
            <div key={`${review.authorName}-${i}`} className="w-[86%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-4 px-5 sm:px-8 lg:px-12">
        <span className="inline-flex items-center gap-2 text-xs font-light text-slate-500">
          <FontAwesomeIcon icon={faGoogle} className="h-3.5 w-3.5" />
          {reviews.length > 0 ? "Reviews from Google" : "Our reviews are on Google"}
        </span>
        <a
          href={readUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-900 underline-offset-8 hover:underline"
        >
          Read all reviews
        </a>
        <a
          href={writeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-900 underline-offset-8 hover:underline"
        >
          Leave a review
        </a>
      </div>
    </section>
  );
}
