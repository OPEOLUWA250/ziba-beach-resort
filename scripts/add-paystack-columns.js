require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing Supabase environment variables");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "✓" : "✗");
  process.exit(1);
}

async function addColumns() {
  try {
    console.log("🔧 Adding missing Paystack columns to bookings table...");

    const sqlQueries = [
      "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS paystack_access_code TEXT;",
      "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS paystack_authorization_url TEXT;",
    ];

    // Execute each SQL statement
    for (const query of sqlQueries) {
      console.log(`\n📝 Executing: ${query}`);

      // Use the REST API to execute SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn(`  ⚠️  Response: ${JSON.stringify(data)}`);
      } else {
        console.log(`  ✅ Success`);
      }
    }

    console.log("\n✨ Migration complete!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

addColumns();
