"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { PopupData } from "@/lib/services/popups";

const dismissedKey = (id: string) => `ziba-popup-dismissed:${id}`;

function wasDismissed(id: string) {
  try {
    return sessionStorage.getItem(dismissedKey(id)) === "1";
  } catch {
    return false;
  }
}

/**
 * The homepage offer (the active popup from the admin), shown as a small card
 * that slides in at the corner after a little scrolling. It never covers the
 * page, closes with × or Escape, and stays closed for the rest of the visit.
 * (Still exported as PopupModal so existing imports keep working.)
 */
export function PopupModal() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/popups?active=true", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const first: PopupData | undefined = data?.success ? data.popups?.[0] : undefined;
        if (cancelled || !first?.id) return;
        // Not again for someone who closed it, or who's just come back from its page.
        if (wasDismissed(first.id) || document.referrer.includes(`/popups/${first.slug}`)) return;
        setPopup(first);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!popup || open) return;
    const onScroll = () => {
      if (window.scrollY > 300) setOpen(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [popup, open]);

  const close = () => {
    setOpen(false);
    setPopup(null);
    if (popup?.id) {
      try {
        sessionStorage.setItem(dismissedKey(popup.id), "1");
      } catch {
        // Private browsing: it simply may show again next visit.
      }
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!popup || !open) return null;

  return (
    <aside
      aria-label={`Offer: ${popup.title}`}
      className="fixed bottom-4 left-4 right-[5.25rem] z-40 overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-20px_rgba(2,6,23,0.45)] ring-1 ring-slate-900/5 animate-[offerIn_380ms_cubic-bezier(.2,.8,.2,1)] sm:bottom-7 sm:left-7 sm:right-auto sm:w-[22rem]"
    >
      {popup.featured_image && (
        <div className="relative aspect-[16/9] bg-slate-100">
          {/* Offer images are uploaded in the admin and may live on Supabase Storage. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={popup.featured_image} alt="" className="h-full w-full object-cover object-top" />
        </div>
      )}
      <button
        type="button"
        onClick={close}
        aria-label="Close offer"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-950"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-700">Offer</p>
        <h2 className="mt-1.5 font-cormorant text-2xl font-medium leading-tight text-blue-950">{popup.title}</h2>
        {popup.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm font-light leading-relaxed text-slate-600">{popup.excerpt.trim()}</p>
        )}
        <div className="mt-4 flex items-center gap-4">
          <Link
            href={`/popups/${popup.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            {popup.modal_cta_text || "See the offer"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button type="button" onClick={close} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Not now
          </button>
        </div>
      </div>
      <style>{`@keyframes offerIn{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){[class*="animate-[offerIn"]{animation:none!important}}`}</style>
    </aside>
  );
}
