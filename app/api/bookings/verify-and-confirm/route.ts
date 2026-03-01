import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side payment verification endpoint
 * Verifies payment with Paystack and updates booking status if successful
 * Used when user lands on /booking-confirmation page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      console.error("[Verify And Confirm] Missing bookingId");
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    console.log(`[Verify And Confirm] Verifying booking ${bookingId}...`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[Verify And Confirm] Missing Supabase config");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get the booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("[Verify And Confirm] Booking not found:", bookingError);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // If already completed, return early
    if (booking.payment_status === "COMPLETED") {
      console.log("[Verify And Confirm] Booking already completed");
      return NextResponse.json({
        success: true,
        message: "Booking already confirmed",
        booking,
      });
    }

    // If no paystack reference, can't verify
    if (!booking.paystack_reference) {
      console.error("[Verify And Confirm] No paystack reference found");
      return NextResponse.json(
        { error: "No payment reference found" },
        { status: 400 },
      );
    }

    // Verify with Paystack
    console.log(
      `[Verify And Confirm] Verifying payment with Paystack for reference: ${booking.paystack_reference}`,
    );

    if (!paystackSecretKey) {
      console.error("[Verify And Confirm] PAYSTACK_SECRET_KEY is missing");
      return NextResponse.json(
        { error: "Payment verification not available" },
        { status: 500 },
      );
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${booking.paystack_reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      },
    );

    const paystackData = await verifyRes.json();

    console.log("[Verify And Confirm] Paystack response:", {
      status: paystackData.status,
      transactionStatus: paystackData.data?.status,
      reference: paystackData.data?.reference,
    });

    if (!paystackData.status || paystackData.data?.status !== "success") {
      console.error(
        "[Verify And Confirm] Payment not successful on Paystack:",
        paystackData.data?.status,
      );
      return NextResponse.json(
        {
          success: false,
          message: "Payment not yet confirmed",
          booking,
        },
        { status: 200 },
      );
    }

    // Payment is successful - update database
    console.log("[Verify And Confirm] Payment verified! Updating database...");

    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: "COMPLETED",
        paid_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (updateError) {
      console.error("[Verify And Confirm] Database update error:", updateError);
      return NextResponse.json(
        { error: `Failed to update booking: ${updateError.message}` },
        { status: 500 },
      );
    }

    console.log(
      "[Verify And Confirm] ✅ SUCCESS - Booking updated:",
      updatedBooking,
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified and booking confirmed",
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("[Verify And Confirm] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 },
    );
  }
}
