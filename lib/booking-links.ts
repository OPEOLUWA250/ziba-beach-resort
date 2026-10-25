/**
 * External booking and enquiry links.
 *
 * Room stays are booked on the resort's IPMS (eZee) booking engine, which is
 * the source of truth for room availability and rates across all channels.
 * Keep every room-booking CTA pointed at IPMS_BOOKING_URL so a change of URL
 * (or adding date/room deep-link parameters once IPMS confirms their names)
 * is a one-line edit.
 */
export const IPMS_BOOKING_URL =
  "https://live.ipms247.com/booking/book-rooms-zibaresort";

export const WHATSAPP_NUMBER = "2347047300013";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
