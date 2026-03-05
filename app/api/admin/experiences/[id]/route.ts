import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const { error } = await supabase
      .from("day_pass_experiences")
      .update({
        name: body.name,
        description: body.description,
        price_per_person: body.pricePerPerson,
        category: body.category,
        age_group: body.ageGroup,
        available: body.available,
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      message: "Experience updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update experience" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("day_pass_experiences")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      message: "Experience deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete experience" },
      { status: 500 },
    );
  }
}
