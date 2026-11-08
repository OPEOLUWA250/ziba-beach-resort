import { NextRequest, NextResponse } from "next/server";
import { rateLimitByIp, tooManyRequests } from "@/lib/security/rate-limit";
import { supabaseServer } from "@/lib/supabase/server";
import { clientIp as readClientIp } from "@/lib/server/client-ip";
import { BodyTooLargeError, readJsonBody } from "@/lib/server/body";
import {
  adminCookieOptions,
  hashAdminPassword,
  validatePasswordPolicy,
  signAdminSession,
  getSessionCookieName,
  generateSessionId,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const rate = await rateLimitByIp(request.headers, "api:admin:bootstrap", 5, 15 * 60_000);
  if (!rate.allowed) return tooManyRequests(rate);

  try {
    const body = (await readJsonBody(request, 4 * 1024)) as Record<string, unknown> | null;
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email and password are required" },
        { status: 400 },
      );
    }

    if (
      !/^[A-Za-z0-9._-]{3,40}$/.test(username) ||
      !/^[^s@]+@[^s@]+.[^s@]+$/.test(email) ||
      email.length > 254 ||
      password.length > 128
    ) {
      return NextResponse.json(
        {
          error:
            "Use a 3-40 character username (letters, numbers, . _ -), a valid email and a password of at most 128 characters",
        },
        { status: 400 },
      );
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

    const { data: existingSuperAdmin, error: checkError } = await supabaseServer
      .from("admin_users")
      .select("id")
      .eq("role", "SUPER_ADMIN")
      .limit(1)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingSuperAdmin) {
      return NextResponse.json(
        { error: "SUPER_ADMIN already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await hashAdminPassword(password);
    const sessionId = generateSessionId();
    const clientIp =
      readClientIp(request.headers);

    const { data: created, error: insertError } = await supabaseServer
      .from("admin_users")
      .insert({
        username,
        email: String(email).toLowerCase(),
        password_hash: passwordHash,
        role: "SUPER_ADMIN",
        status: "active",
        current_session_token: sessionId,
        session_created_at: new Date().toISOString(),
        session_ip_address: clientIp,
      })
      .select("id, username, email, role")
      .single();

    // A concurrent bootstrap won the race: the partial unique index
    // idx_admin_users_single_super_admin rejects a second SUPER_ADMIN.
    if (insertError?.code === "23505") {
      return NextResponse.json(
        { error: "SUPER_ADMIN already exists" },
        { status: 409 },
      );
    }

    if (insertError || !created) {
      throw insertError || new Error("Failed to create SUPER_ADMIN");
    }

    const token = signAdminSession({
      adminId: created.id,
      username: created.username,
      email: created.email,
      role: created.role,
      sessionId,
    });

    const response = NextResponse.json({
      success: true,
      admin: created,
      message: "SUPER_ADMIN bootstrapped successfully",
    });

    response.cookies.set(getSessionCookieName(), token, adminCookieOptions());

    return response;
  } catch (error: any) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    console.error("Error bootstrapping admin:", error?.message);
    return NextResponse.json(
      { error: "Failed to bootstrap admin" },
      { status: 500 },
    );
  }
}
