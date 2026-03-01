"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { PopupData } from "@/lib/services/popups";
import Link from "next/link";

export function PopupBanner() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const response = await fetch("/api/popups?active=true");
        const data = await response.json();

        if (data.popups && data.popups.length > 0) {
          setPopup(data.popups[0]);
        }
      } catch (error) {
        console.error("[PopupBanner] Error fetching popup:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopup();
  }, []);

  if (isLoading || !popup) {
    return null;
  }

  return (
    <section className="py-20 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-6 p-8">
            {/* Image */}
            {popup.featured_image && (
              <div className="flex items-center justify-center rounded-lg overflow-hidden h-80 md:h-auto">
                <img
                  src={popup.featured_image}
                  alt={popup.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white cormorant mb-3">
                  {popup.title}
                </h2>
                <p className="text-xl text-amber-400 font-semibold mb-4">
                  {popup.excerpt}
                </p>
                {popup.content && (
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                    {popup.content}
                  </div>
                )}
              </div>

              {/* Tags */}
              {popup.tags && popup.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {popup.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <Link
                href={`/popups/${popup.slug}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-lg transition w-fit mt-4"
              >
                Learn More
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
