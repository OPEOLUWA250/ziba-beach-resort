/**
 * The visitor's address, for rate limits and the audit log.
 *
 * Anyone can send X-Forwarded-For or X-Real-IP, so these only count on
 * Vercel, which replaces them with the real address. Anywhere else (local
 * copies, another host) every visitor shares one bucket, so limits stay strict
 * instead of being dodged by inventing a new address per request.
 */
export function clientIp(headers: Headers): string {
  if (!process.env.VERCEL) return "direct";
  const first = (name: string) => headers.get(name)?.split(",")[0]?.trim();
  return (
    first("x-vercel-forwarded-for") ||
    first("x-real-ip") ||
    first("x-forwarded-for") ||
    "unknown"
  );
}
