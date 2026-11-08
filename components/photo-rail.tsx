"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { useReveal, revealClass } from "@/hooks/use-reveal";

export interface RailItem {
  name: string;
  image: string;
  /** Optional short line under the name. */
  caption?: string;
}

/**
 * A swipeable row of photos: native scrolling with snap points (smooth on
 * phones, keyboard and trackpads), arrows in the heading on larger screens.
 */
export default function PhotoRail({
  id,
  eyebrow,
  title,
  intro,
  items,
  footer,
  tone = "light",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  items: RailItem[];
  footer?: ReactNode;
  tone?: "light" | "sand";
}) {
  const { ref, visible } = useReveal<HTMLElement>();
  const scroller = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const move = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-blue-950 transition hover:border-blue-900 hover:bg-blue-950 hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <section
      ref={ref}
      id={id}
      className={`overflow-hidden py-20 sm:py-28 ${tone === "sand" ? "bg-[#f7f4ee]" : "bg-white"}`}
    >
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <SectionHeading align="left" eyebrow={eyebrow} title={title}>
          {intro}
        </SectionHeading>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} disabled={atStart} className={arrow} aria-label={`Previous ${eyebrow.toLowerCase()}`}>
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => move(1)} disabled={atEnd} className={arrow} aria-label={`More ${eyebrow.toLowerCase()}`}>
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <ul
        ref={scroller}
        className={`mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:gap-6 sm:px-8 lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${revealClass(visible)}`}
        aria-label={title}
      >
        {items.map((item) => (
          <li
            key={item.name}
            className="group w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[30%] xl:w-[23%]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-slate-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-cormorant text-2xl font-medium leading-tight text-white">
                  {item.name}
                </h3>
                {item.caption && (
                  <p className="mt-1 text-xs font-light text-white/80">{item.caption}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {footer && <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8 lg:px-12">{footer}</div>}
    </section>
  );
}
