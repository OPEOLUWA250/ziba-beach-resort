"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { IPMS_BOOKING_URL } from "@/lib/booking-links";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import type { GoogleReview } from "@/lib/server/google-reviews";
import {
  GOOGLE_REVIEWS_SEARCH_URL,
  useGoogleReviews,
} from "@/hooks/use-google-reviews";

const GoogleLogo = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.851-2.84z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Stars = ({ rating, className }: { rating: number; className: string }) => (
  <span aria-label={`${rating} out of 5 stars`} className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        aria-hidden="true"
        className={`${className} ${i < Math.round(rating) ? "text-blue-500" : "text-gray-300"}`}
      >
        ★
      </span>
    ))}
  </span>
);

const AverageRating = ({
  isVisible,
  rating,
  totalReviews,
  mapsUrl,
}: {
  isVisible: boolean;
  rating: number;
  totalReviews: number | null;
  mapsUrl: string;
}) => (
  <div
    className={`bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-8 sm:p-12 border-2 border-blue-300 mb-12 transition-all duration-1000 ease-out ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}
  >
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="text-center">
        <div className="text-6xl font-bold text-blue-600 mb-2 transition-all duration-700">
          {rating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-3">
          <Stars rating={rating} className="text-2xl" />
        </div>
        {totalReviews !== null && (
          <div className="text-sm text-gray-600 font-light">
            Based on {totalReviews.toLocaleString("en-NG")} Google reviews
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-gray-900 mb-3 cormorant">
          Rated by Real Guests on Google
        </h3>
        <p className="text-gray-700 font-light leading-relaxed mb-4">
          These ratings and reviews come straight from Google and update
          automatically.
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-700 font-medium hover:underline"
        >
          <GoogleLogo className="w-4 h-4" />
          Read all reviews on Google
        </a>
      </div>
    </div>
  </div>
);

const ReviewCard = ({
  review,
  index,
  isVisible,
}: {
  review: GoogleReview;
  index: number;
  isVisible: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 280;

  return (
    <div
      className={`shrink-0 w-full sm:w-1/2 lg:w-1/3 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transitionDelay: isVisible ? `${200 + index * 100}ms` : "0ms",
      }}
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 hover:shadow-2xl hover:border-blue-400 transition-all duration-500 h-full flex flex-col">
        {/* Author and rating */}
        <div className="flex items-start gap-3 mb-4">
          {review.authorPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.authorPhotoUrl}
              alt=""
              width={40}
              height={40}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0">
              {review.authorName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {review.authorUrl ? (
              <a
                href={review.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-900 hover:underline block truncate"
              >
                {review.authorName}
              </a>
            ) : (
              <h4 className="font-semibold text-gray-900 truncate">{review.authorName}</h4>
            )}
            <div className="flex items-center gap-2">
              <Stars rating={review.rating} className="text-sm" />
              <span className="text-xs text-gray-500 font-light">
                {review.relativeTime}
              </span>
            </div>
          </div>
        </div>

        {/* Review text (unaltered; long reviews collapse) */}
        <blockquote
          className={`text-gray-700 font-light leading-relaxed flex-1 mb-4 text-sm whitespace-pre-line ${
            !expanded && isLong ? "line-clamp-6" : ""
          }`}
        >
          {review.text}
        </blockquote>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-left text-sm text-blue-700 hover:underline mb-4"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Source attribution */}
        <div className="pt-4 border-t border-gray-100">
          <a
            href={review.reviewUrl || GOOGLE_REVIEWS_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <GoogleLogo />
            Posted on Google
          </a>
        </div>
      </div>
    </div>
  );
};

const ReviewsCarousel = ({
  reviews,
  isVisible,
}: {
  reviews: GoogleReview[];
  isVisible: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number | null>(null);
  // Only auto-scroll (with a duplicated set) when there are enough cards to
  // overflow the row on desktop.
  const autoScroll = reviews.length > 3;

  const scroll = useCallback((direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!autoScroll) return;
    const animate = () => {
      if (scrollRef.current && !isHovering) {
        const oneSetWidth = scrollRef.current.scrollWidth / 2;
        scrollRef.current.scrollLeft += 1.5;
        if (scrollRef.current.scrollLeft >= oneSetWidth - 10) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovering, autoScroll]);

  const items = autoScroll ? [...reviews, ...reviews] : reviews;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((review, index) => (
          <ReviewCard
            key={`${review.authorName}-${index}`}
            review={review}
            index={index % reviews.length}
            isVisible={isVisible}
          />
        ))}
      </div>

      {autoScroll && (
        <>
          <button
            onClick={() => scroll("left")}
            aria-label="Previous reviews"
            className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition-all"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Next reviews"
            className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition-all"
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default function Reviews() {
  const headingFont = { fontFamily: "Cormorant Garamond, serif" };
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { data, loading } = useGoogleReviews();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const mapsUrl = data?.mapsUrl || GOOGLE_REVIEWS_SEARCH_URL;
  const writeReviewUrl = data?.writeReviewUrl || GOOGLE_REVIEWS_SEARCH_URL;
  const reviews = data?.reviews || [];

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-blue-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-widest mb-4">
            ✨ What Our Guests Say
          </span>
          <h2 className="h2 text-blue-900 mb-4 text-center" style={headingFont}>
            Unforgettable Moments
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-lg text-gray-600 font-light leading-relaxed text-center">
            Real reviews from guests who&apos;ve stayed with us, as posted on
            Google.
          </p>
        </div>

        {/* Average Rating Card (live from Google) */}
        {data?.rating != null && (
          <AverageRating
            isVisible={isVisible}
            rating={data.rating}
            totalReviews={data.totalReviews}
            mapsUrl={mapsUrl}
          />
        )}

        {/* Reviews */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-2xl">💬</span>
            Recent Google Reviews
          </h3>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <ReviewsCarousel reviews={reviews} isVisible={isVisible} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-700 font-light mb-4">
                See what guests are saying about Ziba Beach Resort on Google.
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-700 font-medium hover:underline"
              >
                <GoogleLogo className="w-4 h-4" />
                Read our reviews on Google
              </a>
            </div>
          )}
          {reviews.length > 0 && (
            <p className="mt-6 text-xs text-gray-500 flex items-center gap-1">
              <GoogleLogo /> Reviews provided by Google.{" "}
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="underline">
                See all
              </a>
            </p>
          )}
        </div>

        {/* CTA Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* Write Review CTA */}
          <div className="bg-linear-to-br from-blue-900 to-blue-800 text-white rounded-2xl p-8 sm:p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4 cormorant">
              Share Your Story
            </h3>
            <p className="font-light leading-relaxed mb-8">
              Your feedback helps us improve and guides future guests. We&apos;d love
              to hear about your Ziba experience!
            </p>
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-blue-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-50 transition w-full sm:w-fit whitespace-nowrap"
            >
              <GoogleLogo className="w-5 h-5 shrink-0" />
              Leave a Google Review
            </a>
          </div>

          {/* Highlights CTA: only facts we can stand behind */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-8 sm:p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 cormorant">
              Why Choose Us
            </h3>
            <ul className="space-y-4">
              {data?.rating != null && (
                <li className="flex gap-3 items-start">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {data.rating.toFixed(1)} on Google
                      {data.totalReviews !== null &&
                        ` · ${data.totalReviews.toLocaleString("en-NG")} reviews`}
                    </p>
                    <p className="text-sm text-gray-600 font-light">
                      Live rating from real guests
                    </p>
                  </div>
                </li>
              )}
              <li className="flex gap-3 items-start">
                <span className="text-2xl">🌊</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Overwater Rooms & Suites
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    Step straight from your room into our signature overwater pool
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-2xl">🏖️</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    A Beach Escape in Lagos
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    No visa stress or long flights — just Okun Ajah
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-blue-900 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 cormorant">
            Ready to Create Your Ziba Story?
          </h3>
          <p className="text-sm sm:text-base text-blue-100 font-light mb-4 sm:mb-6 max-w-2xl mx-auto">
            Book your getaway today and see why guests keep coming back to
            Ziba Beach Resort.
          </p>
          <a
            href={IPMS_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-900 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-blue-50 transition text-sm sm:text-base"
          >
            Explore Rooms & Book Now
          </a>
        </div>
      </div>
    </section>
  );
}
