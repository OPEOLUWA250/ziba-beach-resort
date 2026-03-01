"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const ratings = [
  {
    platform: "Google Reviews",
    rating: "Fantastic",
    details: "Based on 1062 Reviews",
    icon: "🔍",
    color: "from-blue-900 to-blue-800",
    textColor: "text-blue-700",
    accentColor: "bg-blue-500",
  },
  {
    platform: "Booking.com",
    rating: "9.3/10",
    details: "Exceptional Rating",
    icon: "✓",
    color: "from-cyan-500 to-teal-600",
    textColor: "text-teal-600",
    accentColor: "bg-cyan-400",
  },
  {
    platform: "TripAdvisor",
    rating: "4.4/5",
    details: "Highly Rated",
    icon: "★",
    color: "from-amber-500 to-orange-600",
    textColor: "text-orange-600",
    accentColor: "bg-amber-400",
  },
];

export default function Ratings() {
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
      className="py-28 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/30 to-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Ratings Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {ratings.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-gray-400 transition-all duration-700 transform hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: isVisible ? `${300 + idx * 100}ms` : "0ms",
              }}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative p-8 sm:p-10 text-center">
                {/* Icon */}
                <div
                  className={`text-5xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500`}
                >
                  {item.icon}
                </div>

                {/* Platform Name */}
                <p
                  className={`text-xs font-light tracking-widest mb-3 uppercase bg-linear-to-r ${item.color} bg-clip-text text-transparent`}
                >
                  {item.platform}
                </p>

                {/* Rating */}
                <h3
                  className={`text-4xl sm:text-5xl font-light ${item.textColor} mb-4`}
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {item.rating}
                </h3>

                {/* Details */}
                <p className="text-gray-600 font-light text-sm mb-4">
                  {item.details}
                </p>

                {/* Bottom accent line */}
                <div
                  className={`h-1.5 bg-linear-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Text */}
        <div
          className={`mt-16 text-center max-w-2xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            transitionDelay: isVisible ? "600ms" : "0ms",
          }}
        >
          <p className="text-gray-700 font-light text-lg">
            Trusted and loved by guests worldwide, Ziba Beach Resort continues
            to set the benchmark for luxury hospitality in West Africa.
          </p>
        </div>
      </div>
    </section>
  );
}
