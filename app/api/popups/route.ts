import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer, isSupabaseConfigured } from "@/lib/supabase/server";
import { createPopup } from "@/lib/services/popups";

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      console.error(
        "[GET /api/popups] Supabase not configured. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      );
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error",
          hint: "Ensure environment variables are set in production: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
        },
        { status: 500 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("active");

    // Determine cache headers based on request type
    // Admin dashboard requests should not cache
    // Public requests can cache longer
    const isAdminRequest = request.headers.get("referer")?.includes("/admin");
    const headers = {
      "Content-Type": "application/json",
      // Admin requests: no cache, public requests: 60s cache
      "Cache-Control": isAdminRequest
        ? "private, no-cache, no-store, must-revalidate"
        : "public, s-maxage=30, stale-while-revalidate=60",
    };

    let popups;
    if (activeOnly === "true") {
      // Fetch active popups only (for homepage)
      const { data, error } = await supabaseServer
        .from("popups")
        .select("*")
        .eq("status", "ACTIVE")
        .order("createdat", { ascending: false });

      if (error) {
        console.error("[GET /api/popups] Supabase query error:", error);
        throw new Error(`Database query failed: ${error.message}`);
      }
      popups = data || [];
    } else {
      // Fetch all popups (for admin dashboard)
      const { data, error } = await supabaseServer
        .from("popups")
        .select("*")
        .order("createdat", { ascending: false });

      if (error) {
        console.error("[GET /api/popups] Supabase query error:", error);
        throw new Error(`Database query failed: ${error.message}`);
      }
      popups = data || [];
    }

    return NextResponse.json(
      {
        success: true,
        count: popups.length,
        popups,
      },
      { headers },
    );
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error";
    console.error("[GET /api/popups] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch popups",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error(
        "[POST /api/popups] Supabase not configured. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      );
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error - Supabase not configured",
        },
        { status: 500 },
      );
    }

    const body = await request.json();

    console.log("[POST /api/popups] Creating new popup with data:", {
      title: body.title,
      slug: body.slug,
      hasImage: !!body.featured_image,
    });

    const popupId = `popup-${Date.now()}`;

    // Build popup data with new column names
    const popupData = {
      id: popupId,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featured_image: body.featured_image,
      modal_cta_text: body.modal_cta_text || "",
      dedicated_page_cta_text: body.dedicated_page_cta_text || "",
      dedicated_page_cta_url: body.dedicated_page_cta_url || "",
      tags: body.tags || [],
      status: body.status || "ACTIVE",
    };

    // Also prepare data with old column names as fallback
    const popupDataOldSchema = {
      id: popupId,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featured_image: body.featured_image,
      cta_button_text: body.modal_cta_text || "",
      dedicated_page_cta_text: body.dedicated_page_cta_text || "",
      dedicated_page_cta_url: body.dedicated_page_cta_url || "",
      tags: body.tags || [],
      status: body.status || "ACTIVE",
    };

    console.log("[POST /api/popups] Inserting popup:", { id: popupId });

    // Try with new schema first
    let { data, error } = await supabaseServer
      .from("popups")
      .insert([popupData])
      .select();

    // If column not found error, try with old schema
    if (error && error.message?.includes("column")) {
      console.log(
        "[POST /api/popups] New schema columns not found, trying old schema",
      );
      const result = await supabaseServer
        .from("popups")
        .insert([popupDataOldSchema])
        .select();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("[POST /api/popups] Supabase insertion error:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    const popup = data?.[0];

    console.log("[POST /api/popups] Popup created successfully:", {
      id: popupId,
    });

    // Revalidate cache after successful creation
    try {
      await revalidatePath("/admin/popups");
      await revalidatePath("/popups");
      await revalidatePath("/");
      console.log("[POST /api/popups] Cache revalidated");
    } catch (revalidateError) {
      console.log(
        "[POST /api/popups] Cache revalidation note:",
        revalidateError,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Popup created successfully",
        popup,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST /api/popups] Error:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split("\n")[0],
    });
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create popup",
        code: error.code,
      },
      { status: 500 },
    );
  }
}
