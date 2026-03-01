"use client";

interface PopupCTAButtonProps {
  text: string;
  url: string;
  className?: string;
}

export function PopupCTAButton({
  text,
  url,
  className = "",
}: PopupCTAButtonProps) {
  const handleClick = () => {
    if (url) {
      window.location.href = url;
    }
  };

  const defaultClassName =
    "px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white font-light text-center transition rounded-2xl";

  return (
    <button onClick={handleClick} className={className || defaultClassName}>
      {text || "Get Started"}
    </button>
  );
}
