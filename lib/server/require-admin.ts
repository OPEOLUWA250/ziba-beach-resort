import { NextRequest, NextResponse } from "next/server";
import { getSessionAdmin } from "@/lib/admin-auth";

type Admin = NonNullable<Awaited<ReturnType<typeof getSessionAdmin>>>;

/**
 * Gate an API route on a valid, active admin session.
 * Usage: const auth = await requireAdmin(request); if (auth.response) return auth.response;
 */
export async function requireAdmin(
  request: NextRequest,
): Promise<{ admin: Admin; response: null } | { admin: null; response: NextResponse }> {
  const admin = await getSessionAdmin(request);
  if (!admin) {
    return {
      admin: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { admin, response: null };
}
