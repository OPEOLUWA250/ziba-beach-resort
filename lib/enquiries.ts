import { z } from "zod";

/** Shared by the events and gift forms (browser) and /api/enquiries (server). */

export const EVENT_TYPES = [
  "Wedding",
  "Team bonding",
  "Corporate retreat",
  "Conference",
  "Birthday or celebration",
  "Photo or video shoot",
  "Other",
] as const;

const phone = z.string().trim().regex(/^[+0-9()\-\s]{7,20}$/, "Enter a phone number we can call");
const email = z.string().trim().toLowerCase().email("Enter a valid email").max(254);
const name = z.string().trim().min(2, "Enter your name").max(80);
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
  .refine((d) => d >= new Date(Date.now() - 86_400_000).toISOString().slice(0, 10), "Choose a date from today");

export const eventEnquirySchema = z.object({
  kind: z.literal("event"),
  eventType: z.enum(EVENT_TYPES),
  date: isoDate,
  flexibleDates: z.boolean().default(false),
  guests: z.number().int().min(1).max(2000),
  overnight: z.boolean().default(false),
  name,
  email,
  phone,
  organisation: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});

export const giftEnquirySchema = z.object({
  kind: z.literal("gift"),
  adults: z.number().int().min(0).max(50),
  teens: z.number().int().min(0).max(50),
  kids: z.number().int().min(0).max(50),
  plus: z.boolean().default(false),
  recipientName: z.string().trim().min(2, "Enter their name").max(80),
  giftMessage: z.string().trim().max(400).optional().default(""),
  deliverBy: z.enum(["email-me", "email-them", "collect"]),
  recipientEmail: z.string().trim().toLowerCase().email().max(254).optional().or(z.literal("")),
  sendDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  name,
  email,
  phone,
});

export const enquirySchema = z.discriminatedUnion("kind", [eventEnquirySchema, giftEnquirySchema]);
export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

/** Plain-text summary: the email body and the WhatsApp message use the same words. */
export function enquirySummary(e: Enquiry): { subject: string; lines: [string, string][] } {
  if (e.kind === "event") {
    return {
      subject: `Event enquiry: ${e.eventType}, ${e.guests} guests, ${longDate(e.date)}`,
      lines: [
        ["Event", e.eventType],
        ["Date", `${longDate(e.date)}${e.flexibleDates ? " (flexible)" : ""}`],
        ["Guests", String(e.guests)],
        ["Overnight rooms", e.overnight ? "Yes, we'd like rooms" : "Not needed"],
        ["Name", e.name],
        ["Organisation", e.organisation || "-"],
        ["Email", e.email],
        ["Phone", e.phone],
        ["Message", e.message || "-"],
      ],
    };
  }
  const tickets = [
    e.adults && `${e.adults} adult`,
    e.teens && `${e.teens} teen`,
    e.kids && `${e.kids} kids`,
  ].filter(Boolean).join(", ");
  const delivery =
    e.deliverBy === "email-them"
      ? `Email the voucher to ${e.recipientEmail || "(no address given)"}${e.sendDate ? ` on ${longDate(e.sendDate)}` : ""}`
      : e.deliverBy === "email-me"
        ? "Email the voucher to me to pass on"
        : "I'll collect a printed voucher";
  return {
    subject: `Gift voucher request: ${tickets} for ${e.recipientName}`,
    lines: [
      ["Tickets", `${tickets}${e.plus ? " (Plus: with a meal and drink)" : ""}`],
      ["For", e.recipientName],
      ["Gift message", e.giftMessage || "-"],
      ["Delivery", delivery],
      ["From", e.name],
      ["Email", e.email],
      ["Phone", e.phone],
    ],
  };
}

export function enquiryWhatsAppText(e: Enquiry) {
  const { subject, lines } = enquirySummary(e);
  return [`Hello Ziba, ${subject.charAt(0).toLowerCase()}${subject.slice(1)}.`, "", ...lines.map(([k, v]) => `${k}: ${v}`)].join("\n");
}
