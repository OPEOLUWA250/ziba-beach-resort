import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  verifyAdminPassword,
  signAdminSession,
  getSessionCookieName,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "identifier and password are required" },
        { status: 400 },
      );
    }

    const normalizedIdentifier = String(identifier).trim().toLowerCase();

    const { data: byEmail } = await supabaseServer
      .from("admin_users")
      .select("id, username, email, role, status, password_hash")
      .eq("email", normalizedIdentifier)
      .maybeSingle();

    let admin = byEmail;

    if (!admin) {
      const { data: byUsername } = await supabaseServer
        .from("admin_users")
        .select("id, username, email, role, status, password_hash")
        .eq("username", identifier)
        .maybeSingle();
      admin = byUsername;
    }

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (admin.status !== "active") {
      return NextResponse.json(
        { error: `Account is ${admin.status}` },
        { status: 403 },
      );
    }

    const validPassword = await verifyAdminPassword(password, admin.password_hash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    await supabaseServer
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", admin.id);

    await supabaseServer.from("admin_audit_logs").insert({
      actor_admin_id: admin.id,
      action: "AUTH_LOGIN",
      metadata: { identifier },
    });

    const token = signAdminSession({
      adminId: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });

    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error: any) {
    console.error("Error logging in admin:", error);
    return NextResponse.json(
      { error: error.message || "Failed to login" },
      { status: 500 },
    );
  }
}
