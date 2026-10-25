import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabase/server";
import type { EmailResult } from "@/lib/server/booking-emails";
import { getGoogleReviews } from "@/lib/server/google-reviews";
import { appUrl, qrImageUrl } from "@/lib/server/day-pass-qr";
import { formatVisitDate } from "@/lib/utils/lagos-date";
import { whatsappLink } from "@/lib/booking-links";

export type DayPassEmailKind = "confirmation" | "reminder" | "review";

/** Paid (or admin-created) bookings that haven't been cancelled. */
export const EMAILABLE_DAY_PASS_STATUSES = ["PENDING", "CONFIRMED", "ACTIVATED", "COMPLETED"];

const SENT_AT_COLUMN: Record<DayPassEmailKind, string> = {
  confirmation: "confirmation_email_sent_at",
  reminder: "reminder_email_sent_at",
  review: "review_email_sent_at",
};

const FROM = "Ziba Beach Resort <bookings@zibabeachresort.com>";
const PHONE_DISPLAY = "+234 704 730 0013";
const PHONE_TEL = "+2347047300013";
const ADDRESS = "Ziba Beach Close, Okun Ajah, Lagos";
const HOURS = "10:00 AM – 6:00 PM";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Ziba Beach Resort, Okun Ajah, Lagos")}`;
const REVIEW_FALLBACK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Ziba Beach Resort Okun Ajah Lagos")}`;

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const naira = (amount: unknown) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;

function firstName(fullName: unknown) {
  return String(fullName || "").trim().split(/\s+/)[0] || "there";
}

/**
 * Send one of the day-pass guest emails.
 *
 * Idempotent per kind once the migration has added the `*_email_sent_at`
 * columns: the send is claimed (IS NULL -> now) before sending and released
 * on failure. Without the columns each email still goes out once, because
 * its triggers (the RESERVED -> PENDING payment transition, and the daily
 * job's "visit is tomorrow/yesterday" windows) each match a booking once.
 */
export async function sendDayPassEmail(
  kind: DayPassEmailKind,
  bookingId: string,
): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[Day-Pass Email] RESEND_API_KEY missing. Skipping ${kind} email.`);
    return { status: "skipped", message: "Email provider not configured" };
  }

  const { data: booking, error } = await supabaseServer
    .from("day_pass_bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !booking) return { status: "not_found" };
  if (!EMAILABLE_DAY_PASS_STATUSES.includes(booking.payment_status)) {
    return { status: "skipped", message: `Booking is ${booking.payment_status}` };
  }
  if (!booking.email) return { status: "skipped", message: "No guest email" };

  const column = SENT_AT_COLUMN[kind];
  const hasColumn = column in booking;
  let claimed = false;
  if (hasColumn) {
    if (booking[column]) return { status: "skipped", message: `${kind} already sent` };
    const claim = await supabaseServer
      .from("day_pass_bookings")
      .update({ [column]: new Date().toISOString() })
      .eq("id", bookingId)
      .is(column, null)
      .select("id");
    if (!claim.error && (!claim.data || claim.data.length === 0)) {
      return { status: "skipped", message: `${kind} already sent` };
    }
    claimed = !claim.error;
  }

  const releaseClaim = async () => {
    if (!claimed) return;
    await supabaseServer.from("day_pass_bookings").update({ [column]: null }).eq("id", bookingId);
  };

  const content =
    kind === "confirmation"
      ? confirmationEmail(booking)
      : kind === "reminder"
        ? reminderEmail(booking)
        : await reviewEmail(booking);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send({
      from: FROM,
      to: booking.email,
      subject: content.subject,
      html: content.html,
    });

    if (!response.data?.id) {
      await releaseClaim();
      console.error(`[Day-Pass Email] ${kind} provider error:`, response.error?.message);
      return { status: "failed", message: response.error?.message || "No message id returned" };
    }

    console.log(`[Day-Pass Email] Sent ${kind} for ${booking.reference_code}`);
    return { status: "sent", emailId: response.data.id, bookingReference: booking.reference_code };
  } catch (sendError: any) {
    await releaseClaim();
    console.error(`[Day-Pass Email] ${kind} send failed:`, sendError?.message);
    return { status: "failed", message: sendError?.message || "provider error" };
  }
}

// --- Templates ------------------------------------------------------------------
// Inline styles only: many email clients strip <style> blocks.

type Booking = Record<string, any>;

function receiptUrl(booking: Booking) {
  return `${appUrl()}/view-booking?ref=${encodeURIComponent(booking.reference_code)}&email=${encodeURIComponent(booking.email)}`;
}

function button(href: string, label: string, color = "#001a4d") {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${color};color:#ffffff;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">${escapeHtml(label)}</a>`;
}

function qrBlock(booking: Booking) {
  return `
    <div style="text-align:center;margin:24px 0;padding:20px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;">
      <img src="${escapeHtml(qrImageUrl(booking.id))}" width="200" height="200" alt="Check-in QR code for ${escapeHtml(booking.reference_code)}" style="display:block;margin:0 auto;width:200px;height:200px;" />
      <p style="margin:12px 0 4px;font-size:14px;font-weight:bold;color:#001a4d;">Show this QR code at the gate</p>
      <p style="margin:0;font-size:13px;color:#6b7280;">Reference: <span style="font-family:'Courier New',monospace;font-weight:bold;color:#111827;">${escapeHtml(booking.reference_code)}</span></p>
    </div>`;
}

function itemsTable(booking: Booking) {
  const items: Array<{ name: string; quantity: number; price: number }> = Array.isArray(booking.items)
    ? booking.items
    : [];
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#374151;font-size:14px;">${escapeHtml(item.name)} × ${Number(item.quantity) || 0}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#111827;font-size:14px;text-align:right;">${naira(Number(item.price) * Number(item.quantity))}</td>
        </tr>`,
    )
    .join("");
  const paid = booking.payment_type === "online";
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;">
      ${rows}
      <tr>
        <td style="padding:12px 0 0;font-weight:bold;color:#111827;font-size:15px;">Total${paid ? " (paid)" : ""}</td>
        <td style="padding:12px 0 0;font-weight:bold;color:#047857;font-size:17px;text-align:right;">${naira(booking.total_amount)}</td>
      </tr>
    </table>`;
}

function visitDetails(booking: Booking) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;background:#f0f6ff;border-radius:10px;">
      <tr><td style="padding:16px 18px;font-size:14px;color:#1f2937;line-height:1.7;">
        <strong>Date:</strong> ${escapeHtml(formatVisitDate(booking.visit_date))}<br />
        <strong>Hours:</strong> ${HOURS}<br />
        <strong>Address:</strong> ${ADDRESS} · <a href="${DIRECTIONS_URL}" style="color:#0057b8;">Get directions</a>
      </td></tr>
    </table>`;
}

function layout(opts: { preheader: string; heading: string; body: string }) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fb;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;">
          <tr><td style="background:#001a4d;padding:26px 28px;text-align:center;">
            <p style="margin:0;color:#9fb8e8;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Ziba Beach Resort</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:bold;">${escapeHtml(opts.heading)}</h1>
          </td></tr>
          <tr><td style="padding:26px 28px;color:#1f2937;font-size:15px;line-height:1.6;">
            ${opts.body}
            <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">Questions? Call or WhatsApp <a href="tel:${PHONE_TEL}" style="color:#001a4d;font-weight:bold;text-decoration:none;">${PHONE_DISPLAY}</a>.</p>
          </td></tr>
          <tr><td style="background:#f8fafc;padding:16px 28px;text-align:center;font-size:12px;color:#94a3b8;">
            Ziba Beach Resort · ${ADDRESS}<br />
            You're receiving this because you booked a day pass with us.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function confirmationEmail(booking: Booking) {
  const date = formatVisitDate(booking.visit_date);
  return {
    subject: `Your Ziba day pass for ${formatVisitDate(booking.visit_date, "short")} · ${booking.reference_code}`,
    html: layout({
      preheader: `You're booked for ${date}. Show the QR code at the gate.`,
      heading: "You're booked!",
      body: `
        <p style="margin:0 0 12px;">Hi ${escapeHtml(firstName(booking.full_name))},</p>
        <p style="margin:0 0 12px;">Thank you for booking a day pass at Ziba Beach Resort. Here are your booking details.</p>
        ${visitDetails(booking)}
        ${qrBlock(booking)}
        ${itemsTable(booking)}
        <p style="margin:0 0 6px;font-size:14px;color:#374151;">Please bring a valid ID for check-in. We'll send you a reminder the day before your visit.</p>
        <p style="text-align:center;margin:22px 0 0;">${button(receiptUrl(booking), "View & download receipt")}</p>`,
    }),
  };
}

function reminderEmail(booking: Booking) {
  return {
    subject: "See you tomorrow at Ziba Beach Resort",
    html: layout({
      preheader: `Your day pass is for tomorrow, ${formatVisitDate(booking.visit_date)}.`,
      heading: "See you tomorrow!",
      body: `
        <p style="margin:0 0 12px;">Hi ${escapeHtml(firstName(booking.full_name))},</p>
        <p style="margin:0 0 12px;">Just a reminder that your day at Ziba Beach Resort is tomorrow. We can't wait to welcome you.</p>
        ${visitDetails(booking)}
        ${qrBlock(booking)}
        <p style="margin:0 0 8px;font-weight:bold;color:#001a4d;">Before you leave home</p>
        <ul style="margin:0 0 8px;padding-left:20px;color:#374151;font-size:14px;">
          <li>A valid ID for check-in</li>
          <li>This QR code (or your reference number)</li>
          <li>Swimwear, sunscreen and a change of clothes</li>
        </ul>
        <p style="text-align:center;margin:22px 0 0;">${button(DIRECTIONS_URL, "Get directions")}</p>`,
    }),
  };
}

async function reviewEmail(booking: Booking) {
  const { writeReviewUrl } = await getGoogleReviews();
  const reviewUrl = writeReviewUrl || REVIEW_FALLBACK_URL;
  const feedbackUrl = whatsappLink(
    `Hi Ziba, feedback on my day pass visit (${booking.reference_code}): `,
  );
  return {
    subject: "Thank you for visiting Ziba Beach Resort",
    html: layout({
      preheader: "How was your day with us? It takes a minute to share.",
      heading: "Thank you for visiting",
      body: `
        <p style="margin:0 0 12px;">Hi ${escapeHtml(firstName(booking.full_name))},</p>
        <p style="margin:0 0 12px;">Thank you for spending ${escapeHtml(formatVisitDate(booking.visit_date))} with us. We hope you had a wonderful day by the water.</p>
        <p style="margin:0 0 12px;">Would you take a minute to tell others about your visit on Google? Honest reviews help other guests decide, and help us keep improving.</p>
        <p style="text-align:center;margin:22px 0;">${button(reviewUrl, "Leave a Google review", "#047857")}</p>
        <p style="margin:0;font-size:14px;color:#374151;">Anything we could have done better? <a href="${escapeHtml(feedbackUrl)}" style="color:#0057b8;">Message us on WhatsApp</a>. We read every message.</p>`,
    }),
  };
}
