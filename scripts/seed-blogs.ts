import { PrismaClient } from "@prisma/client";
import { getAllBlogPosts } from "../lib/blog-data";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting blog seeding...");

    // Get all existing blogs from blog-data.ts
    const blogsToSeed = getAllBlogPosts();

    // Clear existing blogs (optional - comment out if you want to keep existing)
    // await prisma.blog.deleteMany({});

    for (const blog of blogsToSeed) {
      const existing = await prisma.blog.findUnique({
        where: { slug: blog.slug },
      });

      if (existing) {
        console.log(`⚠️  Blog "${blog.title}" already exists, skipping...`);
        continue;
      }

      const created = await prisma.blog.create({
        data: {
          id: blog.id,
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          featured_image: blog.featured_image,
          author: blog.author,
          category: blog.category,
          read_time: blog.read_time,
          date: new Date(blog.date),
        },
      });

      console.log(`✅ Created blog: "${created.title}"`);
    }

    console.log("✨ Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
