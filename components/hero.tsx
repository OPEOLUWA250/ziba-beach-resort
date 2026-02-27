"use client";

import { useState, useEffect } from "react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      {/* HERO SECTION - Exactly 100vh */}
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Background with Parallax */}
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: "url(/Ziba-hero.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
              transform: `translateY(${scrollPos * 0.5}px)`,
              opacity: 0.85,
            }}
          />

          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-transparent to-blue-900/30" />
          <div
            className="absolute inset-0 opacity-30 mix-blend-multiply"
            style={{
              background:
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
            }}
          />

          {/* Animated Accent Elements */}
          <div
            className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl opacity-20 mix-blend-screen"
            style={{
              background: "linear-gradient(135deg, #1e3a8a, #06b6d4)",
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-32 -left-40 sm:left-10 w-60 sm:w-80 h-60 sm:h-80 rounded-full blur-3xl opacity-15 mix-blend-screen"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #1e3a8a)",
              animation: "float 8s ease-in-out infinite 1s",
            }}
          />
        </div>

        {/* Content - Centered in 100vh with top padding */}
        <div className="absolute inset-0 flex flex-col items-center px-4 sm:px-6 lg:px-16 z-10 pt-16 sm:pt-24 md:pt-20 lg:pt-16">
          <div className="max-w-4xl w-full text-center space-y-6 sm:space-y-8 md:space-y-10 flex flex-col justify-center h-full">
            {/* Main Heading - Nigeria's first overwater resort */}
            <div style={{ animation: "slideUp 0.8s ease-out both" }}>
              <h1
                className={`${cormorant.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight`}
              >
                <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent block">
                  Nigeria's first
                </span>
                <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent block font-bold mt-1 sm:mt-2 md:mt-3 lg:mt-4">
                  overwater resort
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto font-light leading-relaxed px-2 sm:px-0"
              style={{ animation: "slideUp 0.8s ease-out 0.1s both" }}
            >
              World-class, experience-led beach side holidays in Nigeria
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center pt-2 sm:pt-4"
              style={{ animation: "slideUp 0.8s ease-out 0.2s both" }}
            >
              {/* Primary Button - Brand Blue Background */}
              <button
                onClick={() => (window.location.href = "/bookings")}
                className="group relative px-6 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide overflow-hidden rounded-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
                style={{
                  background: "#1e3a8a",
                  boxShadow: "0 20px 40px rgba(30, 58, 138, 0.4)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#162e6f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1e3a8a")
                }
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  Reserve Your Stay
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 transform group-hover:translate-x-1 transition-transform"
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

              {/* Secondary Button - White Border & Text */}
              <button
                onClick={() => (window.location.href = "/day-pass")}
                className="group relative px-6 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold tracking-wide rounded-lg border-2 border-white transition-all duration-500 transform hover:scale-105 backdrop-blur-sm hover:shadow-lg w-full sm:w-auto"
                style={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(255, 255, 255, 0.15)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 10px 30px rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(255, 255, 255, 0.05)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "none";
                }}
              >
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  Explore Day Pass
                  <span className="text-lg sm:text-xl group-hover:animate-pulse">
                    ☀️
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll to Explore Indicator - Bottom Center */}
        <button
          onClick={scrollToBooking}
          className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20 group cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <span className="text-white/60 text-xs sm:text-sm font-light tracking-widest uppercase group-hover:text-white transition-colors">
              Scroll to Explore
            </span>
            <div className="relative w-6 h-10 border-2 border-white/40 rounded-full group-hover:border-white/80 transition-colors">
              <div
                className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white/60 rounded-full group-hover:bg-white transition-all"
                style={{
                  animation: "scrollBounce 2s infinite",
                }}
              />
            </div>
          </div>
        </button>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(30px);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scrollBounce {
            0% {
              transform: translateY(-5px);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(8px);
              opacity: 0;
            }
          }
        `}</style>
      </section>
    </>
  );
}
