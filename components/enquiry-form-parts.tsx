"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export const fieldClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 aria-[invalid=true]:border-rose-500";

export function Field({
  label,
  error,
  children,
  className = "",
  hint,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm text-slate-700">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs font-light text-slate-500">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}

export function Counter({
  label,
  value,
  min = 0,
  max = 50,
  onChange,
  note,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
  note?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[15px] text-slate-900">{label}</p>
        {note && <p className="text-sm font-light text-slate-500">{note}</p>}
      </div>
      <div className="flex items-center rounded-full border border-slate-300">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30" aria-label={`Fewer: ${label}`}>
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="w-8 text-center text-sm font-medium" aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30" aria-label={`More: ${label}`}>
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** Hidden bot trap (see lib/server/body.ts). */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website (leave empty)
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function SentPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-[#f7f4ee] px-6 py-14 text-center sm:px-12" role="status">
      <CheckCircle2 className="mx-auto h-12 w-12 text-blue-800" strokeWidth={1.25} aria-hidden="true" />
      <h2 className="mt-5 font-cormorant text-4xl font-medium text-blue-950">{title}</h2>
      <div className="mx-auto mt-3 max-w-md font-light leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

export function WhatsAppFallback({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <div className="rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900">
      <p>We couldn&apos;t send your enquiry by email just now. You can send the same details on WhatsApp instead:</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-950 px-5 py-2.5 font-semibold text-white"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
        Send on WhatsApp
      </a>
    </div>
  );
}
