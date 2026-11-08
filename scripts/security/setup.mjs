// Creates a labelled test admin for the checks and writes it to .env.sectest (git-ignored).
// Only creates a new "sectest-" row; never changes existing ones. Undo with: npm run security:cleanup
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import bcrypt from "bcryptjs";
import { SECTEST_FILE, SUPABASE_URL, serviceHeaders, supabaseReachable } from "./lib.mjs";

if (existsSync(SECTEST_FILE)) {
  console.error(`${SECTEST_FILE} already exists. Run npm run security:cleanup first.`);
  process.exit(1);
}
if (!(await supabaseReachable())) {
  console.error(`Can't reach ${SUPABASE_URL}. Check NEXT_PUBLIC_SUPABASE_URL in .env.local (is the project paused or deleted?).`);
  process.exit(1);
}

const h = serviceHeaders();
const email = "sectest-check-admin@example.com";
const username = "sectest-check-admin";
// Meets the admin password policy: 10+ chars, upper, lower, number, symbol.
const password = `St-${randomBytes(12).toString("base64url")}-9a!`;

const res = await fetch(`${SUPABASE_URL}/rest/v1/admin_users`, {
  method: "POST",
  headers: { ...h, Prefer: "return=representation" },
  body: JSON.stringify({ username, email, password_hash: await bcrypt.hash(password, 12), role: "ADMIN", status: "active" }),
});
const body = await res.json();
if (!res.ok) throw new Error(`admin_users: ${res.status} ${JSON.stringify(body).slice(0, 200)}`);

writeFileSync(
  SECTEST_FILE,
  [
    "# Security check account. Deleted by npm run security:cleanup. Never commit.",
    "SECTEST_BASE_URL=http://localhost:3200",
    `SECTEST_ADMIN_ID=${body[0].id}`,
    `SECTEST_ADMIN_EMAIL=${email}`,
    `SECTEST_ADMIN_PASSWORD=${password}`,
    "",
  ].join("\n"),
);
console.log(`Created test admin ${email} (role ADMIN); wrote ${SECTEST_FILE}.`);
