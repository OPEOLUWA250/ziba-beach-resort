"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function PopupBackButton({
  variant = "link",
}: {
  variant?: "link" | "button";
}) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's a valid referrer from document
    const referrer = document.referrer;

    // If referrer is from the same domain and not a popup page, go back
    if (
      referrer &&
      referrer.includes(window.location.hostname) &&
      !referrer.includes("/popups/")
    ) {
      window.history.back();
    } else {
      // Otherwise navigate to home
      router.push("/");
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-6 py-3 border border-blue-900 text-blue-900 hover:bg-blue-50 transition rounded-lg"
      >
        <ArrowLeft size={18} />
        Back
      </button>
    );
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-blue-900/60 hover:text-blue-900 mb-12 transition text-sm"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
