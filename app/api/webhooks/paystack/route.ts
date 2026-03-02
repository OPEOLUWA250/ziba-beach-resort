import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * Paystack Webhook Handler
 * Receives payment confirmation events from Paystack
 * Verifies HMAC signature and updates booking status
 *
 * Webhook URL to configure in Paystack Dashboard:
 * https://ziba-beach-resort.vercel.app/api/webhooks/paystack
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    console.log("[Paystack Webhook] Received event");

    if (!signature) {
      console.error("[Paystack Webhook] ❌ Missing signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error("[Paystack Webhook] ❌ PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error(
        "[Paystack Webhook] ❌ Invalid signature - NOT from Paystack!",
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log(
      "[Paystack Webhook] ✅ Signature verified - genuine Paystack event",
    );

    // Parse event
    const event = JSON.parse(body);
    console.log("[Paystack Webhook] Event type:", event.event);

    // Handle different event types
    if (event.event === "charge.success") {
      return await handleChargeSuccess(event.data);
    }

    if (event.event === "charge.failed") {
      console.log("[Paystack Webhook] Charge failed event");
      return NextResponse.json({ success: true });
    }

    console.log("[Paystack Webhook] Unhandled event type, returning success");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Paystack Webhook] Error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handleChargeSuccess(data: any) {
  try {
    const reference = data.reference;
    const amount = data.amount; // in kobo

    console.log(
      `[Paystack Webhook] ✅ Processing successful charge: ${reference}`,
    );

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[Paystack Webhook] ❌ Missing Supabase configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Find booking by paystack_reference
    console.log(
      `[Paystack Webhook] Searching for booking with reference: ${reference}`,
    );
    const { data: bookings, error: searchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("paystack_reference", reference)
      .limit(1);

    if (searchError) {
      console.error("[Paystack Webhook] Search error:", searchError);
      return NextResponse.json(
        { error: "Database search error" },
        { status: 500 },
      );
    }

    if (!bookings || bookings.length === 0) {
      console.warn(
        `[Paystack Webhook] ⚠️ No booking found for reference: ${reference}`,
      );
      return NextResponse.json({
        success: true,
        message: "Booking not found (may be from another system)",
      });
    }

    const booking = bookings[0];
    console.log(`[Paystack Webhook] Found booking: ${booking.id}`);

    // Check if already completed
    if (booking.payment_status === "COMPLETED") {
      console.log(`[Paystack Webhook] Booking already completed, skipping`);
      return NextResponse.json({
        success: true,
        message: "Booking already confirmed",
      });
    }

    // Update booking status
    console.log(
      `[Paystack Webhook] Updating booking ${booking.id} to COMPLETED`,
    );
    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: "COMPLETED",
        paid_at: new Date().toISOString(),
      })
      .eq("id", booking.id)
      .select()
      .single();

    if (updateError) {
      console.error(
        "[Paystack Webhook] ❌ Database update error:",
        updateError,
      );
      return NextResponse.json(
        { error: `Database error: ${updateError.message}` },
        { status: 500 },
      );
    }

    console.log(
      `[Paystack Webhook] ✅ SUCCESS - Booking ${booking.id} updated to COMPLETED`,
    );

    return NextResponse.json({
      success: true,
      message: "Payment confirmed",
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error("[Paystack Webhook] Error handling charge success:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
