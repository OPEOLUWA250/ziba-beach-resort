"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { getActivePopups, PopupData } from "@/lib/services/popups";

interface Popup {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
}

export function PopupCarousel() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const data = await getActivePopups();
        const typedData = data.map((item: PopupData) => ({
          id: item.id || "",
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          featured_image: item.featured_image,
        })) as Popup[];
        setPopups(typedData);
      } catch (error) {
        console.error("Failed to load popups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopups();
  }, []);

  if (isLoading || !isVisible || popups.length === 0) {
    return null;
  }

  const currentPopup = popups[currentIndex];

  return (
    <div className="w-full bg-linear-to-b from-white via-blue-50 to-white py-6 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="md:max-w-sm mx-auto">
          {/* Image on Top - Optimized for Mobile */}
          {currentPopup.featured_image && (
            <div className="relative w-full aspect-video sm:aspect-auto sm:h-72 mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-blue-900/30 shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={currentPopup.featured_image}
                alt={currentPopup.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Card Content */}
          <div className="rounded-xl sm:rounded-2xl border-2 border-blue-900/20 bg-white/90 backdrop-blur-sm p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-lg hover:shadow-xl transition-shadow">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 cormorant leading-tight">
              {currentPopup.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
              {currentPopup.excerpt}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-3">
              <Link
                href={`/popups/${currentPopup.slug}`}
                className="w-full px-4 py-2.5 sm:py-3 bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-light text-center transition border border-blue-900 rounded-lg sm:rounded-2xl shadow-md hover:shadow-lg active:scale-95"
              >
                Learn More
              </Link>
            </div>

            {/* Carousel Indicators */}
            {popups.length > 1 && (
              <div className="flex gap-1.5 pt-3 sm:pt-4 justify-center">
                {popups.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition ${
                      index === currentIndex
                        ? "w-6 sm:w-8 h-1.5 sm:h-1 bg-blue-900"
                        : "w-1 sm:w-1.5 h-1.5 sm:h-1 bg-blue-300 hover:bg-blue-400"
                    }`}
                    aria-label={`Go to popup ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex items-center justify-center gap-1 mt-3 sm:mt-4 text-blue-900/60 hover:text-blue-900 text-xs sm:text-sm transition hover:underline"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
