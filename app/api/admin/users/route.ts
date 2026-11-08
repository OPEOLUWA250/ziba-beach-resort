import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  getSessionAdmin,
  hashAdminPassword,
  logAdminAudit,
  validatePasswordPolicy,
} from "@/lib/admin-auth";
import { BodyTooLargeError, readJsonBody } from "@/lib/server/body";
import {
  adminCreateSchema,
  adminWriteError,
  requireSuperAdmin,
} from "@/lib/server/admin-users";

const PASSWORD_RULES =
  "Password must be at least 10 characters and include uppercase, lowercase, number, and special character";

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
  } catch (error) {
    console.error("[admin-users GET]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin(request);
    if (auth.response) return auth.response;
    const { actor } = auth;

    const parsed = adminCreateSchema.safeParse(await readJsonBody(request, 4 * 1024));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Check the username, email, role and status", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { username, email, password, role, status } = parsed.data;

    if (!validatePasswordPolicy(password)) {
      return NextResponse.json({ error: PASSWORD_RULES }, { status: 400 });
    }

    const passwordHash = await hashAdminPassword(password);

    const { data, error } = await supabaseServer
      .from("admin_users")
      .insert({
        username,
        email,
        password_hash: passwordHash,
        role,
        status,
        created_by: actor.id,
      })
      .select("id, username, email, role, status, last_login, created_by, created_at")
      .single();

    if (error || !data) return adminWriteError(error, "Failed to create admin");

    await logAdminAudit({
      actorAdminId: actor.id,
      action: "ADMIN_CREATE",
      targetAdminId: data.id,
      metadata: { role, username, email },
    });

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    console.error("[admin-users POST]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
