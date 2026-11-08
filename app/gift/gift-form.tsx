"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Gift, Loader2 } from "lucide-react";
import { enquiryWhatsAppText, giftEnquirySchema } from "@/lib/enquiries";
import { whatsappLink } from "@/lib/booking-links";
import { track } from "@/lib/analytics";
import { Counter, Field, Honeypot, SentPanel, WhatsAppFallback, fieldClass } from "@/components/enquiry-form-parts";

interface Ticket {
  name: string;
  price_per_person: number;
}

type Errors = Partial<Record<string, string>>;

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

/** Ticket prices by age group, from the day-pass products in our database. */
function pickPrices(rows: Ticket[], plus: boolean) {
  const find = (re: RegExp) =>
    rows.find((r) => re.test(r.name) && /ticket/i.test(r.name) && /plus/i.test(r.name) === plus)
      ?.price_per_person ?? null;
  return { adults: find(/adult/i), teens: find(/teen/i), kids: find(/kid/i) };
}

export default function GiftForm() {
  const [rows, setRows] = useState<Ticket[] | null>(null);
  const [form, setForm] = useState({
    adults: 2,
    teens: 0,
    kids: 0,
    plus: false,
    recipientName: "",
    giftMessage: "",
    deliverBy: "email-me" as "email-me" | "email-them" | "collect",
    recipientEmail: "",
    sendDate: "",
    name: "",
    email: "",
    phone: "",
  });
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback" | "error">("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/day-pass/experiences")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => !cancelled && setRows([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const prices = useMemo(() => (rows ? pickPrices(rows, form.plus) : null), [rows, form.plus]);
  const total =
    prices && prices.adults !== null
      ? form.adults * (prices.adults ?? 0) + form.teens * (prices.teens ?? 0) + form.kids * (prices.kids ?? 0)
      : null;
  const ticketCount = form.adults + form.teens + form.kids;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const payload = { kind: "gift" as const, ...form };
  const forWhatsApp = giftEnquirySchema.safeParse(payload);
  const whatsappHref = forWhatsApp.success
    ? whatsappLink(enquiryWhatsAppText(forWhatsApp.data))
    : whatsappLink("Hello Ziba, I'd like to buy a day-pass gift voucher.");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketCount) {
      setErrors({ adults: "Add at least one ticket" });
      return;
    }
    const parsed = giftEnquirySchema.safeParse(payload);
    if (!parsed.success || (form.deliverBy === "email-them" && !form.recipientEmail)) {
      const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
      setErrors({
        ...Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])),
        ...(form.deliverBy === "email-them" && !form.recipientEmail ? { recipientEmail: "Enter their email" } : {}),
      });
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, company_website: trap }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return setStatus("sent");
      if (data?.fallback === "whatsapp") return setStatus("fallback");
      setServerError(data?.error || "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setStatus("fallback");
    }
  }

  if (status === "sent") {
    return (
      <SentPanel title="Your gift request is on its way">
        We&apos;ll email {form.email} shortly with payment details. Once paid, we&apos;ll send the voucher for {form.recipientName}.
      </SentPanel>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const tierButton = (plus: boolean, title: string, text: string) => (
    <button
      type="button"
      onClick={() => set("plus", plus)}
      aria-pressed={form.plus === plus}
      className={`rounded-3xl border p-5 text-left transition ${
        form.plus === plus ? "border-blue-950 bg-blue-50/50" : "border-slate-200 hover:border-slate-400"
      }`}
    >
      <span className="block font-medium text-slate-900">{title}</span>
      <span className="mt-1 block text-sm font-light text-slate-600">{text}</span>
    </button>
  );

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
      <Honeypot value={trap} onChange={setTrap} />
      <div className="space-y-10">
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-700">1 · The gift</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {tierButton(false, "Day pass", "The pools, beach and facilities, 10am–6pm")}
            {tierButton(true, "Day pass Plus", "Everything, plus a meal and a drink")}
          </div>
          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            <Counter label="Adults (18+)" value={form.adults} onChange={(n) => set("adults", n)} note={prices?.adults ? `${naira(prices.adults)} each` : undefined} />
            <Counter label="Teens (13–17)" value={form.teens} onChange={(n) => set("teens", n)} note={prices?.teens ? `${naira(prices.teens)} each` : undefined} />
            <Counter label="Kids (3–12)" value={form.kids} onChange={(n) => set("kids", n)} note={prices?.kids ? `${naira(prices.kids)} each` : undefined} />
          </div>
          {errors.adults && <p className="mt-2 text-xs text-rose-600">{errors.adults}</p>}
        </section>

        <section className="space-y-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-700">2 · Who it&apos;s for</h2>
          <Field label="Their name" error={errors.recipientName}>
            <input value={form.recipientName} onChange={(e) => set("recipientName", e.target.value)} className={fieldClass} aria-invalid={!!errors.recipientName} />
          </Field>
          <Field label="Your message (optional)" hint={`${400 - form.giftMessage.length} characters left`}>
            <textarea rows={3} value={form.giftMessage} onChange={(e) => set("giftMessage", e.target.value.slice(0, 400))} placeholder="Happy birthday! Enjoy a day by the sea on us." className={fieldClass} />
          </Field>
          <fieldset>
            <legend className="mb-3 text-sm text-slate-700">How should we send the voucher?</legend>
            <div className="space-y-2">
              {(
                [
                  ["email-me", "Email it to me to pass on"],
                  ["email-them", "Email it to them"],
                  ["collect", "I'll collect a printed voucher at the resort"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 text-[15px] text-slate-700">
                  <input type="radio" name="deliverBy" value={value} checked={form.deliverBy === value} onChange={() => set("deliverBy", value)} className="h-5 w-5 accent-blue-950" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          {form.deliverBy === "email-them" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Their email" error={errors.recipientEmail}>
                <input type="email" value={form.recipientEmail} onChange={(e) => set("recipientEmail", e.target.value)} className={fieldClass} aria-invalid={!!errors.recipientEmail} />
              </Field>
              <Field label="Send it on (optional)" hint="Leave empty to send as soon as it's paid">
                <input type="date" min={today} value={form.sendDate} onChange={(e) => set("sendDate", e.target.value)} className={fieldClass} />
              </Field>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-700">3 · Your details</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Your name" error={errors.name} className="sm:col-span-2">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={fieldClass} aria-invalid={!!errors.name} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={fieldClass} aria-invalid={!!errors.email} />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+234" className={fieldClass} aria-invalid={!!errors.phone} />
            </Field>
          </div>
        </section>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl bg-blue-950 p-7 text-white sm:p-8">
          <Gift className="h-8 w-8 text-white/80" strokeWidth={1.25} aria-hidden="true" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">Gift voucher</p>
          <h3 className="mt-2 font-cormorant text-3xl font-medium leading-tight">
            {form.recipientName ? `A day at Ziba for ${form.recipientName}` : "A day at Ziba"}
          </h3>
          <p className="mt-3 text-sm font-light text-white/75">
            {ticketCount} {form.plus ? "Day pass Plus" : "day pass"} {ticketCount === 1 ? "ticket" : "tickets"}
          </p>
          {form.giftMessage && <p className="mt-4 border-l-2 border-white/30 pl-3 text-sm font-light italic text-white/85">“{form.giftMessage}”</p>}
          <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-white/15 pt-5">
            <span className="text-sm font-light text-white/75">Total</span>
            <span className="font-cormorant text-4xl font-medium">{total !== null ? naira(total) : rows ? "On request" : "…"}</span>
          </div>
          <p className="mt-2 text-xs font-light leading-relaxed text-white/60">
            Based on today&apos;s ticket prices. We&apos;ll confirm and send payment details by email; the voucher follows once it&apos;s paid.
          </p>

          {status === "error" && serverError && <p className="mt-4 text-sm text-rose-200">{serverError}</p>}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-950 transition hover:bg-blue-50 disabled:opacity-60"
          >
            {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Request this gift
            {status !== "sending" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { context: "gift" })}
            className="mt-3 block text-center text-sm font-light text-white/80 underline-offset-4 hover:underline"
          >
            Or arrange it on WhatsApp
          </a>
        </div>
        {status === "fallback" && (
          <div className="mt-4">
            <WhatsAppFallback href={whatsappHref} onClick={() => track("whatsapp_click", { context: "gift_fallback" })} />
          </div>
        )}
      </aside>
    </form>
  );
}
