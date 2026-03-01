"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { PopupData } from "@/lib/services/popups";

export function PopupModal() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        // Use absolute URL for production compatibility
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        const fetchUrl = `${baseUrl}/api/popups?active=true`;
        console.log("[PopupModal] Fetching from:", fetchUrl);

        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("[PopupModal] API Response:", data);

        if (data.success && data.popups && data.popups.length > 0) {
          setPopup(data.popups[0]);
          console.log("[PopupModal] Popup loaded:", data.popups[0].title);

          // Check if coming from popup dedicated page via referrer
          const fromPopupPage = document.referrer.includes("/popups/");
          if (fromPopupPage) {
            setHasTriggered(true); // Don't show if coming back from popup page
          }
        } else {
          console.warn("[PopupModal] No active popups found", data);
        }
      } catch (error: any) {
        const errorMsg = error?.message || "Unknown error";
        console.error("[PopupModal] Error fetching popup:", errorMsg, error);
      } finally {
        setIsLoading(false);
      }
    };

    // Delay fetch slightly to ensure page is fully loaded
    const timer = setTimeout(fetchPopup, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!popup || hasTriggered) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show popup after scrolling 300px down
      if (scrollPosition > 300 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [popup, hasTriggered]);

  if (isLoading || !popup) {
    return null;
  }

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full overflow-hidden rounded-lg border border-blue-900/20">
            {/* Close Button - Top Right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-1 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {/* Image Section - On Top */}
            {popup.featured_image && (
              <div className="relative overflow-hidden w-full h-80">
                <img
                  src={popup.featured_image}
                  alt={popup.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Text Content Section */}
            <div className="p-6 space-y-5">
              {/* Title */}
              <h3 className="text-2xl font-light text-gray-900 cormorant leading-tight">
                {popup.title}
              </h3>

              {/* Excerpt */}
              <p className="text-base text-gray-600 leading-relaxed font-light">
                {popup.excerpt}
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`/popups/${popup.slug}`}
                  className="w-full px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white font-light text-center transition border border-blue-900 rounded-2xl inline-block"
                >
                  {popup.modal_cta_text || "Learn More"}
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-blue-900 font-light text-center transition border border-blue-900/20 rounded-2xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
