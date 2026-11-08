// Shared helpers for the security checks in this folder.
// Run them against a LOCAL copy of the site only (see README.md here); never against the live site.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const REPO = fileURLToPath(new URL("../..", import.meta.url));

export function readEnv(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => /^[A-Z0-9_]+=/.test(l))
      .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]),
  );
}

export const local = readEnv(`${REPO}/.env.local`);
/** Test accounts; SECTEST_ENV_FILE points elsewhere if .env.sectest is in use. */
export const SECTEST_FILE = process.env.SECTEST_ENV_FILE || `${REPO}/.env.sectest`;
export const sectest = readEnv(SECTEST_FILE);
export const BASE = (process.env.SECTEST_BASE_URL || sectest.SECTEST_BASE_URL || "http://localhost:3200").replace(/\/+$/, "");
export const SUPABASE_URL = local.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
export const PUBLIC_KEY = local.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const TEST_EMAIL = /^sectest-[a-z0-9-]+@example\.com$/i;

/** The service key is used only by setup, cleanup and to read the audit log; never to attack. */
export function serviceHeaders() {
  const key = local.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing from .env.local");
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

if (/^https:\/\//.test(BASE) && !process.env.SECTEST_ALLOW_REMOTE) {
  console.error(`Refusing to run against ${BASE}: these checks are for a local copy. Set SECTEST_ALLOW_REMOTE=1 only if you really mean it.`);
  process.exit(2);
}

/** Tokens and cookies show as their first 6 characters. */
export const mask = (value) => (value == null ? String(value) : `${String(value).slice(0, 6)}…`);
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const results = [];
/**
 * Records one check. "refused" means the attack failed, which is good.
 * null means it couldn't be run, so it's not proven either way.
 */
export function record(id, attack, refused, evidence = "") {
  results.push({ id, attack, refused, evidence });
  const label = refused === null ? "NOT PROVEN" : refused ? "PASS" : "FAIL";
  console.log(`${label.padEnd(10)} ${id.padEnd(5)} ${attack}${evidence ? `  [${evidence}]` : ""}`);
}

export function summary() {
  const failed = results.filter((r) => r.refused === false).length;
  const unproven = results.filter((r) => r.refused === null).length;
  console.log(`\n${results.length - failed - unproven} passed, ${failed} failed, ${unproven} not proven.`);
  process.exitCode = failed ? 1 : 0;
  return results;
}

/** Turns Set-Cookie headers into a Cookie header. */
export function cookiesFrom(response, previous = "") {
  const jar = new Map(previous ? previous.split("; ").map((c) => [c.slice(0, c.indexOf("=")), c.slice(c.indexOf("=") + 1)]) : []);
  for (const line of response.headers.getSetCookie?.() ?? []) {
    const [pair] = line.split(";");
    const name = pair.slice(0, pair.indexOf("="));
    const value = pair.slice(pair.indexOf("=") + 1);
    if (!value || /max-age=0|expires=Thu, 01 Jan 1970/i.test(line)) jar.delete(name);
    else jar.set(name, value);
  }
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}

export async function adminLogin(identifier, password, headers = {}) {
  const res = await fetch(`${BASE}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ identifier, password }),
  });
  return { status: res.status, cookie: cookiesFrom(res), body: await res.text() };
}

/** True if the cookie opens an admin-only API. */
export async function seenAsAdmin(cookie) {
  const res = await fetch(`${BASE}/api/admin/bookings`, { headers: cookie ? { cookie } : {} });
  return res.status === 200;
}

/** Is the database this checkout points at reachable at all? */
export async function supabaseReachable() {
  if (!SUPABASE_URL) return false;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/`, { headers: { apikey: PUBLIC_KEY ?? "" }, signal: AbortSignal.timeout(8000) });
    return true;
  } catch {
    return false;
  }
}
