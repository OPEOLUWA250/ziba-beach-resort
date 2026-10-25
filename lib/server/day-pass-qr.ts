import QRCode from "qrcode";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isBookingId(value: string | null | undefined): value is string {
  return Boolean(value && UUID_RE.test(value));
}

/**
 * Public base URL of this app, for links in emails and QR codes. Prefers
 * NEXT_PUBLIC_APP_URL, but never a localhost value on a Vercel deployment,
 * then Vercel's own production domain for the project.
 */
export function appUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  const onVercel = Boolean(process.env.VERCEL);
  if (configured && !(onVercel && /localhost|127\.0\.0\.1/.test(configured))) {
    return configured.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://zibabeachresort.com";
}

/**
 * The QR code on a day pass is a link to the staff check-in page for that
 * booking, so gate staff can scan it with any phone camera. The booking id
 * is a random UUID (unguessable), and the page itself requires an admin
 * session, so the code carries no secret beyond identifying the booking.
 */
export function checkInUrl(bookingId: string) {
  return `${appUrl()}/admin/check-in/${bookingId}`;
}

/** Hosted PNG for emails (most clients block inline data: images). */
export function qrImageUrl(bookingId: string) {
  return `${appUrl()}/api/day-pass/${bookingId}/qr`;
}

export function renderCheckInQr(bookingId: string): Promise<Buffer> {
  return QRCode.toBuffer(checkInUrl(bookingId), {
    type: "png",
    width: 360,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}
