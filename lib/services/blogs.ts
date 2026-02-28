import { supabase } from "@/lib/supabase/client";

export async function getAllBlogs() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("createdat", { ascending: false });

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
    const now = new Date().toISOString();

    const { error } = await supabase.from("blogs").insert({
      id: blogId,
      slug: blogData.slug,
      title: blogData.title,
      excerpt: blogData.excerpt || "",
      content: blogData.content,
      featured_image: blogData.featured_image || null,
      author: blogData.author || "Ziba Beach Resort",
      category: blogData.category || null,
      read_time: blogData.read_time || 5,
      createdat: now,
      updatedat: now,
    });

    if (error) throw error;

    return {
      id: blogId,
      slug: blogData.slug,
      title: blogData.title,
      excerpt: blogData.excerpt || "",
      content: blogData.content,
      featured_image: blogData.featured_image || null,
      author: blogData.author || "Ziba Beach Resort",
      category: blogData.category || null,
      read_time: blogData.read_time || 5,
      createdat: now,
      updatedat: now,
    };
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

export async function updateBlog(
  blogSlugOrId: string,
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
    // Update supports both ID and slug - try to match by slug first (from edit form)
    const { error } = await supabase
      .from("blogs")
      .update({
        ...updates,
        updatedat: new Date().toISOString(),
      })
      .or(`id.eq.${blogSlugOrId},slug.eq.${blogSlugOrId}`);

    if (error) throw error;

    console.log(`Blog updated (${blogSlugOrId}):`, updates);
    return { ...updates, updatedat: new Date().toISOString() };
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

export async function deleteBlog(blogIdOrSlug: string) {
  try {
    // Match by either ID or slug - accepts both from different sources
    const { error } = await supabase
      .from("blogs")
      .delete()
      .or(`id.eq.${blogIdOrSlug},slug.eq.${blogIdOrSlug}`);

    if (error) throw error;

    console.log(`Blog deleted (${blogIdOrSlug})`);
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
      .order("createdat", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return [];
  }
}
