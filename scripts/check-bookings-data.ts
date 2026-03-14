// Script to check what booking data exists in the database
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials!");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.log("SUPABASE_SERVICE_ROLE_KEY:", !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBookingsData() {
  console.log("🔍 Checking bookings data...\n");

  // Check room bookings
  console.log("📊 ROOM BOOKINGS:");
  console.log("=".repeat(80));
  const { data: roomBookings, error: roomError } = await supabase
    .from("bookings")
    .select(
      "id, booking_reference_code, guest_name, guest_email, payment_status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (roomError) {
    console.error("❌ Error fetching room bookings:", roomError);
  } else if (!roomBookings || roomBookings.length === 0) {
    console.log("⚠️  No room bookings found in database\n");
  } else {
    console.log(`✅ Found ${roomBookings.length} room bookings:\n`);
    roomBookings.forEach((booking, idx) => {
      console.log(`${idx + 1}. Ref: ${booking.booking_reference_code}`);
      console.log(`   Name: ${booking.guest_name}`);
      console.log(`   Email: ${booking.guest_email}`);
      console.log(`   Status: ${booking.payment_status}`);
      console.log(`   Created: ${booking.created_at}`);
      console.log();
    });
  }

  // Check day-pass bookings
  console.log("\n📊 DAY-PASS BOOKINGS:");
  console.log("=".repeat(80));
  const { data: dayPassBookings, error: dpError } = await supabase
    .from("day_pass_bookings")
    .select("id, reference_code, full_name, email, payment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (dpError) {
    console.error("❌ Error fetching day-pass bookings:", dpError);
  } else if (!dayPassBookings || dayPassBookings.length === 0) {
    console.log("⚠️  No day-pass bookings found in database\n");
  } else {
    console.log(`✅ Found ${dayPassBookings.length} day-pass bookings:\n`);
    dayPassBookings.forEach((booking, idx) => {
      console.log(`${idx + 1}. Ref: ${booking.reference_code}`);
      console.log(`   Name: ${booking.full_name}`);
      console.log(`   Email: ${booking.email}`);
      console.log(`   Status: ${booking.payment_status}`);
      console.log(`   Created: ${booking.created_at}`);
      console.log();
    });
  }

  // Summary
  console.log("\n📈 SUMMARY:");
  console.log("=".repeat(80));
  console.log(`Total Room Bookings: ${roomBookings?.length || 0}`);
  console.log(`Total Day-Pass Bookings: ${dayPassBookings?.length || 0}`);
  console.log(
    `Total Bookings: ${(roomBookings?.length || 0) + (dayPassBookings?.length || 0)}`,
  );

  if (
    (roomBookings?.length || 0) === 0 &&
    (dayPassBookings?.length || 0) === 0
  ) {
    console.log("\n⚠️  WARNING: No bookings found in database!");
    console.log(
      "You need to create some test bookings or check if you're connected to the right database.",
    );
  }
}

checkBookingsData()
  .then(() => {
    console.log("\n✅ Check complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
