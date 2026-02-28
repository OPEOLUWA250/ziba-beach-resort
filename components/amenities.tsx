"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const amenities = [
  {
    name: "Restaurant & Bar",
    image: "/experience-ziba/restaurant&bar.jpg",
  },
  {
    name: "FirePit",
    image: "/experience-ziba/firepit.jpg",
  },
  {
    name: "SPA",
    image: "/experience-ziba/spa.jpg",
  },
  {
    name: "Gym",
    image: "/experience-ziba/gym.jpg",
  },
  {
    name: "Conference Room",
    image: "/experience-ziba/conference-room.jpg",
  },
  {
    name: "Kids Outdoor Playground",
    image: "/experience-ziba/kids-outdoor-playground.jpg",
  },
  {
    name: "Cinema",
    image: "/experience-ziba/cinema.jpg",
  },
  {
    name: "Lagoon Pool",
    image: "/experience-ziba/lagoon-pool.jpg",
  },
];

// Duplicate amenities for seamless infinite scroll
const scrollAmenities = [...amenities, ...amenities];

export default function Amenities() {
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
      const oneSetWidth = scrollWidth / 2;

      // Continuously scroll right
      scrollRef.current.scrollLeft += 2;

      // Seamless reset: when reaching the end of first set, jump to beginning
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
      id="amenities"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`mb-16 text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-5xl font-light text-blue-900 mb-4 text-center"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            World-Class Amenities
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto text-center">
            Everything you need for an unforgettable stay, from premium
            facilities to thoughtful services.
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
            className="amenities-carousel flex gap-6 overflow-x-auto scroll-smooth"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {scrollAmenities.map((amenity, index) => (
              <div
                key={`${amenity.name}-${index}`}
                className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible
                    ? `${300 + (index % amenities.length) * 50}ms`
                    : "0ms",
                }}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 h-full flex flex-col cursor-pointer border border-gray-100 hover:border-blue-900">
                  {/* Image Container */}
                  <div className="relative w-full h-72 overflow-hidden bg-gray-200">
                    <Image
                      src={amenity.image}
                      alt={amenity.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                    />
                  </div>

                  {/* Name Container */}
                  <div className="p-6 flex items-center justify-center grow">
                    <h3 className="text-xl font-light text-gray-900 text-center">
                      {amenity.name}
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
