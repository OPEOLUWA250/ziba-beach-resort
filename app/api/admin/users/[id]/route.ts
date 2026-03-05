import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  getSessionCookieName,
  hashAdminPassword,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await getSessionAdmin(request);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (actor.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const { data: targetUser } = await supabaseServer
      .from("admin_users")
      .select("id, role")
      .eq("id", id)
      .maybeSingle();

    if (!targetUser) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Prevent downgrading SUPER_ADMIN to ADMIN
    if (targetUser.role === "SUPER_ADMIN" && body.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cannot downgrade SUPER_ADMIN to ADMIN" },
        { status: 400 },
      );
    }

    const updates: Record<string, any> = {};

    if (body.username) updates.username = body.username;
    if (body.email) updates.email = String(body.email).toLowerCase();
    if (
      body.role &&
      ["SUPER_ADMIN", "ADMIN"].includes(body.role) &&
      !(targetUser.role === "SUPER_ADMIN") // Don't allow role changes for SUPER_ADMIN
    ) {
      updates.role = body.role;
    }
    if (body.status && ["active", "inactive", "locked"].includes(body.status)) {
      updates.status = body.status;
    }
    if (body.password) {
      updates.password_hash = await hashAdminPassword(body.password);
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseServer
      .from("admin_users")
      .update(updates)
      .eq("id", id)
      .select(
        "id, username, email, role, status, last_login, created_by, created_at",
      )
      .single();

    if (error) throw error;

    await supabaseServer.from("admin_audit_logs").insert({
      actor_admin_id: actor.id,
      action: "ADMIN_UPDATE",
      target_admin_id: id,
      metadata: {
        updatedFields: Object.keys(updates),
      },
    });

    return NextResponse.json({ success: true, user: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update admin" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await getSessionAdmin(request);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (actor.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const { data: target } = await supabaseServer
      .from("admin_users")
      .select("id, role")
      .eq("id", id)
      .maybeSingle();

    if (!target) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (target.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Cannot delete SUPER_ADMIN account" },
        { status: 400 },
      );
    }

    const { error } = await supabaseServer
      .from("admin_users")
      .delete()
      .eq("id", id);
    if (error) throw error;

    await supabaseServer.from("admin_audit_logs").insert({
      actor_admin_id: actor.id,
      action: "ADMIN_DELETE",
      target_admin_id: id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete admin" },
      { status: 500 },
    );
  }
}
