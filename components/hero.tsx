"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO SECTION - Design First */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url(/Ziba-hero.jpg)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            transform: `translateY(${scrollPos * 0.5}px)`,
          }}
        >
          {/* Multi-layer Overlay for Text Readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16">
          <div className="max-w-3xl text-center">
            {/* Subtitle */}
            <div className="mb-6 flex items-center gap-3 justify-center">
              <div
                className="w-12 h-0.5 bg-linear-to-r from-gold-400 to-transparent"
                style={{
                  background: "linear-gradient(90deg, #d4af37, transparent)",
                }}
              />
              <span
                className="text-gold-400 text-sm font-light tracking-widest"
                style={{ color: "#d4af37" }}
              >
                NIGERIA'S PREMIER OVERWATER RESORT
              </span>
              <div
                className="w-12 h-0.5 bg-linear-to-l from-gold-400 to-transparent"
                style={{
                  background: "linear-gradient(270deg, #d4af37, transparent)",
                }}
              />
            </div>

            {/* Main Title */}
            <h1
              className="text-7xl md:text-8xl lg:text-9xl font-light leading-tight text-white mb-8 tracking-tight"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ziba
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl font-light leading-relaxed mb-12">
              Experience luxury on the water. Floating rooms, ocean views, and
              unforgettable moments await.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
              <button
                onClick={scrollToBooking}
                className="group px-8 py-3 bg-linear-to-r from-gold-400 to-gold-500 text-black font-light text-lg tracking-wide hover:shadow-2xl hover:from-gold-300 hover:to-gold-400 transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f4d03f)",
                  color: "#1a1a1a",
                }}
              >
                <span className="flex items-center gap-2">
                  Book Your Stay
                  <span
                    className="transform group-hover:translate-x-1 transition-transform"
                    style={{ fontSize: "1.2rem" }}
                  >
                    →
                  </span>
                </span>
              </button>

              <button
                onClick={scrollToBooking}
                className="px-8 py-3 border-2 border-white text-white font-light text-lg tracking-wide hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Day Pass Experience
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-light">
                  ✓
                </div>
                <span className="font-light">Luxury Floating Rooms</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-light">
                  ✓
                </div>
                <span className="font-light">World-Class Amenities</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-light">
                  ✓
                </div>
                <span className="font-light">Ocean Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToBooking}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <div className="text-white text-center">
            <p className="text-sm font-light mb-2">Explore More</p>
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>
      </section>
    </>
  );
}
