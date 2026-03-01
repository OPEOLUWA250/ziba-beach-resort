import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Try to get by slug first, then by ID
    let { data: popup, error } = await supabaseServer
      .from("popups")
      .select("*")
      .eq("slug", id)
      .single();

    if (!popup && !error) {
      // Try by ID instead
      const result = await supabaseServer
        .from("popups")
        .select("*")
        .eq("id", id)
        .single();
      popup = result.data;
      error = result.error;
    }

    if (!popup) {
      return NextResponse.json(
        { success: false, error: "Popup not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      popup,
    });
  } catch (error: any) {
    console.error("Error fetching popup:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch popup" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseServer
      .from("popups")
      .update(body)
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Popup not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Popup updated successfully",
      popup: data[0],
    });
  } catch (error: any) {
    console.error("Error updating popup:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update popup" },
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

    const { error } = await supabaseServer.from("popups").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Popup deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting popup:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete popup" },
      { status: 500 },
    );
  }
}
