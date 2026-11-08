"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PhotoRail from "@/components/photo-rail";

// The facilities listed on zibabeachresort.com ("Our Facilities"), plus massages.
const amenities = [
  { name: "Lagoon pool", image: "/experience-ziba/lagoon-pool.jpg" },
  { name: "Adult and kids' pool", image: "/experience-ziba/adult-kids-pool.jpg" },
  { name: "Restaurant & bar", image: "/experience-ziba/restaurant&bar.jpg" },
  { name: "Spa", image: "/experience-ziba/spa.jpg" },
  { name: "Ziba Kids' Club", image: "/experience-ziba/ziba-kids-club.jpg" },
  { name: "Kids' playground", image: "/experience-ziba/kids-outdoor-playground.jpg" },
  { name: "Games room", image: "/experience-ziba/indoor-games.jpg" },
  { name: "Cinema", image: "/experience-ziba/cinema.jpg" },
  { name: "Firepit", image: "/experience-ziba/firepit.jpg" },
  { name: "Gym", image: "/experience-ziba/gym.jpg" },
  { name: "Conference room", image: "/experience-ziba/conference-room.jpg" },
  { name: "Massages", image: "/experience-ziba/spa-2.jpg" },
];

export default function Amenities() {
  return (
    <PhotoRail
      id="amenities"
      tone="sand"
      eyebrow="Facilities"
      title="Everything on site"
      intro="Two pools, a spa, a cinema, a kids' club and more, all a short walk from your room."
      items={amenities}
      footer={
        <Link
          href="/our-story#resort-map"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-900 hover:text-blue-700"
        >
          Explore the resort map
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      }
    />
  );
}
