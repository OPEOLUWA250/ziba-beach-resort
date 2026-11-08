import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";
import { supabaseServer } from "@/lib/supabase/server";
import { clientIp as readClientIp } from "@/lib/server/client-ip";
import { BodyTooLargeError, readJsonBody } from "@/lib/server/body";
import {
  adminCookieOptions,
  generateSessionId,
  getSessionCookieName,
  hashAdminPassword,
  signAdminSession,
  validatePasswordPolicy,
} from "@/lib/admin-auth";

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  const rate = await rateLimitByIp(request.headers, "api:admin:recover", 5, 15 * 60_000);
  if (!rate.allowed) return tooManyRequests(rate);

  try {
    const body = ((await readJsonBody(request, 4 * 1024)) ?? {}) as Record<string, unknown>;
    const text = (value: unknown) => (typeof value === "string" ? value : undefined);
    const recoveryKey = text(body.recoveryKey);
    const newPassword = text(body.newPassword);
    const identifier = text(body.identifier);

    if (!recoveryKey || !newPassword) {
      return NextResponse.json(
        { error: "recoveryKey and newPassword are required" },
        { status: 400 },
      );
    }

    if (
      typeof newPassword !== "string" ||
      newPassword.length > 128 ||
      !validatePasswordPolicy(newPassword)
    ) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 10 characters and include uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      );
    }

    const configuredRecoveryKey = process.env.ADMIN_SUPERADMIN_RECOVERY_KEY;
    if (!configuredRecoveryKey) {
      return NextResponse.json(
        { error: "Recovery key is not configured on this environment" },
        { status: 500 },
      );
    }

    if (!safeCompare(String(recoveryKey), configuredRecoveryKey)) {
      return NextResponse.json(
        { error: "Invalid recovery key" },
        { status: 401 },
      );
    }

    const { data: superAdmins, error: queryError } = await supabaseServer
      .from("admin_users")
      .select("id, username, email, role")
      .eq("role", "SUPER_ADMIN");

    if (queryError) {
      throw queryError;
    }

    if (!superAdmins || superAdmins.length === 0) {
      return NextResponse.json(
        { error: "No SUPER_ADMIN account found" },
        { status: 404 },
      );
    }

    const normalizedIdentifier = identifier?.trim().toLowerCase();
    const targetAdmin = normalizedIdentifier
      ? superAdmins.find(
          (admin) =>
            admin.email.toLowerCase() === normalizedIdentifier ||
            admin.username.toLowerCase() === normalizedIdentifier,
        )
      : superAdmins.length === 1
        ? superAdmins[0]
        : null;

    if (!targetAdmin) {
      return NextResponse.json(
        {
          error: normalizedIdentifier
            ? "SUPER_ADMIN not found for the provided identifier"
            : "Multiple SUPER_ADMIN accounts found. Provide identifier.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await hashAdminPassword(newPassword);
    const sessionId = generateSessionId();
    const clientIp =
      readClientIp(request.headers);

    const { error: updateError } = await supabaseServer
      .from("admin_users")
      .update({
        password_hash: passwordHash,
        status: "active",
        failed_login_attempts: 0,
        locked_until: null,
        current_session_token: sessionId,
        session_created_at: new Date().toISOString(),
        session_ip_address: clientIp,
      })
      .eq("id", targetAdmin.id);

    if (updateError) {
      throw updateError;
    }

    await supabaseServer.from("admin_audit_logs").insert({
      actor_admin_id: targetAdmin.id,
      action: "AUTH_SUPER_ADMIN_RECOVERY",
      target_admin_id: targetAdmin.id,
      metadata: {
        usedIdentifier: Boolean(normalizedIdentifier),
        ip: clientIp,
      },
    });

    const token = signAdminSession({
      adminId: targetAdmin.id,
      username: targetAdmin.username,
      email: targetAdmin.email,
      role: targetAdmin.role,
      sessionId,
    });

    const response = NextResponse.json({
      success: true,
      message: "SUPER_ADMIN account recovered successfully",
    });

    response.cookies.set(getSessionCookieName(), token, adminCookieOptions());

    return response;
  } catch (error: any) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    console.error("Error recovering SUPER_ADMIN:", error?.message);
    return NextResponse.json(
      { error: "Failed to recover SUPER_ADMIN" },
      { status: 500 },
    );
  }
}
