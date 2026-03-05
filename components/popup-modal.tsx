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

  // Don't render anything while loading or if no popup
  if (isLoading) {
    return null;
  }

  if (!popup) {
    return null;
  }

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white max-w-md lg:max-w-5xl w-full h-[80vh] max-h-160 min-h-136 overflow-hidden rounded-2xl border border-blue-900/20 shadow-2xl">
            {/* Close Button - Top Right of Modal */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 sm:p-2.5 bg-white hover:bg-gray-100 rounded-full transition text-gray-900 hover:text-black shadow-2xl hover:shadow-xl hover:scale-110 active:scale-95"
            >
              <X size={32} strokeWidth={2.5} />
            </button>

            {popup.featured_image ? (
              <div className="h-full grid grid-rows-[7fr_3fr] lg:grid-cols-2 lg:grid-rows-1">
                {/* Image Section - 70% mobile emphasis, full-height desktop */}
                <div className="relative overflow-hidden bg-linear-to-b from-slate-100 to-slate-200">
                  <img
                    src={popup.featured_image}
                    alt={popup.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Text + CTA Section - 30% on mobile */}
                <div className="p-5 sm:p-6 lg:p-10 flex flex-col justify-between gap-3 lg:gap-5">
                  <div className="space-y-2 lg:space-y-4">
                    <h3
                      className="text-2xl lg:text-4xl font-light text-gray-900 cormorant leading-tight"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {popup.title}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed font-light line-clamp-3 lg:line-clamp-6">
                      {popup.excerpt}
                    </p>
                  </div>

                  <a
                    href={`/popups/${popup.slug}`}
                    className="w-full px-4 py-3 lg:py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-light text-center transition border border-blue-900 rounded-2xl inline-block"
                  >
                    {popup.modal_cta_text || "Learn More"}
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full p-6 lg:p-10 flex flex-col justify-center gap-5">
                <h3
                  className="text-2xl lg:text-4xl font-light text-gray-900 cormorant leading-tight"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {popup.title}
                </h3>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-light">
                  {popup.excerpt}
                </p>
                <a
                  href={`/popups/${popup.slug}`}
                  className="w-full px-4 py-3 lg:py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-light text-center transition border border-blue-900 rounded-2xl inline-block"
                >
                  {popup.modal_cta_text || "Learn More"}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
