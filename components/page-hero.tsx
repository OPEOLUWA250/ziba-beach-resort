"use client";

import { useState, useEffect } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function PageHero({
  title,
  subtitle,
  imageUrl = "/Ziba-hero.jpg",
}: PageHeroProps) {
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${imageUrl})`,
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
          {/* Main Title */}
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-light leading-tight text-white mb-4 tracking-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-100 font-light leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
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
      </div>
    </section>
  );
}
