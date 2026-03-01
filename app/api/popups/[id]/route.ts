import { NextRequest, NextResponse } from "next/server";
import { supabaseServer, isSupabaseConfigured } from "@/lib/supabase/server";

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
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error(
        "[PUT /api/popups/[id]] Supabase not configured. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      );
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error - Supabase not configured",
          details:
            "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in production environment",
        },
        { status: 500 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Define allowed fields for update (whitelist approach)
    const allowedFields = [
      "title",
      "slug",
      "excerpt",
      "content",
      "featured_image",
      "modal_cta_text",
      "modal_cta_url",
      "dedicated_page_cta_text",
      "dedicated_page_cta_url",
      "tags",
      "status",
    ];

    // Build safe update object - only include allowed fields
    const updateData: any = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date().toISOString();

    console.log(`[PUT /api/popups/[${id}]] Attempting update with fields:`, {
      id,
      fields: Object.keys(updateData),
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

    const { data, error } = await supabaseServer
      .from("popups")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error(`[PUT /api/popups/[${id}]] Supabase error:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.error(
        `[PUT /api/popups/[${id}]] No rows affected - popup not found`,
      );
      return NextResponse.json(
        { success: false, error: "Popup not found" },
        { status: 404 },
      );
    }

    console.log(`[PUT /api/popups/[${id}]] Update successful`);
    return NextResponse.json({
      success: true,
      message: "Popup updated successfully",
      popup: data[0],
    });
  } catch (error: any) {
    console.error("[PUT /api/popups/[id]] Error updating popup:", {
      errorMessage: error.message,
      errorCode: error.code,
      errorDetails: error.details,
    });
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update popup",
        code: error.code,
      },
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
