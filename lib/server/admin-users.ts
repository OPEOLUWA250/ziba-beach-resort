import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionAdmin, logAdminAudit } from "@/lib/admin-auth";
import { clientIp } from "@/lib/server/client-ip";

export const ADMIN_STATUSES = ["active", "inactive", "locked"] as const;

const username = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9._-]{3,40}$/, "Use 3-40 letters, numbers, dots, dashes or underscores");
const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().max(128);

export const adminCreateSchema = z.object({
  username,
  email,
  password,
  role: z.enum(["SUPER_ADMIN", "ADMIN"]).default("ADMIN"),
  status: z.enum(ADMIN_STATUSES).default("active"),
});

export const adminUpdateSchema = z.object({
  username: username.optional(),
  email: email.optional(),
  password: password.optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]).optional(),
  status: z.enum(ADMIN_STATUSES).optional(),
});

type SessionAdmin = NonNullable<Awaited<ReturnType<typeof getSessionAdmin>>>;

/**
 * Gate for team management: a signed-in SUPER_ADMIN. An ordinary admin
 * reaching for it is refused and leaves a line in the audit log.
 */
export async function requireSuperAdmin(
  request: NextRequest,
): Promise<{ actor: SessionAdmin; response: null } | { actor: null; response: NextResponse }> {
  const actor = await getSessionAdmin(request);
  if (!actor) {
    return { actor: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (actor.role !== "SUPER_ADMIN") {
    await logAdminAudit({
      actorAdminId: actor.id,
      action: "ACCESS_DENIED",
      metadata: {
        attempted: `${request.method} ${request.nextUrl.pathname}`,
        ip: clientIp(request.headers),
      },
    });
    return { actor: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { actor, response: null };
}

/** Postgres unique-violation codes become a message people can act on. */
export function adminWriteError(error: { code?: string; message?: string } | null | undefined, fallback: string) {
  if (error?.code === "23505") {
    return NextResponse.json({ error: "That username or email is already in use" }, { status: 409 });
  }
  console.error("[admin-users]", error?.message ?? error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
