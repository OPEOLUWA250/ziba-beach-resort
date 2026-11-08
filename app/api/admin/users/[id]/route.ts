import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  hashAdminPassword,
  logAdminAudit,
  validatePasswordPolicy,
} from "@/lib/admin-auth";
import { BodyTooLargeError, readJsonBody } from "@/lib/server/body";
import {
  adminUpdateSchema,
  adminWriteError,
  requireSuperAdmin,
} from "@/lib/server/admin-users";

const PASSWORD_RULES =
  "Password must be at least 10 characters and include uppercase, lowercase, number, and special character";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireSuperAdmin(request);
    if (auth.response) return auth.response;
    const { actor } = auth;

    const { id } = await params;
    const parsed = adminUpdateSchema.safeParse(await readJsonBody(request, 4 * 1024));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Check the username, email, role and status", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;

    const { data: targetUser } = await supabaseServer
      .from("admin_users")
      .select("id, role")
      .eq("id", id)
      .maybeSingle();

    if (!targetUser) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN" && body.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cannot downgrade SUPER_ADMIN to ADMIN" },
        { status: 400 },
      );
    }

    // The same rules as a new account: a reset can't set a weak password.
    if (body.password && !validatePasswordPolicy(body.password)) {
      return NextResponse.json({ error: PASSWORD_RULES }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (body.username) updates.username = body.username;
    if (body.email) updates.email = body.email;
    if (body.role && targetUser.role !== "SUPER_ADMIN") updates.role = body.role;
    if (body.status) updates.status = body.status;
    if (body.password) {
      updates.password_hash = await hashAdminPassword(body.password);
      updates.failed_login_attempts = 0;
      updates.locked_until = null;
    }

    // A new password or a disabled account ends every session that account
    // has open, so whoever held the old password is signed out at once.
    const endsSessions = Boolean(body.password) || (body.status && body.status !== "active");
    if (endsSessions) updates.current_session_token = null;

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseServer
      .from("admin_users")
      .update(updates)
      .eq("id", id)
      .select("id, username, email, role, status, last_login, created_by, created_at")
      .single();

    if (error || !data) return adminWriteError(error, "Failed to update admin");

    await logAdminAudit({
      actorAdminId: actor.id,
      action: "ADMIN_UPDATE",
      targetAdminId: id,
      metadata: {
        updatedFields: Object.keys(updates).filter(
          (k) => !["password_hash", "current_session_token", "updated_at"].includes(k),
        ),
        passwordReset: Boolean(body.password),
        sessionsEnded: Boolean(endsSessions),
      },
    });

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    console.error("[admin-users PUT]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireSuperAdmin(request);
    if (auth.response) return auth.response;
    const { actor } = auth;

    const { id } = await params;

    const { data: target } = await supabaseServer
      .from("admin_users")
      .select("id, role, username, email")
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

    const { error } = await supabaseServer.from("admin_users").delete().eq("id", id);
    if (error) return adminWriteError(error, "Failed to delete admin");

    await logAdminAudit({
      actorAdminId: actor.id,
      action: "ADMIN_DELETE",
      targetAdminId: null,
      metadata: { deletedAdminId: id, username: target.username, email: target.email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin-users DELETE]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
