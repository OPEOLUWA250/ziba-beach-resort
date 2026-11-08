"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PhotoRail from "@/components/photo-rail";

const experiences = [
  { name: "Floating breakfast", image: "/experience-ziba/floating-breakfast.jpg", caption: "Breakfast served in the pool" },
  { name: "Beachside picnic", image: "/experience-ziba/beach-side-picnic.jpg", caption: "A basket, a blanket and the sea" },
  { name: "Romantic dinner", image: "/experience-ziba/romantic-dinner.jpg", caption: "Three courses by the ocean" },
  { name: "Massages", image: "/experience-ziba/massages.jpg", caption: "Swedish, deep tissue and more" },
  { name: "Horse riding", image: "/experience-ziba/horse-riding.jpg", caption: "Along the beach" },
  { name: "Quad bikes", image: "/experience-ziba/quad-bike.jpg" },
  { name: "Paint 'n' chill", image: "/experience-ziba/paint-and-chill.jpg" },
  { name: "Flying dress shoot", image: "/experience-ziba/flying-dress.jpg" },
  { name: "Floating movie", image: "/experience-ziba/floating-movie.jpg", caption: "A film from the pool" },
  { name: "Hand casting", image: "/experience-ziba/handcasting.jpg", caption: "A keepsake of your hands together" },
  { name: "Kite flying", image: "/experience-ziba/kite-flying.jpg" },
];

export default function ExperiencesCarousel() {
  return (
    <PhotoRail
      id="experiences"
      eyebrow="Experiences"
      title="Moments worth the trip"
      intro="Add something special to your stay or day visit, from breakfast in the pool to a ride along the beach."
      items={experiences}
      footer={
        <Link
          href="/experience#activities"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-900 hover:text-blue-700"
        >
          All experiences and activities
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      }
    />
  );
}
