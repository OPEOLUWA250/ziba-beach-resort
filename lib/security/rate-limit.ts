import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/server/http";

/**
 * Fixed-window rate limiter.
 *
 * With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set, counters live in
 * Redis and are shared by every serverless instance. Without them (local dev),
 * or if Redis is unreachable, it falls back to a per-instance in-memory map.
 */

type Entry = { count: number; resetAt: number };
type RateResult = { allowed: boolean; retryAfterSeconds: number };

const MAX_MEMORY_KEYS = 5000;
const store = new Map<string, Entry>();

function getClientIp(headers: Headers): string {
  // Vercel sets x-real-ip / x-forwarded-for itself, overwriting client values.
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

function pruneMemory(now: number) {
  if (store.size < MAX_MEMORY_KEYS) return;
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
  // Still too big (all live): drop oldest insertions.
  while (store.size >= MAX_MEMORY_KEYS) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

function memoryLimit(bucketKey: string, maxRequests: number, windowMs: number): RateResult {
  const now = Date.now();
  pruneMemory(now);
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
  return { allowed: true, retryAfterSeconds: 0 };
}

async function redisLimit(
  bucketKey: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetchWithTimeout(
      `${url}/pipeline`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", bucketKey],
          ["PEXPIRE", bucketKey, String(windowMs), "NX"],
          ["PTTL", bucketKey],
        ]),
      },
      1500,
    );
    if (!res.ok) return null;

    const [incr, , pttl] = (await res.json()) as { result: number }[];
    const count = Number(incr?.result ?? 0);
    const ttlMs = Math.max(0, Number(pttl?.result ?? windowMs));

    return count > maxRequests
      ? { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)) }
      : { allowed: true, retryAfterSeconds: 0 };
  } catch {
    return null;
  }
}

export async function rateLimitByIp(
  headers: Headers,
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateResult> {
  const bucketKey = `ratelimit:${key}:${getClientIp(headers)}`;
  return (
    (await redisLimit(bucketKey, maxRequests, windowMs)) ??
    memoryLimit(bucketKey, maxRequests, windowMs)
  );
}

export function tooManyRequests(rate: RateResult, message = "Too many requests. Please retry shortly.") {
  return NextResponse.json(
    { error: message },
    { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
  );
}
