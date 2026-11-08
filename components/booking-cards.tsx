"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { useReveal, revealClass } from "@/hooks/use-reveal";
import { IPMS_BOOKING_URL } from "@/lib/booking-links";
import { track } from "@/lib/analytics";

const OPTIONS = [
  {
    key: "day",
    label: "Day pass",
    title: "Spend the day",
    text: "Eight hours of sun, sea and pool, from 10am to 6pm, with food, drinks and activities on hand.",
    points: ["Pool and beach access", "Restaurant and bar", "Activities and games", "Daily, 10am–6pm"],
    image: "/day-experience.jpg",
    alt: "Guests relaxing on Ziba's beach on a day visit",
    href: "/day-pass",
    cta: "Book a day pass",
    external: false,
  },
  {
    key: "night",
    label: "Overnight stay",
    title: "Stay the night",
    text: "Wake up to the ocean or step straight from your room into the water in one of our overwater rooms.",
    points: ["Overwater rooms and suites", "Ocean and pool views", "Breakfast available", "24/7 front desk"],
    image: "/night-experience.jpg",
    alt: "A room at Ziba Beach Resort",
    href: IPMS_BOOKING_URL,
    cta: "Check availability",
    external: true,
  },
] as const;

export default function BookingCards() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="experience-cards"
      className="scroll-mt-20 bg-[#f7f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Plan your visit" title="A day by the sea, or a night on the water">
          Come for the day, or stay and wake up by the ocean.
        </SectionHeading>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {OPTIONS.map((option, i) => {
            const body = (
              <>
                <Image
                  src={option.image}
                  alt={option.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/0" />
                <div className="relative mt-auto p-7 sm:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75">
                    {option.label}
                  </p>
                  <h3 className="mt-3 font-cormorant text-4xl sm:text-5xl font-medium text-white">
                    {option.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm sm:text-base font-light leading-relaxed text-white/85">
                    {option.text}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {option.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-white/30 px-3 py-1 text-xs font-light text-white/90"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                    {option.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </>
            );
            const className = `group relative flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] sm:min-h-[600px] ${revealClass(visible)}`;
            const style = { transitionDelay: visible ? `${i * 120}ms` : "0ms" };
            return option.external ? (
              <a
                key={option.key}
                href={option.href}
                onClick={() => track("room_book_click", { context: "home_stay_card" })}
                className={className}
                style={style}
              >
                {body}
              </a>
            ) : (
              <Link key={option.key} href={option.href} className={className} style={style}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
