import crypto from "crypto";
import type { NextRequest } from "next/server";
import { getSessionAdmin } from "@/lib/admin-auth";

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * A guest may view a booking by ID only when they also present its Paystack
 * reference (`?ref=`), which is long and random and is already part of every
 * confirmation URL. Admins can view any booking.
 */
export async function canViewBooking(
  request: NextRequest,
  booking: { paystack_reference?: string | null },
) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && booking.paystack_reference && safeEqual(ref, booking.paystack_reference)) {
    return true;
  }
  return Boolean(await getSessionAdmin(request));
}
