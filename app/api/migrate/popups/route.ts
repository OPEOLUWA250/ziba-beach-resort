import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting popups table migration...");

    // First, try to create the table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS popups (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        featured_image TEXT NOT NULL,
        cta_button_text TEXT DEFAULT 'Learn More',
        cta_button_url TEXT,
        tags TEXT[] DEFAULT '{}',
        status TEXT DEFAULT 'ACTIVE',
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_popups_slug ON popups(slug);
      CREATE INDEX IF NOT EXISTS idx_popups_status ON popups(status);

      ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Enable read active popups for all users" ON popups;
      DROP POLICY IF EXISTS "Enable insert for popups" ON popups;
      DROP POLICY IF EXISTS "Enable update for popups" ON popups;
      DROP POLICY IF EXISTS "Enable delete for popups" ON popups;

      CREATE POLICY "Enable read for all users" ON popups FOR SELECT USING (true);
      CREATE POLICY "Enable insert for all users" ON popups FOR INSERT WITH CHECK (true);
      CREATE POLICY "Enable update for all users" ON popups FOR UPDATE USING (true) WITH CHECK (true);
      CREATE POLICY "Enable delete for all users" ON popups FOR DELETE USING (true);
    `;

    // Use the service role key to run the migration - but we can't execute raw SQL directly
    // Instead, let's just check if the table exists by trying to query it
    const { data: checkTable, error: checkError } = await supabase
      .from("popups")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Table check error:", checkError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Popups table does not exist. Please run the SQL migration in Supabase Dashboard.",
          sqlMigration: createTableSQL,
        },
        { status: 400 },
      );
    }

    console.log("Popups table exists and is accessible");

    return NextResponse.json({
      success: true,
      message: "Popups table is ready",
      sql: createTableSQL,
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("popups").select("*").limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Popups table does not exist or is not accessible",
          details: error.message,
          help: "Run the SQL migration in Supabase Dashboard: SQL Editor",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Popups table is ready",
      tableExists: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
