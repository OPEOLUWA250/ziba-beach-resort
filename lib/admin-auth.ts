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

export function signAdminSession(payload: AdminSessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "12h" });
}

export function verifyAdminSession(token: string): AdminSessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AdminSessionPayload;
  } catch {
    return null;
  }
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
    .select("id, username, email, role, status")
    .eq("id", session.adminId)
    .maybeSingle();

  if (!admin || admin.status !== "active") return null;
  return admin;
}
