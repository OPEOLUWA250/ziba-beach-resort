import { getAllBlogs, createBlog } from "@/lib/services/blogs";
import {
  validateRequiredFields,
  handleSupabaseError,
} from "@/lib/supabase/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blogs = await getAllBlogs();

    return Response.json({
      success: true,
      blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    const { message, statusCode } = handleSupabaseError(error);
    return Response.json(
      {
        success: false,
        error: message,
      },
      { status: statusCode },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { valid, missingFields } = validateRequiredFields(body, [
      "title",
      "content",
      "slug",
    ]);

    if (!valid) {
      return Response.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const blog = await createBlog({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      featured_image: body.featured_image,
      author: body.author,
      category: body.category,
      read_time: body.read_time,
    });

    return Response.json(
      {
        success: true,
        blog,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create blog:", error);
    const { message, statusCode } = handleSupabaseError(error);
    return Response.json(
      {
        success: false,
        error: message,
      },
      { status: statusCode },
    );
  }
}
