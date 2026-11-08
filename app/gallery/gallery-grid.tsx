"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/lightbox";
import { GALLERY_CATEGORIES, GALLERY_PHOTOS, type GalleryCategory } from "@/lib/gallery";

export default function GalleryGrid() {
  const [filter, setFilter] = useState<GalleryCategory | "All">("All");
  const [open, setOpen] = useState<number | null>(null);

  const photos = useMemo(
    () => (filter === "All" ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos">
        {(["All", ...GALLERY_CATEGORIES] as const).map((c) => {
          const count = c === "All" ? GALLERY_PHOTOS.length : GALLERY_PHOTOS.filter((p) => p.category === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`rounded-full px-5 py-2.5 text-sm transition ${
                filter === c ? "bg-blue-950 text-white" : "border border-slate-300 text-slate-700 hover:border-blue-950"
              }`}
            >
              {c} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Masonry: columns keep each photo's own shape. */}
      <ul className="mt-10 columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
        {photos.map((photo, i) => (
          <li key={photo.src + i} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-slate-100"
              aria-label={`Open photo: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={600}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-xs font-light text-white opacity-0 transition group-hover:opacity-100">
                {photo.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox
          images={photos}
          index={open}
          onIndexChange={setOpen}
          onClose={() => setOpen(null)}
          title={filter === "All" ? "Gallery" : filter}
        />
      )}
    </>
  );
}
