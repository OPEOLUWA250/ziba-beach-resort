"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { EVENT_TYPES, enquiryWhatsAppText, eventEnquirySchema } from "@/lib/enquiries";
import { whatsappLink } from "@/lib/booking-links";
import { track } from "@/lib/analytics";
import { Counter, Field, Honeypot, SentPanel, WhatsAppFallback, fieldClass } from "@/components/enquiry-form-parts";

type Errors = Partial<Record<string, string>>;

export default function EventsForm({ initialType }: { initialType?: string }) {
  const [form, setForm] = useState({
    eventType: (EVENT_TYPES as readonly string[]).includes(initialType || "") ? (initialType as string) : "Wedding",
    date: "",
    flexibleDates: false,
    guests: 30,
    overnight: false,
    name: "",
    email: "",
    phone: "",
    organisation: "",
    message: "",
  });
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const payload = { kind: "event" as const, ...form };
  const parsedForWhatsApp = eventEnquirySchema.safeParse(payload);
  const whatsappHref = parsedForWhatsApp.success ? whatsappLink(enquiryWhatsAppText(parsedForWhatsApp.data)) : whatsappLink("Hello Ziba, I'd like to plan an event at the resort.");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = eventEnquirySchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])));
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
      if (res.ok) {
        setStatus("sent");
        return;
      }
      if (data?.fallback === "whatsapp") {
        setStatus("fallback");
        return;
      }
      if (data?.fields) setErrors(Object.fromEntries(Object.entries(data.fields as Record<string, string[]>).map(([k, v]) => [k, v?.[0]])));
      setServerError(data?.error || "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setStatus("fallback");
    }
  }

  if (status === "sent") {
    return (
      <SentPanel title="Thank you, we'll be in touch">
        We&apos;ve received your {form.eventType.toLowerCase()} enquiry and will reply to {form.email} shortly, usually within one working day.
      </SentPanel>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} noValidate className="relative space-y-6">
      <Honeypot value={trap} onChange={setTrap} />

      <Field label="Type of event">
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("eventType", t)}
              aria-pressed={form.eventType === t}
              className={`rounded-full px-4 py-2 text-sm transition ${
                form.eventType === t ? "bg-blue-950 text-white" : "border border-slate-300 text-slate-700 hover:border-blue-950"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Date" error={errors.date}>
          <input type="date" min={today} value={form.date} onChange={(e) => set("date", e.target.value)} className={fieldClass} aria-invalid={!!errors.date} required />
        </Field>
        <Field label="Number of guests" error={errors.guests} hint="An estimate is fine">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={2000}
            value={form.guests}
            onChange={(e) => set("guests", Math.max(0, Math.floor(Number(e.target.value) || 0)))}
            className={fieldClass}
            aria-invalid={!!errors.guests}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
        <label className="flex items-center gap-3 text-[15px] text-slate-700">
          <input type="checkbox" checked={form.flexibleDates} onChange={(e) => set("flexibleDates", e.target.checked)} className="h-5 w-5 rounded accent-blue-950" />
          My dates are flexible
        </label>
        <label className="flex items-center gap-3 text-[15px] text-slate-700">
          <input type="checkbox" checked={form.overnight} onChange={(e) => set("overnight", e.target.checked)} className="h-5 w-5 rounded accent-blue-950" />
          We&apos;ll need rooms overnight
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={fieldClass} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Company or organisation (optional)">
          <input value={form.organisation} onChange={(e) => set("organisation", e.target.value)} autoComplete="organization" className={fieldClass} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={fieldClass} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+234" className={fieldClass} aria-invalid={!!errors.phone} />
        </Field>
      </div>

      <Field label="Tell us about your plans (optional)" error={errors.message}>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value.slice(0, 2000))}
          placeholder="Ceremony on the beach, a conference for 40 with lunch, a weekend retreat…"
          className={fieldClass}
        />
      </Field>

      {status === "fallback" && <WhatsAppFallback href={whatsappHref} onClick={() => track("whatsapp_click", { context: "events_fallback" })} />}
      {status === "error" && serverError && <p className="text-sm text-rose-600">{serverError}</p>}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Send enquiry
          {status !== "sending" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { context: "events" })}
          className="text-sm font-semibold text-blue-900 underline-offset-4 hover:underline"
        >
          Or message us on WhatsApp
        </a>
      </div>
    </form>
  );
}
