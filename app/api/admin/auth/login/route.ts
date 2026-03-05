import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  verifyAdminPassword,
  signAdminSession,
  getSessionCookieName,
  generateSessionId,
} from "@/lib/admin-auth";

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

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

    // Lookup admin by email or username
    const { data: byEmail } = await supabaseServer
      .from("admin_users")
      .select("id, username, email, role, status, password_hash, failed_login_attempts, locked_until")
      .eq("email", normalizedIdentifier)
      .maybeSingle();

    let admin = byEmail;

    if (!admin) {
      const { data: byUsername } = await supabaseServer
        .from("admin_users")
        .select("id, username, email, role, status, password_hash, failed_login_attempts, locked_until")
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

    // Check if account is temporarily locked
    if (admin.locked_until) {
      const lockoutEnd = new Date(admin.locked_until);
      if (lockoutEnd > new Date()) {
        const minutesLeft = Math.ceil(
          (lockoutEnd.getTime() - Date.now()) / 60000,
        );
        return NextResponse.json(
          {
            error: `Account locked due to multiple failed attempts. Try again in ${minutesLeft} minutes.`,
          },
          { status: 423 }, // 423 Locked
        );
      } else {
        // Lockout expired, reset counter
        await supabaseServer
          .from("admin_users")
          .update({ failed_login_attempts: 0, locked_until: null })
          .eq("id", admin.id);
      }
    }

    if (admin.status !== "active") {
      return NextResponse.json(
        { error: `Account is ${admin.status}` },
        { status: 403 },
      );
    }

    const validPassword = await verifyAdminPassword(
      password,
      admin.password_hash,
    );

    if (!validPassword) {
      // Increment failed login attempts
      const newAttempts = (admin.failed_login_attempts || 0) + 1;
      const updates: any = { failed_login_attempts: newAttempts };

      // Lock account if max attempts reached
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockUntil = new Date(
          Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000,
        );
        updates.locked_until = lockUntil.toISOString();
      }

      await supabaseServer
        .from("admin_users")
        .update(updates)
        .eq("id", admin.id);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        return NextResponse.json(
          {
            error: `Account locked for ${LOCKOUT_DURATION_MINUTES} minutes due to multiple failed login attempts.`,
          },
          { status: 423 },
        );
      }

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate unique session ID for single-session enforcement
    const sessionId = generateSessionId();
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Update database with new session (invalidates old sessions)
    await supabaseServer
      .from("admin_users")
      .update({
        last_login: new Date().toISOString(),
        current_session_token: sessionId,
        session_created_at: new Date().toISOString(),
        session_ip_address: clientIp,
        failed_login_attempts: 0, // Reset on successful login
        locked_until: null, // Clear any lock
      })
      .eq("id", admin.id);

    await supabaseServer.from("admin_audit_logs").insert({
      actor_admin_id: admin.id,
      action: "AUTH_LOGIN",
      metadata: { identifier, ip: clientIp },
    });

    const token = signAdminSession({
      adminId: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      sessionId, // Include session ID in token
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
