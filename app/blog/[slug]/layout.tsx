import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getBlogBySlug } from "@/lib/services/blogs";

/** Each post shares with its own title, excerpt and featured image. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogBySlug(slug).catch(() => null)) as {
    title?: string;
    excerpt?: string;
    featured_image?: string | null;
  } | null;

  if (!post?.title) {
    return pageMetadata({
      title: "Blog",
      description: "Stories and ideas from Ziba Beach Resort, Lagos.",
      path: `/blog/${slug}`,
    });
  }
  // Site paths or full https addresses (e.g. Supabase Storage) both work as previews.
  const image = /^(\/|https:\/\/)/.test(post.featured_image || "")
    ? (post.featured_image as string)
    : undefined;
  return pageMetadata({
    title: post.title,
    description: (post.excerpt || "Stories and ideas from Ziba Beach Resort, Lagos.").slice(0, 200),
    path: `/blog/${slug}`,
    image,
    imageAlt: post.title,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
