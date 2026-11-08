// Deletes everything the security checks created: "sectest-" admin accounts, their
// audit-log lines, the storage probe file, and .env.sectest. Touches nothing else.
import { existsSync, rmSync } from "node:fs";
import { SECTEST_FILE, SUPABASE_URL, TEST_EMAIL, serviceHeaders, supabaseReachable } from "./lib.mjs";

const report = [];

if (await supabaseReachable()) {
  const h = serviceHeaders();
  const list = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?email=like.sectest-*&select=id,email`, { headers: h });
  const admins = (list.ok ? await list.json() : []).filter((a) => TEST_EMAIL.test(a.email));

  for (const admin of admins) {
    for (const column of ["actor_admin_id", "target_admin_id"]) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/admin_audit_logs?${column}=eq.${admin.id}`, { method: "DELETE", headers: { ...h, Prefer: "return=representation" } });
      report.push(res.ok ? `deleted ${(await res.json()).length} audit-log lines (${column} = ${admin.email})` : `couldn't delete audit-log lines for ${admin.email}: ${res.status}`);
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?id=eq.${admin.id}`, { method: "DELETE", headers: h });
    report.push(`${res.ok ? "deleted" : `FAILED (${res.status}) to delete`} test admin ${admin.email}`);
  }
  if (!admins.length) report.push("no test admins found");

  // The storage probe from S1 (normally removed straight away).
  const probe = await fetch(`${SUPABASE_URL}/storage/v1/object/blog-images`, { method: "DELETE", headers: h, body: JSON.stringify({ prefixes: ["sectest/probe.txt"] }) });
  report.push(`storage probe cleanup: ${probe.status}`);
} else {
  report.push(`couldn't reach ${SUPABASE_URL}; database rows (if any) left in place`);
}

if (existsSync(SECTEST_FILE)) {
  rmSync(SECTEST_FILE);
  report.push(`removed ${SECTEST_FILE}`);
}
console.log(report.join("\n"));
