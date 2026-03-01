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
    <div className="w-full bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-sm mx-auto">
          {/* Image on Top */}
          {currentPopup.featured_image && (
            <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg border border-blue-900/20">
              <img
                src={currentPopup.featured_image}
                alt={currentPopup.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Card Content */}
          <div className="rounded-lg border border-blue-900/20 p-6 space-y-5">
            {/* Title */}
            <h2 className="text-2xl font-light text-gray-900 cormorant leading-tight">
              {currentPopup.title}
            </h2>

            {/* Excerpt */}
            <p className="text-base text-gray-600 leading-relaxed font-light">
              {currentPopup.excerpt}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 pt-3">
              <Link
                href={`/popups/${currentPopup.slug}`}
                className="w-full px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white font-light text-center transition border border-blue-900 rounded-2xl"
              >
                Learn More
              </Link>
            </div>

            {/* Carousel Indicators */}
            {popups.length > 1 && (
              <div className="flex gap-1.5 pt-4 justify-center">
                {popups.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition ${
                      index === currentIndex
                        ? "w-8 h-1 bg-blue-900"
                        : "w-1.5 h-1 bg-blue-200"
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
            className="flex items-center justify-center gap-1 mt-4 text-blue-900/60 hover:text-blue-900 text-sm transition"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
