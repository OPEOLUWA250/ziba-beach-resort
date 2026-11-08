const { createClient } = require("@supabase/supabase-js");

// Never paste keys here: this file is in a public repository. Run with the
// values from .env.local, e.g. node --env-file=.env.local scripts/check-booking-status.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.local).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBookings() {
  console.log("🔍 Checking recent bookings in Supabase...\n");

  // Get recent bookings (last 20) - using only columns we know exist
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, guest_name, payment_status, total_amount_ngn, created_at, paystack_reference, booking_reference_code",
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("❌ Error fetching bookings:", error);
    return;
  }

  if (!bookings || bookings.length === 0) {
    console.log("📭 No bookings found in the database.");
    return;
  }

  console.log(`📊 Found ${bookings.length} recent bookings:\n`);

  // Count by status
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.payment_status] = (acc[booking.payment_status] || 0) + 1;
    return acc;
  }, {});

  console.log("📈 Status Summary:");
  Object.entries(statusCounts).forEach(([status, count]) => {
    const icon =
      status === "CONFIRMED" ? "✅" : status === "PENDING" ? "⏳" : "❓";
    console.log(`   ${icon} ${status}: ${count}`);
  });

  console.log("\n📋 Recent Bookings Details:\n");

  bookings.forEach((booking, index) => {
    const statusIcon =
      booking.payment_status === "CONFIRMED"
        ? "✅"
        : booking.payment_status === "PENDING"
          ? "⏳"
          : "❓";
    const paystackIcon = booking.paystack_reference ? "💳" : "📝";

    console.log(`${index + 1}. ${statusIcon} ${booking.guest_name}`);
    console.log(`   Booking Ref: ${booking.booking_reference_code}`);
    console.log(`   Status: ${booking.payment_status}`);
    console.log(
      `   ${paystackIcon} Paystack Ref: ${booking.paystack_reference || "None"}`,
    );
    console.log(
      `   Amount: ₦${booking.total_amount_ngn?.toLocaleString() || 0}`,
    );
    console.log(`   Created: ${new Date(booking.created_at).toLocaleString()}`);
    console.log("");
  });

  // Check for recent Paystack payments that might be PENDING
  const recentPaystackBookings = bookings.filter(
    (b) =>
      b.paystack_reference &&
      new Date(b.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
  );

  if (recentPaystackBookings.length > 0) {
    console.log("\n🔍 Recent Paystack Bookings (Last 24 hours):\n");
    recentPaystackBookings.forEach((booking) => {
      const statusIcon = booking.payment_status === "CONFIRMED" ? "✅" : "⚠️";
      console.log(
        `${statusIcon} ${booking.guest_name} - ${booking.payment_status}`,
      );
    });
  }
}

checkBookings().catch(console.error);
