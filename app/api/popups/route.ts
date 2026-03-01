import { NextRequest, NextResponse } from "next/server";
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

    // Add CORS headers for production
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
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
    const body = await request.json();

    const popupId = `popup-${Date.now()}`;
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

    const { data, error } = await supabaseServer
      .from("popups")
      .insert([popupData])
      .select();

    if (error) throw error;

    const popup = data?.[0];

    return NextResponse.json(
      {
        success: true,
        message: "Popup created successfully",
        popup,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[POST /api/popups] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create popup",
        details: error.toString(),
      },
      { status: 500 },
    );
  }
}
