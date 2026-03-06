type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return headers.get("x-real-ip") || "unknown";
}

export function rateLimitByIp(
  headers: Headers,
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const ip = getClientIp(headers);
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;
  const current = store.get(bucketKey);

  if (!current || now >= current.resetAt) {
    store.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(bucketKey, current);
  return { allowed: true, retryAfterSeconds: 0 };
}
