import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";
import { logAdminAudit } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/*
 * Image uploads for the blog and popup editors. They used to go straight from
 * the browser to Supabase Storage with the public key, which only works if
 * anyone holding that key may upload and delete files. They now go through
 * here: a signed-in admin, the service key on the server, and checks on what
 * the file really is.
 */

const BUCKETS = new Set(["blog-images"]);
const FOLDER = "blog";
const MAX_BYTES = 5 * 1024 * 1024;

/** The file's real type from its first bytes; the browser's label can lie. */
function sniffImage(bytes: Uint8Array): { type: string; ext: string } | null {
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts(0xff, 0xd8, 0xff)) return { type: "image/jpeg", ext: "jpg" };
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { type: "image/png", ext: "png" };
  if (starts(0x47, 0x49, 0x46, 0x38)) return { type: "image/gif", ext: "gif" };
  if (
    starts(0x52, 0x49, 0x46, 0x46) &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { type: "image/webp", ext: "webp" };
  }
  return null;
}

function bucketFrom(value: unknown) {
  const bucket = typeof value === "string" && value ? value : "blog-images";
  return BUCKETS.has(bucket) ? bucket : null;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 413 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const bucket = bucketFrom(form?.get("bucket"));
  if (!bucket) return NextResponse.json({ error: "Unknown bucket" }, { status: 400 });
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file selected" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) {
    return NextResponse.json(
      { error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF" },
      { status: 400 },
    );
  }

  // The name is ours, never the uploader's, so it can't climb out of the folder.
  const path = `${FOLDER}/${Date.now()}-${crypto.randomUUID()}.${kind.ext}`;
  const { error } = await supabaseServer.storage.from(bucket).upload(path, bytes, {
    contentType: kind.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    console.error("[uploads] Upload failed:", error.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }

  const { data } = supabaseServer.storage.from(bucket).getPublicUrl(path);
  await logAdminAudit({
    actorAdminId: auth.admin.id,
    action: "IMAGE_UPLOAD",
    metadata: { bucket, path, bytes: file.size },
  });
  return NextResponse.json({ url: data.publicUrl });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.response) return auth.response;

  const body = (await request.json().catch(() => null)) as { url?: unknown; bucket?: unknown } | null;
  const bucket = bucketFrom(body?.bucket);
  const url = typeof body?.url === "string" ? body.url : "";
  if (!bucket || !url || url.length > 1000) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }

  // Only files in this bucket's folder, named as uploads are named.
  const name = url.split("?")[0].split("/").pop() || "";
  if (!/^[A-Za-z0-9._-]{1,200}$/.test(name) || name.startsWith(".")) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }
  const path = `${FOLDER}/${name}`;

  const { error } = await supabaseServer.storage.from(bucket).remove([path]);
  if (error) {
    console.error("[uploads] Delete failed:", error.message);
    return NextResponse.json({ error: "Delete failed" }, { status: 502 });
  }

  await logAdminAudit({
    actorAdminId: auth.admin.id,
    action: "IMAGE_DELETE",
    metadata: { bucket, path },
  });
  return NextResponse.json({ success: true });
}
