import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieOptions,
  endAdminSessions,
  getSessionAdmin,
  getSessionCookieName,
  logAdminAudit,
} from "@/lib/admin-auth";
import { clientIp } from "@/lib/server/client-ip";

/**
 * Signs the admin out on every device. Clearing this browser's cookie isn't
 * enough on its own: a copy of the cookie would keep working for 12 hours.
 */
export async function POST(request: NextRequest) {
  const admin = await getSessionAdmin(request).catch(() => null);
  if (admin) {
    await endAdminSessions(admin.id);
    await logAdminAudit({
      actorAdminId: admin.id,
      action: "AUTH_LOGOUT",
      metadata: { ip: clientIp(request.headers) },
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(getSessionCookieName(), "", adminCookieOptions(0));
  return response;
}
