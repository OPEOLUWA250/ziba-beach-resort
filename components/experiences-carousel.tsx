"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const experiences = [
  { name: "Floating Breakfast", icon: "🍳", price: "₦15,000" },
  { name: "Beach Picnic", icon: "🏖️", price: "₦20,000" },
  { name: "Romantic Dinner", icon: "🕯️", price: "₦30,000" },
  { name: "Massage Session", icon: "💆", price: "₦25,000" },
  { name: "Horse Riding", icon: "🐴", price: "₦18,000" },
  { name: "Quad Bike Tour", icon: "🏍️", price: "₦22,000" },
  { name: "Paint & Chill", icon: "🎨", price: "₦12,000" },
  { name: "Flying Dress", icon: "👗", price: "₦35,000" },
  { name: "Floating Movie", icon: "🎬", price: "₦40,000" },
];

// Duplicate experiences for seamless infinite scroll
const scrollExperiences = [...experiences, ...experiences];

export default function ExperiencesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number | null>(null);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      // For infinite scroll, both directions are always available
      setCanScrollLeft(true);
      setCanScrollRight(true);
    }
  }, []);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      if (scrollRef.current) {
        const scrollAmount = 400;
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
        setTimeout(checkScroll, 100);
      }
    },
    [checkScroll],
  );

  // Auto-scroll effect with smooth continuous scrolling using requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      if (!scrollRef.current || isHovering) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const oneSetWidth = scrollWidth / 2; // Width of one set of 9 cards

      // Continuously scroll right
      scrollRef.current.scrollLeft += 2;

      // Seamless reset: when reaching the end of first set, jump to beginning
      // This is imperceptible because content is identical
      if (scrollRef.current.scrollLeft >= oneSetWidth - 10) {
        scrollRef.current.scrollLeft = 0;
      }

      checkScroll();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering, checkScroll]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-5xl font-light text-gray-900 mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Our Experiences
          </h2>
          <p className="text-gray-600 font-light text-lg">
            Discover unforgettable moments and exclusive activities tailored for
            your perfect getaway
          </p>
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Carousel Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="experiences-carousel flex gap-6 overflow-x-auto scroll-smooth"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {scrollExperiences.map((experience, index) => (
              <div
                key={`${experience.name}-${index}`}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                  {/* Image Container */}
                  <div
                    className="relative w-full h-64 bg-cover bg-center"
                    style={{
                      backgroundImage: "url(/Ziba-hero.jpg)",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors" />
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col grow">
                    <div className="text-4xl mb-3">{experience.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {experience.name}
                    </h3>
                    <p className="text-lg text-blue-900 font-light mb-6 grow">
                      {experience.price}
                    </p>
                    <Button
                      className="w-full bg-blue-900 hover:bg-blue-800 text-white font-light"
                      size="sm"
                    >
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
