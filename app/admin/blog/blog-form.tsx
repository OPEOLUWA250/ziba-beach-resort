"use client";

import React, { useState } from "react";
import { X, Loader, Upload, ImageIcon } from "lucide-react";
import { BlogPost } from "@/lib/blog-data";
import { uploadImage } from "@/lib/supabase/image-upload";

interface BlogFormProps {
  blog?: BlogPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BlogForm({ blog, onClose, onSuccess }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    category: blog?.category || "Proposals",
    featured_image: blog?.featured_image || "",
    author: blog?.author || "Ziba Beach Resort",
    read_time: blog?.read_time || 5,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "read_time" ? parseInt(value) || 0 : value,
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      setError("");
      const url = await uploadImage(file);
      console.log("Image uploaded successfully:", url);
      setFormData({ ...formData, featured_image: url });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to upload image";
      console.error("Image upload error:", errorMsg);
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.content) {
        setError("Title, slug, and content are required");
        setLoading(false);
        return;
      }

      const method = blog ? "PUT" : "POST";
      // Send blog ID for edit, use slug as fallback
      const url = blog ? `/api/blogs/${blog.id || blog.slug}` : "/api/blogs";

      console.log("Saving blog:", { method, url, formData });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save blog");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-4xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {blog ? "Edit Blog Post" : "Create New Blog Post"}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-900/30 border border-green-600 text-green-200 px-4 py-3 rounded-lg">
            Blog post {blog ? "updated" : "created"} successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-96 overflow-y-auto"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g., How to Plan a Beach Proposal"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Auto-generated from title"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              URL-friendly identifier
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary for blog list preview"
              rows={2}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
              disabled={loading}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Full blog post content (markdown supported)"
              rows={5}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.content.length} characters
            </p>
          </div>

          {/* Grid: Category & Read Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                disabled={loading}
              >
                <option value="Proposals">Proposals</option>
                <option value="Travel Tips">Travel Tips</option>
                <option value="Weddings">Weddings</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Read Time (minutes)
              </label>
              <input
                type="number"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image
            </label>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
              }`}
            >
              <input
                type="file"
                id="image-upload"
                onChange={handleFileInput}
                accept="image/*"
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader size={32} className="text-blue-500 animate-spin" />
                    <p className="text-sm text-gray-300">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-400" />
                    <p className="text-sm text-gray-300">
                      Drag and drop your image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG, WebP, GIF (max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Image Preview */}
            {formData.featured_image && (
              <div className="mt-4 flex items-start gap-4">
                <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden shrink-0 border border-gray-600">
                  <img
                    src={formData.featured_image}
                    alt="Featured image preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2 break-all">
                    {formData.featured_image}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, featured_image: "" })
                    }
                    className="text-sm px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g., Ziba Beach Resort"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Note: Data persistence requires Supabase database integration
        </p>
      </div>
    </div>
  );
}
