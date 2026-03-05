import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  getSessionCookieName,
  hashAdminPassword,
  validatePasswordPolicy,
  verifyAdminSession,
} from "@/lib/admin-auth";

async function getSessionAdmin(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return null;
  const session = verifyAdminSession(token);
  if (!session) return null;

  const { data: admin } = await supabaseServer
    .from("admin_users")
    .select("id, username, email, role, status")
    .eq("id", session.adminId)
    .maybeSingle();

  if (!admin || admin.status !== "active") return null;
  return admin;
}

export async function GET(request: NextRequest) {
  try {
    const actor = await getSessionAdmin(request);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseServer
      .from("admin_users")
      .select("id, username, email, role, status, last_login, created_by, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, users: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch admins" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await getSessionAdmin(request);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (actor.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role = "ADMIN", status = "active" } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email and password are required" },
        { status: 400 },
      );
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!validatePasswordPolicy(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 10 characters and include uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      );
    }

    const passwordHash = await hashAdminPassword(password);

    const { data, error } = await supabaseServer
      .from("admin_users")
      .insert({
        username,
        email: String(email).toLowerCase(),
        password_hash: passwordHash,
        role,
        status,
        created_by: actor.id,
      })
      .select("id, username, email, role, status, last_login, created_by, created_at")
      .single();

    if (error) throw error;

    await supabaseServer.from("admin_audit_logs").insert({
      actor_admin_id: actor.id,
      action: "ADMIN_CREATE",
      target_admin_id: data.id,
      metadata: { role, username, email },
    });

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create admin" },
      { status: 500 },
    );
  }
}
