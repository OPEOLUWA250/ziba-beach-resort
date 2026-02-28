import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({
      where: { slug: id },
    });

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
    return Response.json(
      {
        success: false,
        error: "Failed to fetch blog",
      },
      { status: 500 },
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

    const existingBlog = await prisma.blog.findUnique({
      where: { slug: id },
    });

    if (!existingBlog) {
      return Response.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 },
      );
    }

    // Check if new slug conflicts with existing blog
    if (body.slug && body.slug !== id) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug: body.slug },
      });
      if (slugExists) {
        return Response.json(
          {
            success: false,
            error: "A blog with this slug already exists",
          },
          { status: 400 },
        );
      }
    }

    // Update blog in database
    const updatedBlog = await prisma.blog.update({
      where: { slug: id },
      data: {
        slug: body.slug || existingBlog.slug,
        title: body.title || existingBlog.title,
        excerpt: body.excerpt || existingBlog.excerpt,
        content: body.content || existingBlog.content,
        featured_image: body.featured_image || existingBlog.featured_image,
        author: body.author || existingBlog.author,
        category: body.category || existingBlog.category,
        read_time: body.read_time || existingBlog.read_time,
      },
    });

    return Response.json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Failed to update blog:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update blog",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existingBlog = await prisma.blog.findUnique({
      where: { slug: id },
    });

    if (!existingBlog) {
      return Response.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 },
      );
    }

    // Delete blog from database
    await prisma.blog.delete({
      where: { slug: id },
    });

    return Response.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete blog",
      },
      { status: 500 },
    );
  }
}
