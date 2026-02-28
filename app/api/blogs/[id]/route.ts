import { getBlogBySlug, updateBlog, deleteBlog } from "@/lib/services/blogs";
import { handleSupabaseError } from "@/lib/supabase/utils";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const blog = await getBlogBySlug(id);

    if (!blog) {
      return Response.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Failed to fetch blog:", error);
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await updateBlog(id, body);

    return Response.json({
      success: true,
      message: "Blog updated",
    });
  } catch (error) {
    console.error("Failed to update blog:", error);
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log(`[DELETE /api/blogs] Attempting to delete: ${id}`);

    await deleteBlog(id);

    console.log(`[DELETE /api/blogs] Successfully deleted: ${id}`);
    return Response.json({
      success: true,
      message: "Blog deleted",
    });
  } catch (error) {
    console.error("[DELETE /api/blogs] Failed to delete blog:", error);
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
