"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function BookingCards() {
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
      id="booking-section"
      className="pt-28 pb-32 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="h2 text-blue-900 mb-6 text-center">
            Choose Your Experience
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Whether you're looking for a luxurious overnight escape or a day of
            exploration, we have the perfect option for you.
          </p>
        </div>

        {/* Booking Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Day Experience Card */}
          <div
            className={`group relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 h-96 hover-lift ${
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

            {/* Overlay - Strong dark gradient for excellent text visibility */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/70 to-black/50" />

            {/* Content */}
            <div className="relative h-full p-10 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100/20 mb-6 backdrop-blur-sm border border-orange-100/30 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl">☀️</span>
              </div>

              <div className="text-xs font-light text-orange-100 mb-3 tracking-widest">
                DAY PASS
              </div>

              <h3
                className="text-3xl font-light text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Day Experience
              </h3>

              <p className="text-gray-100 font-light mb-8 leading-relaxed text-sm">
                Spend 8 hours (10am - 6pm) enjoying full access to all
                facilities, dining, activities, and our stunning beach views.
                Perfect for a luxurious day out.
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {[
                  "Pool & Beach Access",
                  "Restaurant & Bar",
                  "All Activities",
                  "Spa Treatments",
                  "8 Hours • 10am - 6pm",
                ].map((feature, idx) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-3 text-xs text-gray-100 font-light transition-all duration-500 ${
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
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/product/day-pass/">
                <button
                  className="w-full bg-linear-to-r from-blue-900 to-blue-800 text-white px-6 py-4 font-light tracking-wide hover:from-blue-800 hover:to-blue-900 transition-all duration-500 transform hover:scale-105 active:scale-95 rounded-lg shadow-lg hover:shadow-2xl buttonGlow group/btn -translate-y-0 hover:-translate-y-1"
                  style={{ boxShadow: "0 4px 15px rgba(15, 23, 42, 0.3)" }}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    Explore Day Experience
                    <svg
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
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

          {/* Night Experience Card */}
          <div
            className={`group relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 h-96 hover-lift ${
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

            {/* Overlay - Dark for night */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />

            {/* Content */}
            <div className="relative h-full p-10 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100/20 mb-6 backdrop-blur-sm border border-blue-100/30 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl">🌙</span>
              </div>

              <div className="text-xs font-light text-blue-100 mb-3 tracking-widest">
                OVERNIGHT STAY
              </div>

              <h3
                className="text-3xl font-light text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Night Experience
              </h3>

              <p className="text-gray-100 font-light mb-8 leading-relaxed text-sm">
                Wake to ocean views, enjoy our world-class amenities, fine
                dining, spa services, and create lasting memories in your
                private floating sanctuary.
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {[
                  "Floating Rooms & Suites",
                  "Ocean Views",
                  "Fine Dining",
                  "Spa Access",
                  "24/7 Concierge",
                ].map((feature, idx) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-3 text-xs text-gray-100 font-light transition-all duration-500 ${
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
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/bookings">
                <button
                  className="w-full bg-linear-to-r from-blue-900 to-blue-800 text-white px-6 py-4 font-light tracking-wide hover:from-blue-800 hover:to-blue-900 transition-all duration-500 transform hover:scale-105 active:scale-95 rounded-lg shadow-lg hover:shadow-2xl buttonGlow group/btn -translate-y-0 hover:-translate-y-1"
                  style={{ boxShadow: "0 4px 15px rgba(15, 23, 42, 0.3)" }}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    Explore Night Experience
                    <svg
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
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
      </div>
    </section>
  );
}
