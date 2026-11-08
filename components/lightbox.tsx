"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/hooks/use-is-client";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

/**
 * Full-screen photo viewer: swipe on phones, arrow keys and Escape on
 * computers, thumbnails to jump. Locks the page behind it while open and
 * returns focus to whatever opened it.
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  title,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title?: string;
}) {
  const mounted = useIsClient();
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const count = images.length;

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + count) % count),
    [count, index, onIndexChange],
  );

  // Lock scrolling behind the viewer and restore focus afterwards.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Keep the current thumbnail in view.
  useEffect(() => {
    const thumb = thumbsRef.current?.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  if (!mounted || count === 0) return null;
  const current = images[index];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} photos` : "Photos"}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white outline-none"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <p className="min-w-0 truncate text-sm font-light text-white/80">
          {title && <span className="font-medium text-white">{title} · </span>}
          {index + 1} / {count}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          aria-label="Close photos"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex-1 touch-pan-y select-none"
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchMove={(e) => {
          if (!touch.current) return;
          const dx = e.touches[0].clientX - touch.current.x;
          const dy = e.touches[0].clientY - touch.current.y;
          if (Math.abs(dx) > Math.abs(dy)) setDragX(dx);
        }}
        onTouchEnd={() => {
          if (Math.abs(dragX) > 60) go(dragX < 0 ? 1 : -1);
          touch.current = null;
          setDragX(0);
        }}
      >
        <div
          className="absolute inset-0 px-2 sm:px-20"
          style={{
            transform: `translateX(${dragX}px)`,
            transition: dragX ? "none" : "transform 250ms ease-out",
          }}
        >
          <div className="relative h-full w-full">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              quality={85}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Load the neighbours so swiping feels instant. */}
        <div className="hidden" aria-hidden="true">
          {[images[(index + 1) % count], images[(index - 1 + count) % count]].map((img) => (
            <Image key={`pre-${img.src}`} src={img.src} alt="" width={1600} height={1067} sizes="100vw" />
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition ${
                i === index ? "ring-2 ring-white" : "opacity-50 hover:opacity-90"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
