import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("day_pass_experiences")
      .select("*")
      .eq("available", true)
      .eq("category", "day-pass")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Error fetching day-pass experiences:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch experiences" },
      { status: 500 },
    );
  }
}
