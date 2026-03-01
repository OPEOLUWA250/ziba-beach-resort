#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

const PAYSTACK_SECRET = "sk_test_09a0b8dd608b54f21ebe3f06620bb2819b508c6a";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyPaystackPayment(reference) {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      },
    );

    const data = await response.json();

    if (!data.status) {
      console.log(`   ⚠️  Error: ${data.message}`);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error(`   ❌ Fetch error:`, error.message);
    return null;
  }
}

async function updateBookingStatus(bookingId, reference, status) {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({
        payment_status: status,
        paid_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (error) {
      console.log(`   ❌ Database error: ${error.message}`);
      return false;
    }

    console.log(`   ✅ Updated to: ${status}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🔍 Verifying pending payments with Paystack...\n");

  // Get all pending bookings
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, paystack_reference, payment_status, total_amount_ngn")
    .eq("payment_status", "PENDING")
    .not("paystack_reference", "is", null);

  if (error) {
    console.error("❌ Failed to fetch bookings:", error.message);
    process.exit(1);
  }

  if (!bookings || bookings.length === 0) {
    console.log("✅ No pending bookings found!");
    process.exit(0);
  }

  console.log(`Found ${bookings.length} pending booking(s):\n`);

  let updated = 0;
  let failed = 0;

  for (const booking of bookings) {
    console.log(
      `📌 Booking: ${booking.id} | Reference: ${booking.paystack_reference}`,
    );

    const transaction = await verifyPaystackPayment(booking.paystack_reference);

    if (!transaction) {
      console.log(`   ⏳ Status unknown - skipping update\n`);
      failed++;
      continue;
    }

    if (transaction.status === "success") {
      console.log(
        `   💰 Paystack status: SUCCESS (Amount: ₦${transaction.amount / 100})`,
      );
      const updated_local = await updateBookingStatus(
        booking.id,
        booking.paystack_reference,
        "COMPLETED",
      );
      if (updated_local) updated++;
    } else if (transaction.status === "abandoned") {
      console.log(`   ⏸️  Paystack status: ABANDONED`);
      console.log(`   ⏭️  Keeping as PENDING\n`);
      failed++;
    } else {
      console.log(`   ❌ Paystack status: ${transaction.status.toUpperCase()}`);
      const updated_local = await updateBookingStatus(
        booking.id,
        booking.paystack_reference,
        "FAILED",
      );
      if (updated_local) updated++;
    }
    console.log("");
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Updated: ${updated} booking(s)`);
  console.log(`⏳ Skipped: ${failed} booking(s)`);
  console.log("=".repeat(50));

  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
