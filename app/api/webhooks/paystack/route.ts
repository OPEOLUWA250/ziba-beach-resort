import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isValidWebhookSignature, type PaystackTransaction } from "@/lib/server/paystack";
import { confirmPaymentByReference } from "@/lib/server/payments";

export const dynamic = "force-dynamic";

/**
 * Paystack Webhook Handler
 * Receives payment confirmation events from Paystack for day-pass bookings
 * (and any legacy online room bookings). Verifies the HMAC signature over
 * the raw body.
 *
 * Retry semantics: Paystack retries non-2xx responses, so transient failures
 * return 500, while permanent ones (unknown reference, amount mismatch)
 * return 200 and are logged for staff instead of being retried forever.
 *
 * Webhook URL to configure in Paystack Dashboard:
 * https://ziba-beach-resort.vercel.app/api/webhooks/paystack
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("[Paystack Webhook] PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!isValidWebhookSignature(body, request.headers.get("x-paystack-signature"))) {
      console.error("[Paystack Webhook] Invalid or missing signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    if (event.event !== "charge.success") {
      return NextResponse.json({ success: true });
    }

    const data = event.data as PaystackTransaction;
    const eventKey = `${event.event}:${data.id ?? data.reference}`;

    if (await alreadyHandled(eventKey)) {
      return NextResponse.json({ success: true, message: "Duplicate event" });
    }

    const result = await confirmPaymentByReference(data.reference, data);
    console.log(`[Paystack Webhook] ${data.reference}: ${result.outcome}`);

    if (result.outcome === "error") {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    await markHandled(eventKey, data.reference, result.outcome);
    return NextResponse.json({ success: true, outcome: result.outcome });
  } catch (error: any) {
    console.error("[Paystack Webhook] Error:", error?.message);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// Event dedupe log (paystack_events table, created by the hardening
// migration). Processing is idempotent regardless; this just short-circuits
// redeliveries. If the table does not exist yet, dedupe is skipped.
async function alreadyHandled(eventKey: string) {
  const { data, error } = await supabaseServer
    .from("paystack_events")
    .select("event_key")
    .eq("event_key", eventKey)
    .maybeSingle();
  return !error && Boolean(data);
}

async function markHandled(eventKey: string, reference: string, outcome: string) {
  const { error } = await supabaseServer
    .from("paystack_events")
    .upsert({ event_key: eventKey, reference, outcome }, { onConflict: "event_key" });
  if (error && error.code !== "42P01") {
    console.warn("[Paystack Webhook] Could not record event:", error.message);
  }
}
