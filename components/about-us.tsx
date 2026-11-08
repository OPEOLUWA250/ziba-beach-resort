"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { useReveal, revealClass } from "@/hooks/use-reveal";
import { ROOM_IDS } from "@/lib/room-catalog";

// Plain facts about the resort (no awards or ratings we can't show proof of).
const FACTS = [
  { value: "Overwater", label: "Rooms that open onto the pool" },
  { value: String(ROOM_IDS.length), label: "Room and suite types" },
  { value: "10am–6pm", label: "Day pass, every day" },
  { value: "Okun Ajah", label: "On the beach in Lagos" },
];

export default function AboutUs() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="about"
      className="px-5 sm:px-8 lg:px-12 py-20 sm:py-28 bg-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={revealClass(visible)}>
          <SectionHeading
            align="left"
            eyebrow="Welcome to Ziba"
            title={
              <>
                A beach escape in Lagos,
                <br className="hidden sm:block" /> with rooms on the water
              </>
            }
          >
            <p>
              From overwater rooms to day visits and celebrations, Ziba brings
              the beauty and ease of a world-class getaway close to home,
              without the visa stress or long flights.
            </p>
            <p className="mt-4">
              Romantic weekends, family holidays or a birthday by the sea:
              every detail is planned so you can simply arrive and enjoy it.
            </p>
          </SectionHeading>

          <Link
            href="/our-story"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-900 hover:text-blue-700"
          >
            Our story
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div
          className={`relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5] ${revealClass(visible)} delay-150`}
        >
          <Image
            src="/experience-ziba/lagoon-pool.jpg"
            alt="Ziba's lagoon pool, with palm islands and sun loungers"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <dl className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 border-t border-slate-200 pt-10 lg:grid-cols-4">
        {FACTS.map((fact) => (
          <div key={fact.label} className="flex flex-col-reverse">
            <dt className="mt-1 text-sm font-light text-slate-500">
              {fact.label}
            </dt>
            <dd className="font-cormorant text-3xl sm:text-4xl font-medium text-blue-950">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
