import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
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
    let body;
    try {
      body = await request.json();
    } catch (e: any) {
      console.error("[PUT /api/popups/[id]] Failed to parse JSON body:", {
        error: e.message,
      });
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    console.log(`[PUT /api/popups/[${id}]] Request received with body:`, {
      id,
      bodyKeys: Object.keys(body),
      bodyLength: JSON.stringify(body).length,
    });

    // Define allowed fields for update (whitelist approach)
    // Support both old and new column names for backward compatibility
    const allowedFields = [
      "title",
      "slug",
      "excerpt",
      "content",
      "featured_image",
      // New column names
      "modal_cta_text",
      "modal_cta_url",
      "dedicated_page_cta_text",
      "dedicated_page_cta_url",
      // Old column names (for backward compatibility)
      "cta_button_text",
      "cta_button_url",
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

    // Handle field mapping from new names to old names if old table is used
    // This allows form to send new names but update old columns if they exist
    const fieldMapping: { [key: string]: string } = {
      modal_cta_text: "cta_button_text",
      modal_cta_url: "cta_button_url",
    };

    // Create a copy with mapped names for tables that use old schema
    const updateDataWithMapping: any = { ...updateData };
    for (const [newName, oldName] of Object.entries(fieldMapping)) {
      if (newName in updateData && !(oldName in updateData)) {
        updateDataWithMapping[oldName] = updateData[newName];
        // Try updating with new name first, if it doesn't exist, old name will be used
        delete updateDataWithMapping[newName];
      }
    }

    if (Object.keys(updateData).length === 0) {
      console.error(
        `[PUT /api/popups/[${id}]] No valid fields to update. Body keys: ${Object.keys(body).join(", ")}, Allowed: ${allowedFields.join(", ")}`,
      );
      return NextResponse.json(
        {
          success: false,
          error: "No valid fields provided for update",
          receivedFields: Object.keys(body),
          allowedFields,
        },
        { status: 400 },
      );
    }

    console.log(`[PUT /api/popups/[${id}]] Update payload prepared:`, {
      id,
      updateFields: Object.keys(updateData),
      updateDataSample: JSON.stringify(updateData).substring(0, 200),
    });

    // Try with new column names first, if error try with old names
    let { data, error } = await supabaseServer
      .from("popups")
      .update(updateData)
      .eq("id", id)
      .select();

    // If we got a column not found error and have mapped fields, try with old names
    if (
      error &&
      error.message?.includes("column") &&
      Object.keys(updateDataWithMapping).length > 0
    ) {
      console.log(
        `[PUT /api/popups/[${id}]] New column names failed, trying old names`,
      );
      const result = await supabaseServer
        .from("popups")
        .update(updateDataWithMapping)
        .eq("id", id)
        .select();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error(`[PUT /api/popups/[${id}]] Supabase error:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: error.status,
      });
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to update popup",
          code: error.code,
        },
        { status: 400 },
      );
    }

    if (!data || data.length === 0) {
      console.warn(
        `[PUT /api/popups/[${id}]] Update returned no rows (popup not found or no changes)`,
        { dataLength: data?.length },
      );
      return NextResponse.json(
        { success: false, error: "Popup not found or no changes made" },
        { status: 404 },
      );
    }

    console.log(`[PUT /api/popups/[${id}]] Update successful`, {
      id,
      updatedFields: Object.keys(updateData),
    });

    // Revalidate cache after successful update
    try {
      await revalidatePath("/admin/popups");
      await revalidatePath("/popups");
      await revalidatePath("/");
      console.log(`[PUT /api/popups/[${id}]] Cache revalidated`);
    } catch (revalidateError) {
      console.log(
        `[PUT /api/popups/[${id}]] Cache revalidation note:`,
        revalidateError,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Popup updated successfully",
      popup: data[0],
    });
  } catch (error: any) {
    console.error("[PUT /api/popups/[id]] Unexpected error:", {
      errorMessage: error.message,
      errorCode: error.code,
      errorStack: error.stack?.split("\n")[0],
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
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error("[DELETE /api/popups/[id]] Supabase not configured");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error - Supabase not configured",
        },
        { status: 500 },
      );
    }

    const { id } = await params;

    console.log(`[DELETE /api/popups/[${id}]] Attempting delete`);

    const { error } = await supabaseServer.from("popups").delete().eq("id", id);

    if (error) {
      console.error(`[DELETE /api/popups/[${id}]] Supabase error:`, {
        message: error.message,
        code: error.code,
      });
      throw error;
    }

    console.log(`[DELETE /api/popups/[${id}]] Delete successful`);

    // Revalidate cache after successful delete
    try {
      await revalidatePath("/admin/popups");
      await revalidatePath("/popups");
      await revalidatePath("/");
      console.log(`[DELETE /api/popups/[${id}]] Cache revalidated`);
    } catch (revalidateError) {
      console.log(
        `[DELETE /api/popups/[${id}]] Cache revalidation note:`,
        revalidateError,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Popup deleted successfully",
    });
  } catch (error: any) {
    console.error("[DELETE /api/popups/[id]] Error deleting popup:", {
      errorMessage: error.message,
      errorCode: error.code,
    });
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete popup" },
      { status: 500 },
    );
  }
}
