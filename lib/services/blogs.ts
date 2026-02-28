import { supabase } from "@/lib/supabase/client";

export async function getAllBlogs() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function createBlog(blogData: {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author?: string;
  category?: string;
  read_time?: number;
}) {
  try {
    const blogId = `blog-${Date.now()}`;

    const { data, error } = await supabase.from("blogs").insert({
      id: blogId,
      slug: blogData.slug,
      title: blogData.title,
      excerpt: blogData.excerpt || "",
      content: blogData.content,
      featured_image: blogData.featured_image || null,
      author: blogData.author || null,
      category: blogData.category || null,
      read_time: blogData.read_time || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (error) throw error;

    return { id: blogId, ...blogData };
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

export async function updateBlog(
  blogId: string,
  updates: Partial<{
    title: string;
    excerpt: string;
    content: string;
    featured_image: string;
    author: string;
    category: string;
    read_time: number;
  }>,
) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", blogId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

export async function deleteBlog(blogId: string) {
  try {
    const { error } = await supabase.from("blogs").delete().eq("id", blogId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

export async function getBlogsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("category", category)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return [];
  }
}
