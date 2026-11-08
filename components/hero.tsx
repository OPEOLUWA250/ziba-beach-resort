"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { IPMS_BOOKING_URL } from "@/lib/booking-links";
import { track } from "@/lib/analytics";
import ResortConditions from "@/components/resort-conditions";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Same slides, in the same order, as the hero on zibabeachresort.com
// (updated 2026-10 for the new Grand Overwater Villa).
const heroImages = [
  {
    src: "/ziba-hero-images/ziba-home/ziba-grand-overwater-villa.jpg",
    alt: "Aerial view of Ziba's Grand Overwater Villa: white rooms set around a turquoise pool with palm islands, beside the beach",
  },
  {
    src: "/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-villa.jpg",
    alt: "Grand Overwater Villa from above, with overwater rooms around the pool and the Atlantic Ocean behind",
  },
  {
    src: "/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-pool.jpg",
    alt: "The Grand Overwater pool, with private decks and steps from each room straight into the water",
  },
  {
    src: "/ziba-hero-images/ziba-home/ziba-aerial-view-phase-2-grand-overwater-villa.jpg",
    alt: "Ziba Beach Resort from the air: the main pool and palm garden, with the new Grand Overwater Villa beyond",
  },
  {
    src: "/ziba-hero-images/ziba-home/ziba-grand-overwater-loft-rooms-exterior.jpg",
    alt: "Grand Overwater Loft rooms, each with a sun lounger on a deck that opens onto the pool",
  },
];

const SLIDE_MS = 6000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax runs straight on the element, once per frame, with no
  // transition: the photo moves with the scroll instead of trailing it.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setCurrent((i) => (i + 1) % heroImages.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-slate-900"
      aria-roledescription="carousel"
      aria-label="Ziba Beach Resort"
    >
      {/* Slides: the outer layer moves with the scroll, each slide only fades and zooms. */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
            style={{ opacity: current === index ? 1 : 0 }}
            aria-hidden={current !== index}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={80}
              className={`object-cover motion-safe:transition-transform motion-safe:ease-out ${
                current === index
                  ? "scale-105 motion-safe:duration-[7000ms]"
                  : "scale-100 duration-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Readability: darker at the top for the menu and bottom for the text, clear in the middle. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/55 pointer-events-none" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <p
          className="mb-5 text-[11px] sm:text-xs font-medium uppercase tracking-[0.35em] text-white/85"
          style={{ animation: "heroUp 0.9s ease-out both" }}
        >
          Ziba Beach Resort · Lagos
        </p>
        <h1
          className={`${cormorant.className} max-w-5xl text-[2.9rem] leading-[1.02] sm:text-7xl md:text-8xl font-semibold tracking-tight text-white`}
          style={{
            animation: "heroUp 0.9s ease-out 0.1s both",
            textShadow: "0 2px 24px rgba(0,0,0,0.35)",
          }}
        >
          Nigeria&apos;s first
          <br />
          overwater resort
        </h1>
        <p
          className="mt-6 max-w-xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-white/90"
          style={{ animation: "heroUp 0.9s ease-out 0.2s both" }}
        >
          World-class, experience-led beachside holidays, without the visa
          stress or long flights.
        </p>

        <div
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4"
          style={{ animation: "heroUp 0.9s ease-out 0.3s both" }}
        >
          <a
            href={IPMS_BOOKING_URL}
            onClick={() => track("room_book_click", { context: "hero" })}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm sm:text-base font-semibold text-blue-950 shadow-lg shadow-black/10 transition hover:bg-blue-50"
          >
            Reserve your stay
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <Link
            href="/day-pass"
            className="inline-flex items-center justify-center rounded-full border border-white/70 px-8 py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/10"
          >
            Book a day pass
          </Link>
        </div>
      </div>

      {/* Bottom bar: today's conditions on the left, slide controls on the right. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-5 pb-6 sm:px-10 sm:pb-8">
        <ResortConditions />
        <div className="ml-auto flex items-center gap-2">
          {heroImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => {
                setCurrent(index);
                setPaused(true);
              }}
              aria-label={`Show photo ${index + 1} of ${heroImages.length}`}
              aria-current={current === index}
              className={`h-1 rounded-full transition-all duration-500 ${
                current === index ? "w-8 bg-white" : "w-4 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes heroUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
