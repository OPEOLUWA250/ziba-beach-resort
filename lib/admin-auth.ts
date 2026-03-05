import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AdminSessionPayload {
  adminId: string;
  username: string;
  email: string;
  role: AdminRole;
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
