"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { useReveal, revealClass } from "@/hooks/use-reveal";

const OCCASIONS = [
  {
    title: "Honeymoons & celebrations",
    text: "Build your own package: floating breakfast, beach dinner, decorated room and more.",
    href: "/celebrations",
    image: "/honeymoon/honeymoon-1.jpg",
    alt: "A couple celebrating at Ziba",
  },
  {
    title: "Weddings & team bonding",
    text: "Beach weddings, retreats and conferences for groups of any size.",
    href: "/events",
    image: "/team-bonding/team-bonding-1.jpg",
    alt: "A team bonding event at Ziba",
  },
  {
    title: "Gift a day pass",
    text: "A day at the beach for someone you love, with a personal message.",
    href: "/gift",
    image: "/day-experience.jpg",
    alt: "The beach at Ziba",
  },
  {
    title: "Seasonal offers",
    text: "Holiday packages and limited-time stays throughout the year.",
    href: "/offers",
    image: "/honeymoon/honeymoon-4.jpg",
    alt: "A decorated setting at Ziba",
  },
];

export default function ExperienceHighlights() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} id="occasions" className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Occasions" title="Made for the moments that matter">
          Honeymoons, birthdays, weddings and team retreats, planned with you.
        </SectionHeading>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OCCASIONS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl ${revealClass(visible)}`}
              style={{ transitionDelay: visible ? `${i * 90}ms` : "0ms" }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="-z-10 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="p-6">
                <h3 className="font-cormorant text-2xl sm:text-3xl font-medium leading-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/80">{item.text}</p>
              </div>
              <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-blue-950 transition group-hover:bg-white">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
