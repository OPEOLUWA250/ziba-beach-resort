"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function BookingCards() {
  const headingFont = { fontFamily: "Cormorant Garamond, serif" };
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <section
      ref={sectionRef}
      id="experience-cards"
      className="py-10 sm:py-12 lg:py-20 px-5 sm:px-6 lg:px-8 bg-white scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-10 sm:mb-12 lg:mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="h2 text-blue-900 mb-6 sm:mb-6 text-center"
            style={headingFont}
          >
            Choose Your Experience
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 sm:mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2">
            Whether you're looking for a luxurious overnight escape or a day of
            exploration, we have the perfect option for you.
          </p>
        </div>

        {/* Booking Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-16 sm:mt-12 lg:mt-16">
          {/* Day Experience Card */}
          <div
            className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:lg:-translate-y-4 min-h-96 sm:min-h-[420px] lg:min-h-[520px] hover-lift ${
              isVisible
                ? "opacity-100 translate-x-0 translate-y-0"
                : "opacity-0 -translate-x-10 translate-y-10"
            }`}
            style={{
              transitionDelay: isVisible ? "300ms" : "0ms",
              animation: isVisible
                ? "cardReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "none",
            }}
          >
            {/* Background Image */}
            <Image
              src="/day-experience.jpg"
              alt="Day Experience"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/80 via-35% to-black/40" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {/* Top Spacer */}
              <div className="flex-1" />

              {/* Content */}
              <div className="relative px-5 sm:px-6 lg:px-8 pb-6 sm:pb-6 lg:pb-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-orange-100/20 mb-3 sm:mb-3 lg:mb-4 backdrop-blur-sm border border-orange-100/30 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl sm:text-3xl lg:text-4xl">☀️</span>
                </div>

                {/* Label */}
                <div className="text-xs font-light text-orange-200 mb-2 sm:mb-2 lg:mb-3 tracking-widest">
                  DAY PASS
                </div>

                {/* Title */}
                <h3
                  className="text-xl sm:text-2xl lg:text-4xl font-light text-white mb-3 sm:mb-3 lg:mb-4 leading-tight"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Day Experience
                </h3>

                {/* Description */}
                <p className="text-gray-100 font-light mb-3 sm:mb-3 lg:mb-4 leading-relaxed text-xs sm:text-sm">
                  Spend 8 hours (10am - 6pm) enjoying full access to all
                  facilities, dining, activities, and our stunning beach views.
                  Perfect for a luxurious day out.
                </p>

                {/* Features List */}
                <ul className="space-y-1.5 sm:space-y-1.5 lg:space-y-2 mb-4 sm:mb-4 lg:mb-6">
                  {[
                    "Pool & Beach Access",
                    "Restaurant & Bar",
                    "All Activities",
                    "Spa Treatments",
                    "8 Hours • 10am - 6pm",
                  ].map((feature, idx) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2 text-xs text-gray-100 font-light transition-all duration-500 ${
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-5"
                      }`}
                      style={{
                        transitionDelay: isVisible
                          ? `${450 + idx * 50}ms`
                          : "0ms",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-300 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Link href="/product/day-pass/" className="block">
                  <button
                    className="w-full bg-linear-to-r from-blue-900 to-blue-800 text-white px-3 sm:px-6 py-2.5 sm:py-3 lg:py-4 font-light tracking-wide hover:from-blue-800 hover:to-blue-900 transition-all duration-500 transform hover:scale-105 active:scale-95 rounded-lg shadow-lg hover:shadow-2xl buttonGlow group/btn text-xs sm:text-sm"
                    style={{ boxShadow: "0 4px 15px rgba(15, 23, 42, 0.3)" }}
                  >
                    <span className="relative flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      Explore Now
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Night Experience Card */}
          <div
            className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:lg:-translate-y-4 min-h-96 sm:min-h-[420px] lg:min-h-[520px] hover-lift ${
              isVisible
                ? "opacity-100 translate-x-0 translate-y-0"
                : "opacity-0 translate-x-10 translate-y-10"
            }`}
            style={{
              transitionDelay: isVisible ? "500ms" : "0ms",
              animation: isVisible
                ? "cardReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both"
                : "none",
            }}
          >
            {/* Background Image */}
            <Image
              src="/night-experience.jpg"
              alt="Night Experience"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/80 via-35% to-black/40" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {/* Top Spacer */}
              <div className="flex-1" />

              {/* Content */}
              <div className="relative px-5 sm:px-6 lg:px-8 pb-6 sm:pb-6 lg:pb-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-blue-100/20 mb-3 sm:mb-3 lg:mb-4 backdrop-blur-sm border border-blue-100/30 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl sm:text-3xl lg:text-4xl">🌙</span>
                </div>

                {/* Label */}
                <div className="text-xs font-light text-blue-200 mb-2 sm:mb-2 lg:mb-3 tracking-widest">
                  OVERNIGHT STAY
                </div>

                {/* Title */}
                <h3
                  className="text-xl sm:text-2xl lg:text-4xl font-light text-white mb-3 sm:mb-3 lg:mb-4 leading-tight"
                  style={{ fontFamily: "Cormorant Garamond" }}
                >
                  Night Experience
                </h3>

                {/* Description */}
                <p className="text-gray-100 font-light mb-3 sm:mb-3 lg:mb-4 leading-relaxed text-xs sm:text-sm">
                  Wake to ocean views, enjoy our world-class amenities, fine
                  dining, spa services, and create lasting memories in your
                  private floating sanctuary.
                </p>

                {/* Features List */}
                <ul className="space-y-1.5 sm:space-y-1.5 lg:space-y-2 mb-4 sm:mb-4 lg:mb-6">
                  {[
                    "Floating Rooms & Suites",
                    "Ocean Views",
                    "Fine Dining",
                    "Spa Access",
                    "24/7 Concierge",
                  ].map((feature, idx) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2 text-xs text-gray-100 font-light transition-all duration-500 ${
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-5"
                      }`}
                      style={{
                        transitionDelay: isVisible
                          ? `${450 + idx * 50}ms`
                          : "0ms",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-300 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <a href="https://live.ipms247.com/booking/book-rooms-zibaresort" target="_blank" rel="noopener noreferrer" className="block">
                  <button
                    className="w-full bg-linear-to-r from-blue-900 to-blue-800 text-white px-3 sm:px-6 py-2.5 sm:py-3 lg:py-4 font-light tracking-wide hover:from-blue-800 hover:to-blue-900 transition-all duration-500 transform hover:scale-105 active:scale-95 rounded-lg shadow-lg hover:shadow-2xl buttonGlow group/btn text-xs sm:text-sm"
                    style={{ boxShadow: "0 4px 15px rgba(15, 23, 42, 0.3)" }}
                  >
                    <span className="relative flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                      Explore Now
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
