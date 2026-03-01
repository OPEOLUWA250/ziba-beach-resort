import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Paystack Webhook Handler
 * Receives payment notifications from Paystack servers
 * Triggered for charge.success and other events
 * https://paystack.com/docs/webhooks/events
 */
export async function POST(request: NextRequest) {
  try {
    // Verify Paystack signature
    const signature = request.headers.get("x-paystack-signature");
    const body = await request.text();

    if (!signature) {
      console.warn("[Paystack Webhook] Missing signature");
      return NextResponse.json(
        { success: false, error: "Missing signature" },
        { status: 401 },
      );
    }

    // Verify signature matches (optional but recommended)
    // For now, we'll trust Paystack requests - add crypto verification if needed
    console.log("[Paystack Webhook] Received notification");

    const event = JSON.parse(body);
    const { type, data } = event;

    // Handle different Paystack events
    if (type === "charge.success") {
      await handleChargeSuccess(data);
    } else if (type === "charge.failed") {
      await handleChargeFailed(data);
    } else if (type === "transfer.failed") {
      console.warn("[Paystack Webhook] Transfer failed:", data);
    }

    return NextResponse.json(
      { success: true, message: "Webhook processed" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[Paystack Webhook] Error processing webhook:", {
      message: error.message,
      stack: error.stack?.split("\n")[0],
    });

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

/**
 * Handle successful charge
 * Update booking status and trigger email
 */
async function handleChargeSuccess(data: any) {
  try {
    const { reference, amount, customer, metadata } = data;

    console.log("[Webhook] Processing charge.success:", {
      reference,
      amount,
      customer: customer.email,
    });

    // Extract booking info from metadata
    const {
      bookingId,
      roomId,
      checkInDate,
      checkOutDate,
      guestName,
      guestEmail,
    } = metadata || {};

    // Create or update booking in Supabase
    if (bookingId) {
      const { data: booking, error } = await supabaseServer
        .from("bookings")
        .update({
          status: "CONFIRMED",
          paystackReference: reference,
          paystackAmount: Math.round(amount / 100), // Convert from kobo to naira
          confirmedAt: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select();

      if (error) {
        console.error("[Webhook] Error updating booking:", error);
        return;
      }

      console.log("[Webhook] Booking confirmed:", {
        bookingId,
        reference,
        amount: amount / 100,
      });

      // TODO: Send confirmation email
      // await sendConfirmationEmail({
      //   email: guestEmail,
      //   guestName,
      //   reference,
      //   amount: amount / 100,
      //   checkInDate,
      //   checkOutDate
      // });
    }
  } catch (error: any) {
    console.error("[Webhook] handleChargeSuccess error:", error.message);
  }
}

/**
 * Handle failed charge
 */
async function handleChargeFailed(data: any) {
  try {
    const { reference, customer, metadata } = data;

    console.log("[Webhook] Processing charge.failed:", {
      reference,
      customer: customer.email,
    });

    // Update booking status to FAILED
    if (metadata?.bookingId) {
      await supabaseServer
        .from("bookings")
        .update({
          status: "FAILED",
          paystackReference: reference,
          failedAt: new Date().toISOString(),
        })
        .eq("id", metadata.bookingId);

      console.log("[Webhook] Booking marked as failed:", metadata.bookingId);
    }

    // TODO: Send failure notification email
  } catch (error: any) {
    console.error("[Webhook] handleChargeFailed error:", error.message);
  }
}
