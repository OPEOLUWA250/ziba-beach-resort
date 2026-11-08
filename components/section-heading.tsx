import type { ReactNode } from "react";

/**
 * The site's section heading: a small spaced-out label, a serif title and an
 * optional line of text. Left-aligned or centred so sections don't all look
 * the same.
 */
export default function SectionHeading({
  eyebrow,
  title,
  children,
  align = "center",
  tone = "dark",
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const centered = align === "center";
  const eyebrowColor = tone === "light" ? "text-white/75" : "text-blue-700";
  const titleColor = tone === "light" ? "text-white" : "text-blue-950";
  const bodyColor = tone === "light" ? "text-white/80" : "text-slate-600";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <p
          className={`mb-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={`font-cormorant text-4xl sm:text-5xl font-medium leading-[1.08] tracking-tight ${titleColor}`}
      >
        {title}
      </Tag>
      {children && (
        <div className={`mt-5 text-base sm:text-lg font-light leading-relaxed ${bodyColor}`}>
          {children}
        </div>
      )}
    </div>
  );
}
