import { createClient } from "@supabase/supabase-js";
import { blogPosts } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { success: false, error: "Missing Supabase credentials" },
        { status: 500 },
      );
    }

    // Use admin client to bypass RLS
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });

    console.log(`Starting migration of ${blogPosts.length} blogs...`);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const blog of blogPosts) {
      try {
        const { error } = await adminSupabase.from("blogs").insert({
          id: blog.id,
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          featured_image: blog.featured_image,
          author: blog.author,
          category: blog.category,
          read_time: blog.read_time,
          createdat: new Date(blog.date).toISOString(),
          updatedat: new Date().toISOString(),
        });

        if (error) {
          results.failed++;
          results.errors.push({
            blog: blog.title,
            error: error.message,
          });
          console.error(`❌ Error inserting blog "${blog.title}":`, error);
        } else {
          results.success++;
          console.log(`✅ Migrated: ${blog.title}`);
        }
      } catch (err) {
        results.failed++;
        results.errors.push({
          blog: blog.title,
          error: String(err),
        });
      }
    }

    return Response.json(
      {
        success: true,
        message: `Migration completed: ${results.success} succeeded, ${results.failed} failed`,
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Migration failed:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Migration failed",
      },
      { status: 500 },
    );
  }
}
