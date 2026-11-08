"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceNGN: number;
  isActive: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  timing: string;
  note: string;
  isActive: boolean;
  items: MenuItem[];
}

/** Anchor for a category, e.g. "lunch/dinner" → "lunch-dinner". */
const anchor = (id: string) => id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Menu text is typed in the admin, sometimes in capitals. Text that is all
 * capitals is shown in sentence case so it reads calmly; anything else is
 * shown exactly as typed.
 */
function calm(text: string) {
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (!letters || letters !== letters.toUpperCase()) return text;
  const lower = text.toLowerCase().replace(/\b(am|pm)\b/g, (m) => m.toUpperCase());
  return lower.replace(/(^\s*|[.!?|]\s+)([a-zà-ÿ])/g, (_, a, b) => a + b.toUpperCase());
}

const naira = (amount: number) => (amount === 0 ? "Included" : `₦${amount.toLocaleString("en-NG")}`);

export default function Menu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/menus")
      .then((res) => {
        if (!res.ok) throw new Error(`Menu ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCategories((data.categories || []).filter((c: MenuCategory) => c.items?.length));
      })
      .catch((err) => {
        console.error("Error loading menus:", err);
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Highlight the section being read, and keep its link in view.
  useEffect(() => {
    if (!categories.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-160px 0px -60% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(anchor(c.id));
      if (el) observer.observe(el);
    });
    // Arriving with a #section link: scroll to it once the menu has loaded.
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    if (!active) return;
    navRef.current
      ?.querySelector<HTMLElement>(`[data-anchor="${active}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          eyebrow="Beach bar & restaurant"
          title="Our menu"
          subtitle="Nigerian and international dishes, fresh juices and tropical cocktails, served with an ocean breeze."
          imageUrl="/ziba-hero-images/menu-hero.jpg"
          imageAlt="A floating breakfast tray in the pool at Ziba"
        />

        {categories.length > 0 && (
          <div className="sticky top-[84px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur sm:top-[104px]">
            <div
              ref={navRef}
              className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 py-3 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((c) => {
                const id = anchor(c.id);
                return (
                  <a
                    key={c.id}
                    href={`#${id}`}
                    data-anchor={id}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                      active === id ? "bg-blue-950 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {c.name}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-5xl">
            {loading ? (
              <div className="space-y-4" aria-label="Loading the menu">
                {[0, 1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : failed || categories.length === 0 ? (
              <div className="rounded-3xl bg-[#f7f4ee] px-6 py-12 text-center">
                <h2 className="font-cormorant text-4xl font-medium text-blue-950">The menu isn&apos;t loading right now</h2>
                <p className="mt-3 font-light text-slate-600">Please try again shortly, or ask our team when you arrive.</p>
              </div>
            ) : (
              <div className="space-y-20">
                {categories.map((category) => (
                  <section key={category.id} id={anchor(category.id)} className="scroll-mt-48">
                    <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                      <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-blue-950">{category.name}</h2>
                      {category.timing && (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {category.timing}
                        </p>
                      )}
                    </div>
                    {category.note && (
                      <p className="mt-5 flex gap-2.5 text-sm font-light leading-relaxed text-slate-600">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" aria-hidden="true" />
                        {calm(category.note)}
                      </p>
                    )}
                    <ul className="mt-6 grid gap-x-12 md:grid-cols-2">
                      {category.items.map((item) => (
                        <li key={item.id} className="border-b border-slate-100 py-5">
                          <div className="flex items-baseline gap-3">
                            <h3 className="min-w-0 break-words font-cormorant text-xl sm:text-2xl font-medium leading-snug text-slate-900">
                              {item.name}
                            </h3>
                            <span className="mx-1 hidden h-px flex-1 translate-y-[-4px] border-b border-dotted border-slate-300 sm:block" aria-hidden="true" />
                            <span className="ml-auto shrink-0 text-sm font-semibold text-blue-950 sm:ml-0">
                              {naira(item.priceNGN)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1.5 text-sm font-light leading-relaxed text-slate-600">{item.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
                <p className="text-xs font-light text-slate-500">
                  Prices are in naira. Menu items and prices may change; our team will confirm when you order.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-blue-950 px-5 py-20 text-center sm:px-8">
          <h2 className="font-cormorant text-4xl sm:text-5xl font-medium text-white">Come hungry</h2>
          <p className="mx-auto mt-4 max-w-xl font-light text-white/80">
            Dine with us on a day pass, or stay the night and wake up to breakfast by the sea.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/day-pass"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-blue-950 hover:bg-blue-50"
            >
              Book a day pass
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/bookings"
              className="inline-flex items-center rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              See rooms
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
