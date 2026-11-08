import type { NextRequest } from "next/server";

export class BodyTooLargeError extends Error {
  constructor() {
    super("Request body too large");
  }
}

/**
 * Reads a JSON body of at most `maxBytes`. Every form on the site sends a
 * few kilobytes at most, so anything far larger didn't come from it and is
 * refused before it's parsed. Returns null for a missing or broken body.
 */
export async function readJsonBody(
  request: NextRequest,
  maxBytes: number,
): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new BodyTooLargeError();

  const raw = await request.text().catch(() => "");
  if (Buffer.byteLength(raw) > maxBytes) throw new BodyTooLargeError();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * The hidden "company_website" box on public forms. People never see it, so
 * it's always empty for them; bots that fill in every box give themselves away.
 */
export const HONEYPOT_FIELD = "company_website";

export function trippedHoneypot(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}
