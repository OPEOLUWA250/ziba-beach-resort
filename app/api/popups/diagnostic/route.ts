import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      checks: {},
    };

    // Check 1: Can we connect to database?
    console.log("[Diagnostic] Check 1: Database connection...");
    try {
      const { data: connTest } = await supabaseServer
        .from("popups")
        .select("count");
      diagnostics.checks.database_connection = {
        status: "✅ Connected",
        query: "SELECT COUNT(*)",
      };
    } catch (e: any) {
      diagnostics.checks.database_connection = {
        status: "❌ Failed",
        error: e.message,
      };
    }

    // Check 2: Table exists?
    console.log("[Diagnostic] Check 2: Table existence...");
    try {
      const { data, error } = await supabaseServer
        .from("popups")
        .select("*")
        .limit(1);

      if (error) {
        diagnostics.checks.table_exists = {
          status: "❌ Table not found",
          error: error.message,
        };
      } else {
        diagnostics.checks.table_exists = {
          status: "✅ Table exists",
          accessible: true,
        };
      }
    } catch (e: any) {
      diagnostics.checks.table_exists = {
        status: "❌ Query failed",
        error: e.message,
      };
    }

    // Check 3: Count popups
    console.log("[Diagnostic] Check 3: Count popups...");
    try {
      const { data, error, count } = await supabaseServer
        .from("popups")
        .select("*", { count: "exact" })
        .order("createdat", { ascending: false });

      diagnostics.checks.popup_count = {
        status: "✅ Query successful",
        total_count: count,
        returned_rows: data?.length || 0,
        first_popup: data?.[0] || null,
      };

      if (error) {
        diagnostics.checks.popup_count.error = error.message;
      }
    } catch (e: any) {
      diagnostics.checks.popup_count = {
        status: "❌ Query failed",
        error: e.message,
      };
    }

    // Check 4: Try to fetch active only
    console.log("[Diagnostic] Check 4: Fetch active popups...");
    try {
      const { data, error } = await supabaseServer
        .from("popups")
        .select("*")
        .eq("status", "ACTIVE");

      diagnostics.checks.active_popups = {
        status: error ? "❌ Query failed" : "✅ Query successful",
        count: data?.length || 0,
        data: data || [],
        error: error?.message || null,
      };
    } catch (e: any) {
      diagnostics.checks.active_popups = {
        status: "❌ Exception",
        error: e.message,
      };
    }

    // Check 5: Environment variables
    diagnostics.checks.environment = {
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_url:
        process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "..." ||
        "NOT SET",
    };

    return NextResponse.json(diagnostics, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Diagnostic failed",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
