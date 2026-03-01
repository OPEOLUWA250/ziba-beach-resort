"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const experiences = [
  {
    name: "Floating Breakfast",
    image: "/experience-ziba/floating-breakfast.jpg",
  },
  {
    name: "Beach side Picnic",
    image: "/experience-ziba/beach-side-picnic.jpg",
  },
  { name: "Romantic dinner", image: "/experience-ziba/romantic-dinner.jpg" },
  { name: "Massages", image: "/experience-ziba/massages.jpg" },
  { name: "Horse riding", image: "/experience-ziba/horse-riding.jpg" },
  { name: "Quad Bike", image: "/experience-ziba/quad-bike.jpg" },
  { name: "Paint and Chill", image: "/experience-ziba/paint-and-chill.jpg" },
  { name: "Flying Dress", image: "/experience-ziba/flying-dress.jpg" },
  { name: "Floating Movie", image: "/experience-ziba/floating-movie.jpg" },
  { name: "Hand casting", image: "/experience-ziba/handcasting.jpg" },
  { name: "Kite flying", image: "/experience-ziba/kite-flying.jpg" },
  { name: "Indoor games", image: "/experience-ziba/indoor-games.jpg" },
  { name: "Adult/Kids Pool", image: "/experience-ziba/adult-kids-pool.jpg" },
  { name: "Ziba Kids Club", image: "/experience-ziba/ziba-kids-club.jpg" },
];

// Duplicate experiences for seamless infinite scroll
const scrollExperiences = [...experiences, ...experiences];

export default function ExperiencesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-28 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-5xl font-light text-blue-900 mb-4 text-center"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Experiences at Ziba
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-gray-600 font-light text-lg text-center max-w-2xl mx-auto">
            For all the activity enthusiasts out there, Ziba offers numerous
            activities and experiences that await to be discovered. Enjoy the
            moment and create memories of a lifetime.
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
                className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible
                    ? `${300 + (index % experiences.length) * 50}ms`
                    : "0ms",
                }}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 h-full flex flex-col cursor-pointer">
                  {/* Image Container */}
                  <div className="relative w-full h-72 overflow-hidden bg-gray-200">
                    <Image
                      src={experience.image}
                      alt={experience.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                    />
                  </div>

                  {/* Name Container */}
                  <div className="p-6 flex items-center justify-center grow">
                    <h3 className="text-xl font-light text-gray-900 text-center">
                      {experience.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
