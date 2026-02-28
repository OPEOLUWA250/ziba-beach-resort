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

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return Response.json({
      success: true,
      blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["title", "excerpt", "content", "category", "slug"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 },
        );
      }
    }

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: body.slug },
    });

    if (existingBlog) {
      return Response.json(
        {
          success: false,
          error: "A blog with this slug already exists",
        },
        { status: 400 },
      );
    }

    // Create blog in database
    const newBlog = await prisma.blog.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        featured_image: body.featured_image || "/ziba-blog/blog-1.jpg",
        author: body.author || "Ziba Beach Resort",
        category: body.category,
        read_time: body.read_time || 5,
        date: new Date(),
      },
    });

    return Response.json(
      {
        success: true,
        message: "Blog post created successfully",
        blog: newBlog,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create blog:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create blog",
      },
      { status: 500 },
    );
  }
}
