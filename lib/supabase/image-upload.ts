import { supabase } from "./client";

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
  try {
    // Validate file
    if (!file) {
      throw new Error("No file selected");
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload JPEG, PNG, WebP, or GIF",
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${random}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`blog/${filename}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL - Supabase format
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/blog/${filename}`;

    console.log("Image uploaded:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
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
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];
    const filepath = `blog/${filename}`;

    const { error } = await supabase.storage.from(bucket).remove([filepath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}
