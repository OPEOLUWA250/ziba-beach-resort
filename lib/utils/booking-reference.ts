import crypto from "crypto";

/**
 * Generate a booking reference code
 * Format: ZB-2026-XXXXX (where XXXXX is a random 5-digit number)
 *
 * The space is small, so it is not unique on its own: callers rely on the
 * UNIQUE index on booking_reference_code and retry on conflict (23505).
 */
export function generateRoomBookingReference(): string {
  const year = new Date().getFullYear();
  const randomNum = crypto.randomInt(0, 100000).toString().padStart(5, "0");
  return `ZB-${year}-${randomNum}`;
}

/** Format: ZB-DP-<timestamp>-<4 random chars>; collision-free in practice. */
export function generateDayPassReference(): string {
  return `ZB-DP-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

/**
 * Paystack transaction reference. It doubles as the capability that lets a
 * guest view their booking, so it must be unguessable (128 bits).
 */
export function generatePaymentReference(prefix: "ziba" | "dp" | "HM"): string {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(16).toString("hex")}`;
}

/**
 * Validate booking reference format
 */
export function isValidBookingReference(ref: string): boolean {
  return /^ZB-\d{4}-\d{5}$/.test(ref);
}
