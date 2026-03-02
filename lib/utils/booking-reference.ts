/**
 * Generate a unique booking reference code
 * Format: ZB-2026-XXXXX (where XXXXX is a random 5-digit number)
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `ZB-${year}-${randomNum}`;
}

/**
 * Validate booking reference format
 */
export function isValidBookingReference(ref: string): boolean {
  return /^ZB-\d{4}-\d{5}$/.test(ref);
}
