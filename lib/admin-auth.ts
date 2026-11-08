import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AdminSessionPayload {
  adminId: string;
  username: string;
  email: string;
  role: AdminRole;
  sessionId: string; // Unique identifier for this session
}

const SESSION_COOKIE_NAME = "ziba_admin_session";

function getJwtSecret() {
  const secret = process.env.ADMIN_AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_AUTH_JWT_SECRET is not configured");
  }
  return secret;
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export async function hashAdminPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyAdminPassword(
  password: string,
  passwordHash: string,
) {
  return bcrypt.compare(password, passwordHash);
}

export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

export function signAdminSession(payload: AdminSessionPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: ADMIN_SESSION_SECONDS,
  });
}

export function verifyAdminSession(token: string): AdminSessionPayload | null {
  try {
    // Pinned, so a token can't choose a weaker algorithm for itself.
    const payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    }) as AdminSessionPayload;
    return payload?.adminId && payload.sessionId ? payload : null;
  } catch {
    return null;
  }
}

/** Cookie settings shared by every route that signs an admin in or out. */
export function adminCookieOptions(maxAge = ADMIN_SESSION_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/*
 * A real bcrypt hash of a random password nobody knows. Sign-in compares
 * against it when the account doesn't exist, so a wrong username takes as
 * long to refuse as a wrong password and can't be told apart by timing.
 */
let dummyHash: Promise<string> | null = null;

export async function burnPasswordCheck(password: string) {
  dummyHash ??= bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);
  await bcrypt.compare(password, await dummyHash).catch(() => false);
}

/**
 * Ends every session this admin has, on every device: the next request made
 * with any existing cookie is refused. Used on sign-out, password changes and
 * deactivation.
 */
export async function endAdminSessions(adminId: string) {
  const { error } = await supabaseServer
    .from("admin_users")
    .update({ current_session_token: null })
    .eq("id", adminId);
  if (error) console.warn("[admin-auth] Couldn't end sessions:", error.message);
  return !error;
}

/** Records a staff action in admin_audit_logs. Never throws. */
export async function logAdminAudit(entry: {
  actorAdminId: string | null;
  action: string;
  targetAdminId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabaseServer.from("admin_audit_logs").insert({
    actor_admin_id: entry.actorAdminId,
    action: entry.action,
    target_admin_id: entry.targetAdminId ?? null,
    metadata: entry.metadata ?? {},
  });
  if (error) console.warn("[admin-auth] Audit log write failed:", error.message);
}

export function validatePasswordPolicy(password: string) {
  const hasMinLength = password.length >= 10;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

/**
 * Generate a unique session identifier
 * Used to track and invalidate sessions
 */
export function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Resolve the active admin from the session cookie on an API request.
 * Returns null if there is no valid, active admin session.
 * Use this to gate every admin-only API route.
 */
export async function getSessionAdmin(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return null;

  const session = verifyAdminSession(token);
  if (!session) return null;

  const { data: admin } = await supabaseServer
    .from("admin_users")
    .select("id, username, email, role, status, current_session_token")
    .eq("id", session.adminId)
    .maybeSingle();

  if (!admin || admin.status !== "active") return null;

  // Only the newest sign-in counts. Signing out, signing in elsewhere, a
  // password change or deactivation all change this, so a copied cookie
  // stops working at once instead of lasting its full 12 hours.
  const current = admin.current_session_token;
  if (
    typeof current !== "string" ||
    current.length !== session.sessionId.length ||
    !crypto.timingSafeEqual(Buffer.from(current), Buffer.from(session.sessionId))
  ) {
    return null;
  }

  return {
    id: admin.id as string,
    username: admin.username as string,
    email: admin.email as string,
    role: admin.role as AdminRole,
    status: admin.status as string,
  };
}
