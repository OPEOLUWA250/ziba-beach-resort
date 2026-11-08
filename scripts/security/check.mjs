// Security checks: each line tries an attack and prints PASS when the site refuses it.
// Needs: a local copy running at SECTEST_BASE_URL (see README.md); npm run security:setup for S3, S7, S8.
// Run at most once every 15 minutes: the last check uses up the admin sign-in limit on purpose.
import jwt from "jsonwebtoken";
import {
  BASE, PUBLIC_KEY, SUPABASE_URL, adminLogin, mask, record, sectest,
  seenAsAdmin, serviceHeaders, sleep, summary, supabaseReachable,
} from "./lib.mjs";

const startedAt = new Date().toISOString();
const json = { "Content-Type": "application/json" };
const admin = { id: sectest.SECTEST_ADMIN_ID, email: sectest.SECTEST_ADMIN_EMAIL, password: sectest.SECTEST_ADMIN_PASSWORD };
const dbUp = await supabaseReachable();

try {
  await fetch(`${BASE}/`, { signal: AbortSignal.timeout(15000) });
} catch {
  console.error(`Nothing answering at ${BASE}. Start the local copy first (README.md, step 1).`);
  process.exit(2);
}

// S1. Read guest/admin tables, or change stored images, with the public key from the browser bundle.
if (!dbUp || !PUBLIC_KEY) record("S1", "Read tables / write storage with the public key", null, `can't reach ${SUPABASE_URL}`);
else {
  const anon = { apikey: PUBLIC_KEY, Authorization: `Bearer ${PUBLIC_KEY}` };
  const tables = ["bookings", "day_pass_bookings", "honeymoon_bookings", "admin_users", "admin_audit_logs", "users", "paystack_events", "analytics_events", "operations_booking_notes"];
  const open = [];
  for (const table of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, { headers: anon });
    // 200 with [] can mean "allowed but empty" under RLS; only rows prove exposure, but a 200 still means the grant exists.
    if (res.ok) open.push(`${table}(${(await res.json()).length} rows)`);
  }
  const catalogueWrite = await fetch(`${SUPABASE_URL}/rest/v1/popups?id=eq.sectest-none`, { method: "PATCH", headers: { ...anon, ...json, Prefer: "return=minimal" }, body: JSON.stringify({ title: "sectest" }) });
  const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/blog-images/sectest/probe.txt`, { method: "POST", headers: { ...anon, "Content-Type": "text/plain", "x-upsert": "true" }, body: "sectest probe" });
  if (upload.ok) await fetch(`${SUPABASE_URL}/storage/v1/object/blog-images`, { method: "DELETE", headers: serviceHeaders(), body: JSON.stringify({ prefixes: ["sectest/probe.txt"] }) });
  const refused = open.length === 0 && !catalogueWrite.ok && !upload.ok;
  record("S1", "Read tables / write catalogue or storage with the public key", refused, [open.length ? `readable: ${open.join(", ")}` : `${tables.length} tables refused`, `popups write: ${catalogueWrite.status}`, `storage upload: ${upload.status}`].join("; "));
}

// S2. Forge an admin cookie: wrong secret, "none" algorithm, tampered signature.
{
  const payload = { adminId: admin.id || "00000000-0000-0000-0000-000000000000", username: "x", email: "x@example.com", role: "SUPER_ADMIN", sessionId: "a".repeat(64) };
  const wrongSecret = jwt.sign(payload, "not-the-secret", { expiresIn: "1h" });
  const none = `${Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}.`;
  const tampered = `${wrongSecret.slice(0, -4)}AAAA`;
  const accepted = [];
  for (const [label, token] of [["wrong secret", wrongSecret], ["alg none", none], ["tampered", tampered]]) {
    if (await seenAsAdmin(`ziba_admin_session=${token}`)) accepted.push(label);
  }
  record("S2", "Forged admin cookie (wrong secret / alg none / tampered)", accepted.length === 0, accepted.length ? `accepted: ${accepted.join(", ")}` : "3 forgeries refused");
}

// S3. Keep using a copied admin cookie after signing out.
let loginsUsed = 0;
if (!admin.email) record("S3", "Reuse an admin cookie after signing out", null, "no test admin: run npm run security:setup");
else if (!dbUp) record("S3", "Reuse an admin cookie after signing out", null, "database unreachable");
else {
  const { status, cookie } = await adminLogin(admin.email, admin.password);
  loginsUsed += 1;
  if (status !== 200) record("S3", "Reuse an admin cookie after signing out", null, `couldn't sign in (${status}); wait 15 minutes after the last run`);
  else {
    const before = await seenAsAdmin(cookie);
    await fetch(`${BASE}/api/admin/auth/logout`, { method: "POST", headers: { cookie } });
    const after = await seenAsAdmin(cookie);
    record("S3", "Reuse an admin cookie after signing out", before && !after, `cookie ${mask(cookie.split("=")[1])}: works before sign-out: ${before}, after: ${after}`);
  }
}

// S4. Frame the site from another site, and the other protective headers.
{
  const missing = [];
  for (const path of ["/", "/day-pass/checkout", "/admin-login", "/api/health"]) {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
    const h = (name) => res.headers.get(name) ?? "";
    const csp = h("content-security-policy");
    if (!/frame-ancestors 'none'/.test(csp)) missing.push(`${path} CSP frame-ancestors`);
    if (!/object-src 'none'/.test(csp) || !/base-uri 'self'/.test(csp)) missing.push(`${path} CSP object-src/base-uri`);
    if (h("x-frame-options") !== "DENY") missing.push(`${path} X-Frame-Options`);
    if (h("x-content-type-options") !== "nosniff") missing.push(`${path} nosniff`);
    if (!/max-age=\d+/.test(h("strict-transport-security"))) missing.push(`${path} HSTS`);
    if (!h("referrer-policy")) missing.push(`${path} Referrer-Policy`);
    if (!h("permissions-policy")) missing.push(`${path} Permissions-Policy`);
    if (h("x-powered-by")) missing.push(`${path} X-Powered-By sent`);
  }
  record("S4", "Frame the site / missing security headers", missing.length === 0, missing.length ? missing.join(", ") : "all headers present on 4 paths");
}

// S5. Oversized body and a filled-in bot trap on the public day-pass form. Never creates a booking.
{
  const form = { fullName: "Sectest Check", email: "sectest-check-form@example.com", phone: "+234 700 000 0000", visitDate: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10), items: [{ name: "Adult Day Pass Ticket", quantity: 1 }] };
  const big = await fetch(`${BASE}/api/day-pass/create`, { method: "POST", headers: json, body: JSON.stringify({ ...form, fullName: "x".repeat(200_000) }) });
  const trap = await fetch(`${BASE}/api/day-pass/create`, { method: "POST", headers: json, body: JSON.stringify({ ...form, company_website: "http://spam.example" }) });
  record("S5", "Oversized body / bot trap on the day-pass form", big.status === 413 && trap.status === 400, `200k body: ${big.status}; bot trap: ${trap.status}`);
}

// S6. Endpoints that need an admin session, a secret or a signature; removed endpoints stay gone.
{
  const checks = [
    ["/api/admin/bookings", {}, 401],
    ["/api/admin/users", {}, 401],
    ["/api/admin/insights", {}, 401],
    ["/api/admin/uploads", { method: "POST", body: new FormData() }, 401],
    ["/api/payments/diagnose", { method: "POST", headers: json, body: "{}" }, 401],
    ["/api/receipt/diagnostic", {}, 401],
    ["/api/migrate/blogs", { method: "POST" }, 401],
    ["/api/cron/guest-emails", {}, 401],
    ["/api/cron/reconcile-payments", { headers: { Authorization: "Bearer wrong" } }, 401],
    // 401 = bad signature; 500 = no Paystack key on this server. Either way the forged event is ignored.
    ["/api/webhooks/paystack", { method: "POST", headers: { ...json, "x-paystack-signature": "deadbeef" }, body: JSON.stringify({ event: "charge.success", data: { reference: "x" } }) }, [401, 500]],
    ["/api/auth/register", { method: "POST", headers: json, body: "{}" }, 404],
    ["/api/auth/login", { method: "POST", headers: json, body: "{}" }, 404],
  ];
  const wrong = [];
  for (const [path, init, expected] of checks) {
    const res = await fetch(`${BASE}${path}`, init);
    if (![expected].flat().includes(res.status)) wrong.push(`${path} → ${res.status}`);
  }
  record("S6", "Reach admin, cron and webhook endpoints without credentials", wrong.length === 0, wrong.length ? wrong.join(", ") : `${checks.length} refused`);
}

// S7. An ordinary admin reaching for team management is refused and logged.
if (!admin.email || !dbUp) record("S7", "Refused admin request leaves no trace in the audit log", null, !admin.email ? "no test admin" : "database unreachable");
else {
  const { status, cookie } = await adminLogin(admin.email, admin.password);
  loginsUsed += 1;
  if (status !== 200) record("S7", "Refused admin request leaves no trace in the audit log", null, `couldn't sign in (${status})`);
  else {
    const refused = await fetch(`${BASE}/api/admin/users`, { method: "POST", headers: { ...json, cookie }, body: JSON.stringify({ username: "sectest-x", email: "sectest-x@example.com", password: "Aa1!aaaaaaaa", role: "SUPER_ADMIN" }) });
    await fetch(`${BASE}/api/admin/auth/logout`, { method: "POST", headers: { cookie } });
    await sleep(1500);
    const log = await fetch(`${SUPABASE_URL}/rest/v1/admin_audit_logs?select=action&actor_admin_id=eq.${admin.id}&action=eq.ACCESS_DENIED&created_at=gte.${encodeURIComponent(startedAt)}`, { headers: serviceHeaders() });
    const rows = log.ok ? await log.json() : [];
    record("S7", "Refused admin request leaves no trace in the audit log", refused.status === 403 && rows.length > 0, `request: ${refused.status}; audit rows: ${log.ok ? rows.length : `query failed ${log.status}`}`);
  }
}

// S8. Tell real admin usernames from made-up ones by the answer or its timing.
if (!admin.email || !dbUp) record("S8", "Find which admin usernames exist", null, !admin.email ? "no test admin" : "database unreachable");
else {
  const time = async (identifier) => {
    const t = performance.now();
    const r = await adminLogin(identifier, "Wrong-password-1!");
    return { ms: performance.now() - t, status: r.status, body: r.body };
  };
  const real = [await time(admin.email), await time(admin.email)];
  const fake = [await time("sectest-nobody-x@example.com"), await time("sectest-nobody-x@example.com")];
  loginsUsed += 4;
  const same = real.every((r) => r.status === fake[0].status && r.body === fake[0].body);
  const avg = (xs) => xs.reduce((s, x) => s + x.ms, 0) / xs.length;
  const ratio = avg(fake) / avg(real);
  record("S8", "Find which admin usernames exist", same && ratio > 0.5, `same answer: ${same} (${real[0].status}/${fake[0].status}); unknown/real time ratio ${ratio.toFixed(2)}`);
  // Two wrong passwords on the test account; reset so a re-run can sign in.
  await fetch(`${SUPABASE_URL}/rest/v1/admin_users?id=eq.${admin.id}`, { method: "PATCH", headers: serviceHeaders(), body: JSON.stringify({ failed_login_attempts: 0, locked_until: null }) });
}

// S9. Dodge the per-address sign-in limit by inventing a new X-Forwarded-For each time. Last, because it uses the limit up.
{
  const statuses = [];
  for (let i = 0; i < 17 - loginsUsed; i++) {
    const res = await fetch(`${BASE}/api/admin/auth/login`, { method: "POST", headers: { ...json, "X-Forwarded-For": `198.51.100.${10 + i}`, "X-Real-IP": `198.51.100.${10 + i}` }, body: JSON.stringify({ identifier: `sectest-nobody-${i}@example.com`, password: "wrong-password" }) });
    statuses.push(res.status);
  }
  const blocked = statuses.filter((s) => s === 429).length;
  record("S9", "Rotate X-Forwarded-For to dodge the sign-in limit", blocked > 0, `${statuses.length} tries from "different" addresses: ${statuses.filter((s) => s !== 429).length} answered, ${blocked}×429`);
}

summary();
