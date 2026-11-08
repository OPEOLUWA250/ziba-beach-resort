"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReveal, revealClass } from "@/hooks/use-reveal";

/** A full-width photo band: breaks up the page and introduces the restaurant. */
export default function MenuTeaser() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="dining"
      className="relative isolate flex min-h-[640px] items-end overflow-hidden sm:min-h-[720px] lg:items-center"
    >
      <Image
        src="/ziba-hero-images/menu-hero.jpg"
        alt="A floating breakfast tray in the pool at Ziba"
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/35 lg:to-transparent" />

      <div className={`mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 lg:px-12 lg:pb-0 ${revealClass(visible)}`}>
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75">
            Beach bar &amp; restaurant
          </p>
          <h2 className="mt-4 font-cormorant text-4xl sm:text-6xl font-medium leading-[1.05] text-white">
            Toes in the sand, a cocktail at sunset
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light leading-relaxed text-white/85">
            Nigerian and international dishes, fresh flavours and handmade
            tropical cocktails, with the ocean breeze for company.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
            >
              See the menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/experience#activities"
              className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-white/90 underline-offset-8 hover:underline"
            >
              Pool &amp; beach dining
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
