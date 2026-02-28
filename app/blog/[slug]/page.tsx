"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  MessageCircle,
  Mail,
} from "lucide-react";
import { use, useState, useEffect } from "react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  read_time: number;
  author: string;
  createdat: string;
}

export default function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`);
        const data = await response.json();
        if (data.success && data.blog) {
          setPost(data.blog);
          // Fetch all blogs to get related posts
          const allResponse = await fetch("/api/blogs");
          const allData = await allResponse.json();
          const related = (allData.blogs || [])
            .filter(
              (b: BlogPost) =>
                b.category === data.blog.category && b.id !== data.blog.id,
            )
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-white">
          <section className="px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 font-light">Loading blog post...</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="bg-white">
          <section className="px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                className="text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Post Not Found
              </h1>
              <p className="text-gray-600 font-light mb-8">
                The blog post you're looking for doesn't exist.
              </p>
              <Link
                href="/blog"
                className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-light"
              >
                Back to Blog
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Section with Featured Image */}
        <section className="relative w-full h-96 overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Back Button - Overlaid on Hero */}
          <div className="absolute top-24 left-4 sm:left-6 lg:left-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition font-light bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>

          {/* Category Badge - Top Right */}
          <div className="absolute top-6 right-4 sm:right-6 lg:right-8">
            <span className="inline-block bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-light">
              {post.category}
            </span>
          </div>
        </section>

        {/* Post Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-5xl font-light text-gray-900 mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 font-light">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.createdat).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-light">
                <Clock className="w-4 h-4" />
                <span>{post.read_time} min read</span>
              </div>
              <div className="text-gray-600 font-light">By {post.author}</div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-gray-600 font-light text-sm">Share:</span>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Mail className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MessageCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </section>

        {/* Post Content */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-12">
              {post.content
                .split("\n\n")
                .map((paragraph: string, i: number) => {
                  // Check if paragraph contains markdown list formatting
                  if (paragraph.startsWith("-")) {
                    // List items
                    return (
                      <ul key={i} className="list-disc list-inside mb-4">
                        {paragraph
                          .split("\n")
                          .map((item: string, k: number) => (
                            <li
                              key={k}
                              className="text-gray-700 font-light ml-4 mb-2"
                            >
                              {item.replace("- ", "")}
                            </li>
                          ))}
                      </ul>
                    );
                  }
                  // Regular paragraph
                  return (
                    <p
                      key={i}
                      className="text-gray-700 font-light leading-relaxed mb-6"
                    >
                      {paragraph}
                    </p>
                  );
                })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl font-light text-blue-900 mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready to Experience It?
            </h2>
            <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto">
              Visit Ziba Beach Resort and create unforgettable memories. From
              proposals to weddings to family getaways, we've got you covered.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="tel:+2347047300013"
                className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-light"
              >
                Call Us: +234 704 730 0013
              </a>
              <a
                href="mailto:bookings@zibabeachresort.com"
                className="inline-block bg-white text-blue-900 border border-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-light"
              >
                Email: bookings@zibabeachresort.com
              </a>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-4xl font-light text-blue-900 mb-12 text-center"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Related Posts
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 p-6 flex flex-col">
                        <h3
                          className="text-lg font-light text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 font-light text-sm mb-4 line-clamp-2 flex-1">
                          {relatedPost.excerpt}
                        </p>
                        <div className="text-xs text-gray-500 font-light">
                          {new Date(relatedPost.createdat).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}{" "}
                          • {relatedPost.read_time} min
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl font-light text-blue-900 mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Get More Stories Like This
            </h2>
            <p className="text-gray-600 font-light mb-8">
              Subscribe to our newsletter for the latest updates and inspiration
              from Ziba Beach Resort.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-light whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
