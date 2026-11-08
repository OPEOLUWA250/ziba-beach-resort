"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, Send } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { honeymoonPackages, packagePrice } from "@/lib/honeymoon-packages";
import { ROOM_CATALOG, ROOM_IDS } from "@/lib/room-catalog";
import { whatsappLink } from "@/lib/booking-links";
import { track } from "@/lib/analytics";

const OCCASIONS = ["Honeymoon", "Anniversary", "Birthday", "Proposal", "Babymoon", "Just because"];

type Base =
  | { kind: "package"; id: string }
  | { kind: "room"; id: string }
  | { kind: "day" };

interface Extra {
  key: string;
  name: string;
  /** Naira per unit, or null when the resort quotes it on request. */
  price: number | null;
  unit: string;
}

/*
 * Extras the resort offers (zibabeachresort.com room services and
 * experiences). These have no published price, so they're quoted on request.
 */
const ON_REQUEST: Extra[] = [
  { key: "floating-breakfast", name: "Floating breakfast", price: null, unit: "per order" },
  { key: "romantic-dinner", name: "3-course romantic dinner for two", price: null, unit: "for two" },
  { key: "room-decoration", name: "Room balloon decoration", price: null, unit: "per room" },
  { key: "cake", name: "9-inch cake", price: null, unit: "per cake" },
  { key: "floating-movie", name: "Floating movie night for two", price: null, unit: "for two" },
  { key: "hand-casting", name: "Hand casting", price: null, unit: "per session" },
  { key: "photo-shoot", name: "Flying dress or clear kayak photo shoot", price: null, unit: "per shoot" },
  { key: "chair-massage", name: "Chair massage", price: null, unit: "per person" },
];

/** Day-pass add-ons from our database that make sense for a celebration. */
const PRICED_FROM_DB = /picnic|massage|horse|paint|lunch|dinner/i;

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export default function CelebrationBuilder() {
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [base, setBase] = useState<Base>({ kind: "package", id: honeymoonPackages[0].id });
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [priced, setPriced] = useState<Extra[]>([]);

  // Live prices for the add-ons we sell on the day pass.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/day-pass/experiences")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { name: string; price_per_person: number; available?: boolean; description?: string }[]) => {
        if (cancelled || !Array.isArray(rows)) return;
        const seen = new Set<string>();
        setPriced(
          rows
            .filter((r) => r.available !== false && PRICED_FROM_DB.test(r.name) && r.price_per_person > 0)
            // Skip test entries (keyboard-mash descriptions) and duplicate names (keep the first).
            .filter((r) => !/(.)\1{7,}/.test(r.description || ""))
            .filter((r) => {
              const k = r.name.trim().toLowerCase();
              if (seen.has(k)) return false;
              seen.add(k);
              return true;
            })
            .map((r) => ({
              key: `db:${r.name}`,
              name: r.name,
              price: r.price_per_person,
              unit: /\[for 2\]|for two|for 2/i.test(r.name) ? "for two" : "per person",
            })),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const extras = useMemo(() => [...priced, ...ON_REQUEST], [priced]);

  const baseLine = useMemo(() => {
    if (base.kind === "package") {
      const p = honeymoonPackages.find((x) => x.id === base.id)!;
      return { label: `${p.name}: ${p.stay}`, amount: packagePrice(p), detail: p.inclusions };
    }
    if (base.kind === "room") {
      const r = ROOM_CATALOG[base.id];
      return {
        label: `${r.name}, ${nights} ${nights === 1 ? "night" : "nights"}`,
        amount: r.priceFrom * nights,
        detail: [`From ${naira(r.priceFrom)} per night (room only; live rates on our booking engine)`],
      };
    }
    return { label: "Day visit, 10am–6pm", amount: null as number | null, detail: ["Day pass tickets are bought separately on our Day Pass page"] };
  }, [base, nights]);

  const chosen = extras.filter((e) => (qty[e.key] || 0) > 0);
  const extrasTotal = chosen.reduce((sum, e) => sum + (e.price ?? 0) * (qty[e.key] || 0), 0);
  const onRequestCount = chosen.filter((e) => e.price === null).length;
  const total = (baseLine.amount ?? 0) + extrasTotal;

  const change = (key: string, d: number) =>
    setQty((q) => {
      const next = Math.max(0, Math.min(20, (q[key] || 0) + d));
      const copy = { ...q, [key]: next };
      if (!next) delete copy[key];
      return copy;
    });

  const message = [
    `Hello Ziba, I'd like to plan a ${occasion.toLowerCase()} package.`,
    "",
    `Stay: ${baseLine.label}${baseLine.amount ? ` (${naira(baseLine.amount)})` : ""}`,
    `Guests: ${guests}`,
    date ? `Preferred date: ${new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : "Preferred date: flexible",
    chosen.length ? "" : null,
    chosen.length ? "Extras:" : null,
    ...chosen.map((e) => `- ${e.name} × ${qty[e.key]}${e.price ? ` (${naira(e.price * qty[e.key])})` : " (price on request)"}`),
    "",
    `Estimated total: ${naira(total)}${onRequestCount ? ` + ${onRequestCount} item(s) priced on request` : ""}`,
    notes.trim() ? `\nNotes: ${notes.trim()}` : null,
    name.trim() ? `\nName: ${name.trim()}` : null,
    "",
    "Please confirm availability and the final price.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  const field = "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10";
  const step = "text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-700";

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div className="space-y-14">
        {/* 1. Occasion */}
        <fieldset>
          <legend className={step}>1 · The occasion</legend>
          <div className="mt-5 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOccasion(o)}
                aria-pressed={occasion === o}
                className={`rounded-full px-5 py-2.5 text-sm transition ${
                  occasion === o ? "bg-blue-950 text-white" : "border border-slate-300 text-slate-700 hover:border-blue-950"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 2. Stay */}
        <fieldset>
          <legend className={step}>2 · Your stay</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(
              [
                ["package", "A honeymoon package", "Room, meals and experiences together"],
                ["room", "A room of your choice", "Add the extras you want"],
                ["day", "A day visit", "Celebrate without staying over"],
              ] as const
            ).map(([kind, title, text]) => (
              <button
                key={kind}
                type="button"
                onClick={() =>
                  setBase(
                    kind === "package"
                      ? { kind, id: honeymoonPackages[0].id }
                      : kind === "room"
                        ? { kind, id: "room08" }
                        : { kind },
                  )
                }
                aria-pressed={base.kind === kind}
                className={`rounded-3xl border p-5 text-left transition ${
                  base.kind === kind ? "border-blue-950 bg-blue-50/50" : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <span className="block font-medium text-slate-900">{title}</span>
                <span className="mt-1 block text-sm font-light text-slate-600">{text}</span>
              </button>
            ))}
          </div>

          {base.kind === "package" && (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {honeymoonPackages.map((p) => {
                const on = base.id === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setBase({ kind: "package", id: p.id })}
                      aria-pressed={on}
                      className={`flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left transition ${
                        on ? "border-blue-950 bg-blue-50/50" : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium text-slate-900">{p.name}</span>
                        <span className="block text-xs font-light text-slate-600">{p.stay}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-blue-950">{naira(packagePrice(p))}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {base.kind === "room" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-700">Room</span>
                <select
                  value={base.id}
                  onChange={(e) => setBase({ kind: "room", id: e.target.value })}
                  className={field}
                >
                  {ROOM_IDS.map((id) => (
                    <option key={id} value={id}>
                      {ROOM_CATALOG[id].name} (from {naira(ROOM_CATALOG[id].priceFrom)}/night)
                    </option>
                  ))}
                </select>
              </label>
              <Stepper label="Nights" value={nights} min={1} max={14} onChange={setNights} />
            </div>
          )}
        </fieldset>

        {/* 3. Extras */}
        <fieldset>
          <legend className={step}>3 · Add something special</legend>
          <ul className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {extras.map((e) => {
              const n = qty[e.key] || 0;
              return (
                <li key={e.key} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="text-[15px] text-slate-900">{e.name}</p>
                    <p className="text-sm font-light text-slate-500">
                      {e.price !== null ? `${naira(e.price)} ${e.unit}` : "Price on request"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center rounded-full border border-slate-300">
                    <button type="button" onClick={() => change(e.key, -1)} disabled={!n} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30" aria-label={`One fewer ${e.name}`}>
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="w-7 text-center text-sm font-medium" aria-live="polite">{n}</span>
                    <button type="button" onClick={() => change(e.key, 1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100" aria-label={`Add ${e.name}`}>
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </fieldset>

        {/* 4. Details */}
        <fieldset>
          <legend className={step}>4 · A few details</legend>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-700">Preferred date</span>
              <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
            </label>
            <Stepper label="Guests" value={guests} min={1} max={30} onChange={setGuests} />
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm text-slate-700">Your name (optional)</span>
              <input value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} className={field} autoComplete="name" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm text-slate-700">Anything we should know? (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="A surprise, dietary needs, colours for the decoration…"
                className={field}
              />
            </label>
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl bg-blue-950 p-7 text-white sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">Your {occasion.toLowerCase()}</p>
          <h3 className="mt-3 font-cormorant text-3xl font-medium leading-tight">{baseLine.label}</h3>
          <ul className="mt-4 space-y-1.5 text-sm font-light text-white/75">
            {baseLine.detail.slice(0, 6).map((d) => (
              <li key={d} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {d}
              </li>
            ))}
            {baseLine.detail.length > 6 && <li className="pl-6">and {baseLine.detail.length - 6} more</li>}
          </ul>

          {chosen.length > 0 && (
            <ul className="mt-6 space-y-2 border-t border-white/15 pt-5 text-sm">
              {chosen.map((e) => (
                <li key={e.key} className="flex justify-between gap-4">
                  <span className="font-light text-white/85">
                    {e.name} × {qty[e.key]}
                  </span>
                  <span className="shrink-0">{e.price !== null ? naira(e.price * qty[e.key]) : "On request"}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 border-t border-white/15 pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-light text-white/75">Estimated total</span>
              <span className="font-cormorant text-4xl font-medium">{naira(total)}</span>
            </div>
            <p className="mt-2 text-xs font-light leading-relaxed text-white/60">
              {onRequestCount > 0 && `Plus ${onRequestCount} item${onRequestCount > 1 ? "s" : ""} priced on request. `}
              A guide only: our team confirms availability and the final price on WhatsApp.
            </p>
          </div>

          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { context: `celebration:${occasion.toLowerCase()}` })}
            className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-[#25D366]" />
            Send to Ziba on WhatsApp
            <Send className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm text-slate-700">{label}</span>
      <div className="flex h-[50px] items-center justify-between gap-3 rounded-2xl border border-slate-300 px-2">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30" aria-label={`Fewer ${label.toLowerCase()}`}>
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="min-w-8 text-center text-[15px] font-medium" aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30" aria-label={`More ${label.toLowerCase()}`}>
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
