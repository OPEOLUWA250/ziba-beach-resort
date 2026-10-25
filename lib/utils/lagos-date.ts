/**
 * The resort runs on Lagos time (WAT, UTC+1, no daylight saving). Day-pass
 * visit dates are stored as plain `YYYY-MM-DD` dates, so "today" and
 * "tomorrow" must be computed in Lagos, not in the server's UTC clock.
 */
export function lagosDate(offsetDays = 0, from: Date = new Date()): string {
  const shifted = new Date(from.getTime() + offsetDays * 86_400_000);
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(shifted);
}

/** First 10 chars of a date or timestamp string: the calendar date. */
export function toDateKey(value: string | null | undefined): string {
  return String(value ?? "").slice(0, 10);
}

/** "Monday, 26 October 2026" for a stored `YYYY-MM-DD` visit date. */
export function formatVisitDate(value: string | null | undefined, style: "long" | "short" = "long") {
  const key = toDateKey(value);
  // Noon UTC keeps the calendar day stable whatever the viewer's timezone.
  const date = new Date(`${key}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return key;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    ...(style === "long"
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : { weekday: "short", day: "numeric", month: "short" }),
  }).format(date);
}
