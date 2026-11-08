/*
 * Image uploads for the admin editors. Files go to /api/admin/uploads, which
 * checks the admin session and stores them with the server's key, so the
 * public key in the browser never needs permission to change storage.
 */

const VALID_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

async function errorFrom(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return new Error((data && typeof data.error === "string" && data.error) || fallback);
}

/**
 * Upload an image to Supabase Storage
 * @param file The image file to upload
 * @param bucket The storage bucket name (e.g., 'blog-images')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = "blog-images",
): Promise<string> {
  if (!file) throw new Error("No file selected");
  // Quick checks for a friendly message; the server checks the bytes too.
  if (!VALID_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload JPEG, PNG, WebP, or GIF");
  }
  if (file.size > MAX_SIZE) throw new Error("File size exceeds 5MB limit");

  const form = new FormData();
  form.append("file", file);
  form.append("bucket", bucket);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: form,
    credentials: "same-origin",
  });
  if (!response.ok) throw await errorFrom(response, "Upload failed");

  const { url } = (await response.json()) as { url: string };
  return url;
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl The public URL of the image to delete
 * @param bucket The storage bucket name
 */
export async function deleteImage(
  imageUrl: string,
  bucket: string = "blog-images",
): Promise<void> {
  const response = await fetch("/api/admin/uploads", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, bucket }),
    credentials: "same-origin",
  });
  if (!response.ok) throw await errorFrom(response, "Delete failed");
}
