import { after, NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { rateLimitByIp, rateLimitByKey } from "@/lib/security/rate-limit";
import { adminLoginSchema } from "@/lib/security/validators";
import { clientIp } from "@/lib/server/client-ip";
import { BodyTooLargeError, readJsonBody } from "@/lib/server/body";
import {
  adminCookieOptions,
  burnPasswordCheck,
  verifyAdminPassword,
  signAdminSession,
  getSessionCookieName,
  generateSessionId,
  logAdminAudit,
} from "@/lib/admin-auth";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// One answer for every wrong guess (unknown account, wrong password, disabled
// account), so the response never says which usernames exist.
const invalid = () =>
  NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
const locked = () =>
  NextResponse.json(
    {
      error: `Too many failed attempts. Try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
    },
    { status: 423 },
  );

export async function POST(request: NextRequest) {
  try {
    const rate = await rateLimitByIp(request.headers, "api:admin:login", 15, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }

    const body = await readJsonBody(request, 4 * 1024);
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid login payload" },
        { status: 400 },
      );
    }

    const { identifier, password } = parsed.data;
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const ip = clientIp(request.headers);

    const columns =
      "id, username, email, role, status, password_hash, failed_login_attempts, locked_until";
    const { data: byEmail } = await supabaseServer
      .from("admin_users")
      .select(columns)
      .eq("email", normalizedIdentifier)
      .maybeSingle();

    let admin = byEmail;
    if (!admin) {
      const { data: byUsername } = await supabaseServer
        .from("admin_users")
        .select(columns)
        .eq("username", identifier.trim())
        .maybeSingle();
      admin = byUsername;
    }

    if (!admin) {
      // Unknown accounts lock out after the same number of tries as real
      // ones, and take as long to refuse, so the two look identical.
      const guesses = await rateLimitByKey(
        "admin:login:unknown",
        normalizedIdentifier,
        MAX_LOGIN_ATTEMPTS,
        LOCKOUT_DURATION_MINUTES * 60_000,
      );
      if (!guesses.allowed) return locked();
      await burnPasswordCheck(password);
      return invalid();
    }

    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      return locked();
    }

    const validPassword = await verifyAdminPassword(password, admin.password_hash);

    if (!validPassword) {
      // A lock that has run out starts the count again.
      const lockExpired =
        admin.locked_until && new Date(admin.locked_until) <= new Date();
      const newAttempts = (lockExpired ? 0 : admin.failed_login_attempts || 0) + 1;
      const updates: Record<string, unknown> = {
        failed_login_attempts: newAttempts,
        locked_until: null,
      };
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        updates.locked_until = new Date(
          Date.now() + LOCKOUT_DURATION_MINUTES * 60_000,
        ).toISOString();
      }

      await supabaseServer.from("admin_users").update(updates).eq("id", admin.id);

      // Written after the reply, so a known account doesn't answer any slower.
      const adminId = admin.id as string;
      after(() =>
        logAdminAudit({
          actorAdminId: adminId,
          action: "AUTH_LOGIN_FAILED",
          metadata: { ip, attempts: newAttempts, locked: newAttempts >= MAX_LOGIN_ATTEMPTS },
        }),
      );

      return newAttempts >= MAX_LOGIN_ATTEMPTS ? locked() : invalid();
    }

    // The right password for a disabled account still gets the generic answer.
    if (admin.status !== "active") return invalid();

    // A new session id ends every earlier session for this account.
    const sessionId = generateSessionId();
    await supabaseServer
      .from("admin_users")
      .update({
        last_login: new Date().toISOString(),
        current_session_token: sessionId,
        session_created_at: new Date().toISOString(),
        session_ip_address: ip,
        failed_login_attempts: 0,
        locked_until: null,
      })
      .eq("id", admin.id);

    await logAdminAudit({
      actorAdminId: admin.id,
      action: "AUTH_LOGIN",
      metadata: { identifier: normalizedIdentifier, ip },
    });

    const token = signAdminSession({
      adminId: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      sessionId,
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
    response.cookies.set(getSessionCookieName(), token, adminCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return NextResponse.json({ error: "Invalid login payload" }, { status: 413 });
    }
    console.error(
      "Error logging in admin:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
