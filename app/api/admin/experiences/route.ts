import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("day_pass_experiences")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch experiences" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { error } = await supabase.from("day_pass_experiences").insert([
      {
        name: body.name,
        description: body.description,
        price_per_person: body.pricePerPerson,
        category: body.category,
        age_group: body.ageGroup,
        available: body.available,
      },
    ]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Experience created successfully" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create experience" },
      { status: 500 },
    );
  }
}
