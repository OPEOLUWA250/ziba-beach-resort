"use client";

interface PopupCTASectionProps {
  ctaText?: string;
  ctaUrl?: string;
}

export function PopupCTASection({ ctaText, ctaUrl }: PopupCTASectionProps) {
  if (!ctaUrl) return null;

  const handleClick = () => {
    if (ctaUrl) {
      window.location.href = ctaUrl;
    }
  };

  return (
    <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-2xl shadow-xl p-8 md:p-10 text-center">
      <h3 className="text-2xl md:text-3xl font-light text-white cormorant mb-3">
        Ready to Experience This?
      </h3>
      <p className="text-blue-100 font-light mb-6 max-w-2xl mx-auto">
        Don't miss out on this special offering at Ziba Beach Resort
      </p>
      <button
        onClick={handleClick}
        className="inline-block px-10 py-4 bg-white hover:bg-gray-50 text-blue-900 font-light text-lg rounded-full shadow-lg transition-all hover:scale-105"
      >
        {ctaText || "Book Now"}
      </button>
    </div>
  );
}
