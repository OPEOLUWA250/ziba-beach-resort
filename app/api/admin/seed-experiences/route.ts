import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { getSessionAdmin } from "@/lib/admin-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const experiences = [
  // Day Pass Tickets
  { name: "Infant Ticket", description: "Free access for babies 0-3 years old", price_per_person: 0, category: "day-pass", age_group: "0-3 years", available: true },
  { name: "Kids Ticket", description: "Day pass for children 3-12 years old with access to all facilities", price_per_person: 10000, category: "day-pass", age_group: "3-12 years", available: true },
  { name: "Kids Ticket Plus", description: "Enhanced day pass with premium activities and exclusive access for children 3-12", price_per_person: 25000, category: "day-pass", age_group: "3-12 years", available: true },
  { name: "Teens Ticket", description: "Day pass for teenagers 13-17 years with full resort access", price_per_person: 15000, category: "day-pass", age_group: "13-17 years", available: true },
  { name: "Teen Ticket Plus", description: "Premium day pass with VIP activities for teenagers 13-17", price_per_person: 30000, category: "day-pass", age_group: "13-17 years", available: true },
  { name: "Adult Ticket", description: "Standard day pass for adults 18+ years with full resort access", price_per_person: 20000, category: "day-pass", age_group: "18+ years", available: true },
  { name: "Adult Ticket Plus", description: "Premium day pass for adults 18+ with exclusive amenities and dining privileges", price_per_person: 45000, category: "day-pass", age_group: "18+ years", available: true },
  { name: "Senior Ticket", description: "Discounted day pass for seniors 60+ years", price_per_person: 12000, category: "day-pass", age_group: "60+ years", available: true },

  // Add-On Experiences
  { name: "Deep Tissue Massage", description: "Therapeutic deep tissue massage session", price_per_person: 35000, category: "day-pass", age_group: "All ages", available: true },
  { name: "Swedish Massage", description: "Relaxing Swedish massage experience", price_per_person: 25000, category: "day-pass", age_group: "All ages", available: true },
  { name: "Kids Massage", description: "Gentle massage designed for children", price_per_person: 11250, category: "day-pass", age_group: "3-12 years", available: true },
  { name: "Horse riding", description: "Guided horse riding experience along the beach", price_per_person: 5062, category: "day-pass", age_group: "All ages", available: true },
  { name: "Paint & Chill in the pool with floating snacks [For 2]", description: "Paint and relax in the pool with snacks - perfect for couples", price_per_person: 50000, category: "day-pass", age_group: "All ages", available: true },
  { name: "Paint & Chill with Canvas", description: "Create your own canvas art in a relaxing setting", price_per_person: 15000, category: "day-pass", age_group: "All ages", available: true },
  { name: "Family/Group Beachside Lunch", description: "Group dining experience by the beach", price_per_person: 22500, category: "day-pass", age_group: "All ages", available: true },
  { name: "Beachfront Picnic", description: "Romantic or family picnic setup on the beach", price_per_person: 28125, category: "day-pass", age_group: "All ages", available: true },
  { name: "Paint & Chill with Tote Bag", description: "Design and paint your own tote bag", price_per_person: 13000, category: "day-pass", age_group: "All ages", available: true },
  { name: "Paint & Chill for Children", description: "Fun painting activity specially designed for kids", price_per_person: 10000, category: "day-pass", age_group: "3-12 years", available: true },
];

async function setupTable() {
  try {
    // Read the SQL file to get table creation statement
    const sqlPath = path.join(process.cwd(), "scripts", "seed-day-pass-experiences.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Extract individual statements
    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter(
        (s) =>
          s &&
          !s.startsWith("/**") &&
          !s.startsWith("--") &&
          !s.includes("INSERT INTO")
      );

    // Try to execute the first CREATE TABLE statement
    const createTableStatement = statements.find((s) => s.includes("CREATE TABLE"));
    
    if (createTableStatement) {
      // Use Supabase SQL method if available
      const { error } = await (supabase as any).rpc("exec_sql", {
        sql: createTableStatement,
      }).catch(() => ({ error: { message: "RPC not available" } }));

      if (error && !error.message.includes("not available")) {
        console.error("Error creating table via RPC:", error);
      } else {
        // Try alternate method - just proceed assuming table might exist or will work
        console.log("Attempting table creation...");
      }
    }

    return true;
  } catch (err) {
    console.error("Error during table setup:", err);
    // Continue anyway - table might already exist
    return true;
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await getSessionAdmin(request);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, try to set up the table
    await setupTable();

    // Check if table exists and has data
    const { error: queryError } = await supabase
      .from("day_pass_experiences")
      .select("id")
      .limit(1);

    if (queryError?.code === "PGRST116") {
      // Table doesn't exist
      return NextResponse.json(
        {
          error: "day_pass_experiences table does not exist",
          hint: "Please manually run the SQL migration: scripts/seed-day-pass-experiences.sql in Supabase SQL Editor",
          instructions:
            "1. Go to Supabase Dashboard\n2. Select your project\n3. Go to SQL Editor\n4. Copy and paste scripts/seed-day-pass-experiences.sql\n5. Click Run",
        },
        { status: 400 }
      );
    }

    // Upsert experiences
    const { error } = await supabase
      .from("day_pass_experiences")
      .upsert(experiences, { onConflict: "name" });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${experiences.length} experiences`,
      count: experiences.length,
      ticketCount: experiences.filter((e) => e.name.includes("Ticket")).length,
      experienceCount: experiences.filter((e) => !e.name.includes("Ticket"))
        .length,
    });
  } catch (error: any) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to seed database",
        details: error.code || error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to seed the database with day pass experiences",
    experiences_count: experiences.length,
    instructions:
      "If you get an error, manually run scripts/seed-day-pass-experiences.sql in Supabase SQL Editor",
  });
}
