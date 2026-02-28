"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export default function RoomGalleryCarousel({
  images,
  roomName,
}: RoomGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const animationRef = useRef<number | null>(null);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft <
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10,
      );
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

  // Auto-scroll effect
  useEffect(() => {
    const animate = () => {
      if (!scrollRef.current || isHovering) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;

      // Continuously scroll right
      scrollRef.current.scrollLeft += 1;

      // Loop back to beginning when reaching end
      if (scrollRef.current.scrollLeft >= maxScroll - 5) {
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

  // Update selected index based on scroll position
  useEffect(() => {
    const updateSelectedIndex = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const itemWidth = scrollRef.current.scrollWidth / images.length || 400;
        const index = Math.round(scrollLeft / itemWidth);
        setSelectedIndex(Math.min(index, images.length - 1));
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateSelectedIndex);
      return () =>
        scrollContainer.removeEventListener("scroll", updateSelectedIndex);
    }
  }, [images.length]);

  return (
    <div className="w-full">
      {/* Main Gallery */}
      <div
        className="relative group mb-6"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {images.map((image, index) => (
            <div
              key={`${roomName}-image-${index}`}
              className="flex-shrink-0 w-full lg:w-1/2 aspect-video rounded-xl overflow-hidden"
            >
              <Image
                src={image}
                alt={`${roomName} - Image ${index + 1}`}
                width={800}
                height={450}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                quality={90}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={`thumb-${index}`}
            onClick={() => {
              if (scrollRef.current) {
                const itemWidth = scrollRef.current.scrollWidth / images.length;
                scrollRef.current.scrollLeft = itemWidth * index;
              }
            }}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              index === selectedIndex
                ? "border-blue-900 opacity-100"
                : "border-gray-300 opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              quality={60}
            />
          </button>
        ))}
      </div>

      {/* Image Counter */}
      <div className="text-center text-sm text-gray-600 font-light mt-4">
        {selectedIndex + 1} / {images.length}
      </div>
    </div>
  );
}
