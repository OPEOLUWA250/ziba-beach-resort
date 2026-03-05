import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, getSessionCookieName } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(getSessionCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = verifyAdminSession(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { data: admin, error } = await supabaseServer
      .from("admin_users")
      .select(
        "id, username, email, role, status, last_login, created_by, created_at, current_session_token",
      )
      .eq("id", session.adminId)
      .maybeSingle();

    if (error || !admin || admin.status !== "active") {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Single-session enforcement: verify session ID matches database
    if (admin.current_session_token !== session.sessionId) {
      return NextResponse.json(
        {
          error:
            "Your session has been invalidated. This account is logged in elsewhere.",
        },
        { status: 401 },
      );
    }

    // Return admin data without the session token
    const { current_session_token, ...adminData } = admin;

    return NextResponse.json({ success: true, admin: adminData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch session" },
      { status: 500 },
    );
  }
}
