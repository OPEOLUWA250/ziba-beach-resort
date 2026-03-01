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
      has_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabase_url:
        process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "..." ||
        "NOT SET",
      service_role_key_status: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "✅ SET"
        : "❌ MISSING (required for admin edits)",
    };

    // Check 6: Try to update a popup (permission test)
    console.log("[Diagnostic] Check 6: Write permission test...");
    try {
      const testPopups = await supabaseServer
        .from("popups")
        .select("id")
        .limit(1);

      if (testPopups.data && testPopups.data.length > 0) {
        const testId = testPopups.data[0].id;
        console.log(`[Diagnostic] Testing update on popup: ${testId}`);

        const { data, error } = await supabaseServer
          .from("popups")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", testId)
          .select();

        diagnostics.checks.write_permissions = {
          status: error ? "❌ Update failed" : "✅ Update successful",
          error: error?.message || null,
          can_write: !error,
        };
      } else {
        diagnostics.checks.write_permissions = {
          status: "⚠️ No popups to test",
          note: "Create a popup first to test write permissions",
        };
      }
    } catch (e: any) {
      diagnostics.checks.write_permissions = {
        status: "❌ Test failed",
        error: e.message,
      };
    }

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
