#!/usr/bin/env npx ts-node

/**
 * Database Setup Script
 * Usage: npm run setup:day-pass
 * This script sets up the day_pass_experiences table and seeds it with data
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Error: Missing Supabase credentials");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const experiences = [
  // Day Pass Tickets
  {
    name: "Infant Ticket",
    description: "Free access for babies 0-3 years old",
    price_per_person: 0,
    category: "day-pass",
    age_group: "0-3 years",
    available: true,
  },
  {
    name: "Kids Ticket",
    description: "Day pass for children 3-12 years old with access to all facilities",
    price_per_person: 10000,
    category: "day-pass",
    age_group: "3-12 years",
    available: true,
  },
  {
    name: "Kids Ticket Plus",
    description: "Enhanced day pass with premium activities and exclusive access for children 3-12",
    price_per_person: 25000,
    category: "day-pass",
    age_group: "3-12 years",
    available: true,
  },
  {
    name: "Teens Ticket",
    description: "Day pass for teenagers 13-17 years with full resort access",
    price_per_person: 15000,
    category: "day-pass",
    age_group: "13-17 years",
    available: true,
  },
  {
    name: "Teen Ticket Plus",
    description: "Premium day pass with VIP activities for teenagers 13-17",
    price_per_person: 30000,
    category: "day-pass",
    age_group: "13-17 years",
    available: true,
  },
  {
    name: "Adult Ticket",
    description: "Standard day pass for adults 18+ years with full resort access",
    price_per_person: 20000,
    category: "day-pass",
    age_group: "18+ years",
    available: true,
  },
  {
    name: "Adult Ticket Plus",
    description: "Premium day pass for adults 18+ with exclusive amenities and dining privileges",
    price_per_person: 45000,
    category: "day-pass",
    age_group: "18+ years",
    available: true,
  },
  {
    name: "Senior Ticket",
    description: "Discounted day pass for seniors 60+ years",
    price_per_person: 12000,
    category: "day-pass",
    age_group: "60+ years",
    available: true,
  },

  // Add-On Experiences
  {
    name: "Deep Tissue Massage",
    description: "Therapeutic deep tissue massage session",
    price_per_person: 35000,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Swedish Massage",
    description: "Relaxing Swedish massage experience",
    price_per_person: 25000,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Kids Massage",
    description: "Gentle massage designed for children",
    price_per_person: 11250,
    category: "day-pass",
    age_group: "3-12 years",
    available: true,
  },
  {
    name: "Horse riding",
    description: "Guided horse riding experience along the beach",
    price_per_person: 5062,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Paint & Chill in the pool with floating snacks [For 2]",
    description: "Paint and relax in the pool with snacks - perfect for couples",
    price_per_person: 50000,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Paint & Chill with Canvas",
    description: "Create your own canvas art in a relaxing setting",
    price_per_person: 15000,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Family/Group Beachside Lunch",
    description: "Group dining experience by the beach",
    price_per_person: 22500,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Beachfront Picnic",
    description: "Romantic or family picnic setup on the beach",
    price_per_person: 28125,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Paint & Chill with Tote Bag",
    description: "Design and paint your own tote bag",
    price_per_person: 13000,
    category: "day-pass",
    age_group: "All ages",
    available: true,
  },
  {
    name: "Paint & Chill for Children",
    description: "Fun painting activity specially designed for kids",
    price_per_person: 10000,
    category: "day-pass",
    age_group: "3-12 years",
    available: true,
  },
];

async function setup() {
  try {
    console.log("🌱 Setting up day_pass_experiences table...\n");

    // Try to read and execute the SQL file
    const sqlPath = path.join(__dirname, "seed-day-pass-experiences.sql");
    fs.readFileSync(sqlPath, "utf8");

    console.log("📋 Reading SQL migration script...");
    console.log(`📁 File: ${sqlPath}\n`);

    // Since we can't directly execute raw SQL through Supabase JS client,
    // we'll check if table exists and create data if needed

    // Check if table exists
    console.log("🔍 Checking if day_pass_experiences table exists...");
    const { error: checkError } = await supabase
      .from("day_pass_experiences")
      .select("id")
      .limit(1);

    if (checkError?.code === "PGRST116") {
      console.log("❌ Table does not exist!");
      console.log("\n📌 MANUAL SETUP REQUIRED:");
      console.log("Please run the following steps:");
      console.log("1. Go to Supabase Dashboard: https://app.supabase.com");
      console.log("2. Select your project");
      console.log("3. Go to SQL Editor");
      console.log("4. Click 'New Query'");
      console.log("5. Copy and paste the entire contents of:");
      console.log(`   ${sqlPath}`);
      console.log("6. Click 'Run'");
      console.log("\nThe script will automatically create the table and seed the data.");
      process.exit(1);
    }

    console.log("✅ Table exists! Proceeding with data...\n");

    // Upsert experiences
    console.log(`📥 Inserting ${experiences.length} experiences...`);
    const { error } = await supabase
      .from("day_pass_experiences")
      .upsert(experiences, { onConflict: "name" });

    if (error) throw error;

    console.log("✅ Successfully seeded database!\n");
    console.log("📊 Summary:");
    console.log(`   ✓ ${experiences.filter(e => e.name.includes("Ticket")).length} ticket types`);
    console.log(
      `   ✓ ${experiences.filter(e => !e.name.includes("Ticket")).length} add-on experiences`
    );
    console.log("\n🎉 Database is ready!");
    console.log("You can now refresh your browser to see the Day Pass Tickets and Add-On Experiences cards.\n");

    process.exit(0);
  } catch (err: any) {
    console.error("❌ Setup failed:", err.message);
    console.error("\n🆘 Troubleshooting:");
    console.error("1. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local");
    console.error("2. Check that your Supabase project is accessible");
    console.error("3. Try manual setup via Supabase Dashboard");
    process.exit(1);
  }
}

setup();
