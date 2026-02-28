"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  Eye,
  Copy,
  AlertCircle,
} from "lucide-react";
import { BlogPost } from "@/lib/blog-data";
import BlogForm from "./blog-form";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setShowDeleteConfirm(null);
        setSuccessMessage("Blog deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(blogs.map((b) => b.category))];

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">Blog Management</h1>
            <button
              onClick={() => {
                setEditingBlog(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={20} />
              New Blog Post
            </button>
          </div>
          <p className="text-gray-400">
            Manage all blog posts with full CRUD capabilities
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-900/30 border border-green-600 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {successMessage}
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-3 text-gray-500 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Loading blogs...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No blogs found.{" "}
              {blogs.length === 0 && "Start by creating your first blog post!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Read Time
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <p className="text-white font-medium truncate">
                            {blog.title}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {blog.excerpt}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-blue-900/30 text-blue-300 px-3 py-1 rounded text-sm">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {blog.author}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {blog.date}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {blog.read_time} min
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingBlog(blog);
                              setShowForm(true);
                            }}
                            className="p-2 hover:bg-blue-600/20 text-blue-400 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(blog.id)}
                            className="p-2 hover:bg-red-600/20 text-red-400 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Blogs</p>
            <p className="text-2xl font-bold text-white">{blogs.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Proposal Blogs</p>
            <p className="text-2xl font-bold text-white">
              {blogs.filter((b) => b.category === "Proposals").length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Travel Tips</p>
            <p className="text-2xl font-bold text-white">
              {blogs.filter((b) => b.category === "Travel Tips").length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Weddings</p>
            <p className="text-2xl font-bold text-white">
              {blogs.filter((b) => b.category === "Weddings").length}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Delete Blog?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBlog(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <BlogForm
          blog={editingBlog}
          onClose={() => {
            setShowForm(false);
            setEditingBlog(null);
          }}
          onSuccess={() => {
            setSuccessMessage("Blog post saved successfully!");
            fetchBlogs();
            setTimeout(() => setSuccessMessage(""), 3000);
          }}
        />
      )}
    </div>
  );
}
