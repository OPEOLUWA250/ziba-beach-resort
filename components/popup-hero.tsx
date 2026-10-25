"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface PopupHeroProps {
  featuredImage: string;
  title: string;
}

export function PopupHero({ featuredImage, title }: PopupHeroProps) {
  const router = useRouter();

  const handleBack = () => {
    const referrer = document.referrer;
    if (
      referrer &&
      referrer.includes(window.location.hostname) &&
      !referrer.includes("/popups/")
    ) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
      {/* Background Image - No overlay, image speaks for itself */}
      {featuredImage && (
        <img
          src={featuredImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      )}

      {/* Back Button - Floating Top Left */}
      <div className="absolute top-6 left-4 md:left-8 z-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/95 hover:bg-white text-blue-900 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-105 font-light"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-4.5 w-4.5" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>
    </div>
  );
}
