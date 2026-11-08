"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";

const MAP_IMAGE = "/ziba-hero-images/ziba-home/ziba-aerial-view-phase-2-grand-overwater-villa.jpg";

/**
 * Places on the aerial photo, as percentages of its width and height.
 * Only places that can be clearly seen in this photo are marked; add more
 * (spa, kids' club, restaurant…) once their positions are confirmed.
 */
const SPOTS = [
  {
    id: "villa",
    name: "Grand Overwater Villa",
    x: 76,
    y: 20,
    text: "Two-level lofts and studios with steps from each room straight into the water.",
    image: "/ziba-hero-images/ziba-home/ziba-grand-overwater-loft-rooms-exterior.jpg",
    href: "/bookings/rooms/room10",
    cta: "See the lofts",
  },
  {
    id: "overwater-pool",
    name: "Grand Overwater pool",
    x: 85,
    y: 32,
    text: "The signature overwater pool, shared by the Grand Overwater rooms.",
    image: "/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-pool.jpg",
    href: "/bookings/rooms/room11",
    cta: "See the studios",
  },
  {
    id: "rooms",
    name: "Rooms & suites",
    x: 36,
    y: 32,
    text: "Rooms, suites and family rooms with balconies over the gardens and pool.",
    image: "/ziba-rooms/beach-facing-room/beach-facing-room-hero.jpg",
    href: "/bookings",
    cta: "All rooms",
  },
  {
    id: "main-pool",
    name: "Adult & kids' pool",
    x: 60,
    y: 63,
    text: "The main pool for grown-ups and children, with loungers and a volleyball net.",
    image: "/experience-ziba/adult-kids-pool.jpg",
    href: "/day-pass",
    cta: "Day passes",
  },
  {
    id: "cabanas",
    name: "Pool cabanas",
    x: 71,
    y: 47,
    text: "Shaded cabanas on the deck beside the main pool.",
    image: "/experience-ziba/adult-kids-pool.jpg",
    href: "/day-pass",
    cta: "Day passes",
  },
  {
    id: "beach",
    name: "The beach",
    x: 95,
    y: 44,
    text: "Out to the Atlantic shore for walks, picnics and horse rides.",
    image: "/day-experience.jpg",
    href: "/experience#activities",
    cta: "Beach activities",
  },
  {
    id: "playground",
    name: "Kids' playground",
    x: 95,
    y: 88,
    text: "Swings, slides and space for younger guests to play.",
    image: "/experience-ziba/kids-outdoor-playground.jpg",
    href: "/experience#activities",
    cta: "Family activities",
  },
] as const;

export default function ResortMap() {
  const [activeId, setActiveId] = useState<string>(SPOTS[0].id);
  const active = SPOTS.find((s) => s.id === activeId) ?? SPOTS[0];

  return (
    <section id="resort-map" className="scroll-mt-28 bg-[#f7f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading align="left" eyebrow="Resort map" title="Find your way around">
          Tap a number to see what&apos;s there.
        </SectionHeading>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:gap-10">
          {/* The aerial photo with numbered pins */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-slate-200">
            <Image
              src={MAP_IMAGE}
              alt="Aerial photo of Ziba Beach Resort with numbered places marked"
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            {SPOTS.map((spot, i) => {
              const isActive = spot.id === active.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveId(spot.id)}
                  aria-label={`${i + 1}. ${spot.name}`}
                  aria-pressed={isActive}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  {isActive && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/70 motion-reduce:hidden" aria-hidden="true" />
                  )}
                  <span
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold shadow-lg ring-2 transition sm:h-9 sm:w-9 sm:text-sm ${
                      isActive
                        ? "bg-blue-950 text-white ring-white"
                        : "bg-white text-blue-950 ring-white/60 group-hover:bg-blue-950 group-hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-slate-900 shadow group-hover:block sm:block sm:opacity-0 sm:group-hover:opacity-100">
                    {spot.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* The chosen place, and the list of all places */}
          <div className="flex flex-col gap-6">
            <article className="overflow-hidden rounded-3xl bg-white" aria-live="polite">
              <div className="relative aspect-[16/9] bg-slate-100">
                <Image
                  key={active.image + active.id}
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-cormorant text-3xl font-medium text-blue-950">{active.name}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-slate-600">{active.text}</p>
                <Link
                  href={active.href}
                  className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900"
                >
                  {active.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </article>

            <ol className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {SPOTS.map((spot, i) => (
                <li key={spot.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(spot.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                      spot.id === active.id ? "bg-white font-medium text-blue-950" : "text-slate-600 hover:bg-white/60"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        spot.id === active.id ? "bg-blue-950 text-white" : "bg-white text-blue-950"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {spot.name}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
