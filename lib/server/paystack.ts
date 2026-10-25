import crypto from "crypto";
import { fetchWithTimeout, RetryableError, withRetry } from "@/lib/server/http";

const PAYSTACK_API_BASE = "https://api.paystack.co";

export interface PaystackTransaction {
  id?: number;
  status: string;
  reference: string;
  amount: number; // kobo
  currency?: string;
  paid_at?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type VerifyResult =
  | { ok: true; transaction: PaystackTransaction }
  | { ok: false; status: string; message: string };

// Statuses Paystack reports while a charge is still settling.
const IN_FLIGHT_STATUSES = new Set(["ongoing", "pending", "processing", "queued"]);

function getSecret() {
  return process.env.PAYSTACK_SECRET_KEY || "";
}

export function isPaystackConfigured() {
  return Boolean(getSecret());
}

/**
 * Local development without a Paystack secret runs in "demo mode" where
 * payments are accepted unverified. Never allowed in production.
 */
export function allowUnverifiedPayments() {
  return !isPaystackConfigured() && process.env.NODE_ENV !== "production";
}

export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const secret = getSecret();
  if (!secret) {
    return { ok: false, status: "unconfigured", message: "PAYSTACK_SECRET_KEY not configured" };
  }

  try {
    return await withRetry(
      async () => {
        const res = await fetchWithTimeout(
          `${PAYSTACK_API_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
          { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
        );

        if (res.status === 429 || res.status >= 500) {
          throw new RetryableError(`Paystack responded ${res.status}`);
        }

        const body = await res.json();
        if (!res.ok || !body?.status || !body?.data) {
          return {
            ok: false as const,
            status: body?.data?.status || "not_found",
            message: body?.message || "Verification failed",
          };
        }

        const tx = body.data as PaystackTransaction;
        if (IN_FLIGHT_STATUSES.has(tx.status)) {
          throw new RetryableError(`Transaction still ${tx.status}`);
        }
        if (tx.status !== "success") {
          return { ok: false as const, status: tx.status, message: `Payment ${tx.status}` };
        }
        return { ok: true as const, transaction: tx };
      },
      { retries: 3, baseDelayMs: 500, maxDelayMs: 4000 },
    );
  } catch (error) {
    return {
      ok: false,
      status: "unavailable",
      message: error instanceof Error ? error.message : "Paystack unavailable",
    };
  }
}

export async function initializeTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<{ authorization_url: string; access_code: string } | null> {
  const secret = getSecret();
  if (!secret) return null;

  try {
    const res = await fetchWithTimeout(`${PAYSTACK_API_BASE}/transaction/initialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountKobo,
        reference: input.reference,
        metadata: input.metadata,
      }),
    });
    const body = await res.json();
    if (!res.ok || !body?.status) {
      console.error("[Paystack] initialize failed:", body?.message);
      return null;
    }
    return body.data;
  } catch (error) {
    console.error("[Paystack] initialize error:", error);
    return null;
  }
}

export function isValidWebhookSignature(rawBody: string, signature: string | null) {
  const secret = getSecret();
  if (!secret || !signature) return false;

  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
