"use client";

import { useEffect, useState } from "react";
import { ChevronUp, MapPin } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openLocation = () => {
    window.open(
      "https://www.google.com/maps?q=Ziba+Beach+Close+Okun+Ajah+Lagos+Nigeria",
      "_blank",
    );
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-4 sm:right-6 md:right-8 z-50 flex flex-col gap-2 animate-fadeIn">
          {/* Location Navigation Icon */}
          <button
            onClick={openLocation}
            className="p-3 rounded-full bg-blue-900 hover:bg-blue-800 text-white transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            aria-label="Navigate to Ziba Beach Resort"
            title="Ziba Beach Close, Okun Ajah, Lagos, Nigeria"
          >
            <MapPin size={24} strokeWidth={1.5} />
          </button>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-blue-900 hover:bg-blue-800 text-white transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            aria-label="Back to top"
            title="Back to top"
          >
            <ChevronUp size={24} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.animate-fadeIn) {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
