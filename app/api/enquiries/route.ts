import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";
import { BodyTooLargeError, readJsonBody, trippedHoneypot } from "@/lib/server/body";
import { enquirySchema, enquirySummary } from "@/lib/enquiries";
import { RESORT } from "@/lib/site";

export const dynamic = "force-dynamic";

const FROM = "Ziba Beach Resort <bookings@zibabeachresort.com>";
const TO = process.env.ENQUIRIES_EMAIL || RESORT.email;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Event and gift-voucher enquiries from /events and /gift. Sends the team an
 * email they can reply to directly; nothing is stored. If email isn't set up,
 * answers 503 so the form can offer WhatsApp instead.
 */
export async function POST(request: NextRequest) {
  const rate = await rateLimitByIp(request.headers, "api:enquiries", 5, 10 * 60_000);
  if (!rate.allowed) return tooManyRequests(rate, "Too many enquiries. Please try again shortly.");

  let body: unknown;
  try {
    body = await readJsonBody(request, 8 * 1024);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json({ error: "That's a bit long. Please shorten your message." }, { status: 413 });
    }
    throw error;
  }
  // Bots that fill the hidden box get the same answer as a successful send.
  if (trippedHoneypot(body)) return NextResponse.json({ ok: true });

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email isn't available right now.", fallback: "whatsapp" }, { status: 503 });
  }

  const enquiry = parsed.data;
  const { subject, lines } = enquirySummary(enquiry);
  const rows = lines
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#64748b;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:8px 0;color:#0f172a;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: enquiry.email,
      subject,
      text: `${subject}\n\n${lines.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nReply to this email to answer ${enquiry.name}.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px"><h2 style="color:#172554;font-weight:500">${escapeHtml(subject)}</h2><table style="border-collapse:collapse;font-size:14px">${rows}</table><p style="color:#64748b;font-size:13px;margin-top:24px">Reply to this email to answer ${escapeHtml(enquiry.name)} directly.</p></div>`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[enquiries] send failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "We couldn't send that just now.", fallback: "whatsapp" }, { status: 502 });
  }
}
