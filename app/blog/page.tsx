"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import { getAllBlogPosts } from "@/lib/blog-data";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const categories = ["All", "Proposals", "Weddings", "Family", "Travel Tips"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const allPosts = getAllBlogPosts();

  const filteredPosts =
    selectedCategory === "All"
      ? allPosts
      : allPosts.filter((post) => post.category === selectedCategory);

  return (
    <>
      <Header />
      <PageHero
        title="Blog & Stories"
        subtitle="Insights, tips, and inspiration from the Ziba Beach Resort community"
      />
      <main className="bg-white">
        {/* Category Filter */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-light transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-blue-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col hover:border-blue-300">
                    {/* Featured Image */}
                    <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gray-100">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4">
                        <span className="inline-block bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-light">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col">
                      <h3
                        className="text-xl font-light text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-900 transition-colors"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {post.title}
                      </h3>

                      <p className="text-gray-600 font-light text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-light pb-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.read_time} min read</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="flex items-center gap-2 text-blue-900 font-light group-hover:gap-3 transition-all mt-4">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600 font-light text-lg">
                  No posts found in this category. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-4xl font-light text-gray-900 mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Stay Updated
            </h2>
            <p className="text-gray-600 font-light mb-8">
              Get the latest tips, stories, and updates from Ziba Beach Resort
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-light whitespace-nowrap w-full sm:w-auto">
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
