"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadImage, deleteImage } from "@/lib/supabase/image-upload";

interface PopupFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    modal_cta_text?: string;
    dedicated_page_cta_text?: string;
    dedicated_page_cta_url?: string;
    tags?: string[];
    status?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function PopupForm({
  initialData,
  onSubmit,
  isLoading = false,
}: PopupFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      modal_cta_text: "",
      dedicated_page_cta_text: "",
      dedicated_page_cta_url: "",
      tags: [],
      status: "ACTIVE",
    },
  );

  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.featured_image || "",
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Auto-generate slug when title changes
  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-generate slug only if it's a new popup or slug is empty
      slug:
        !initialData?.id || !prev.slug
          ? generateSlugFromTitle(title)
          : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file, "blog-images");
      setFormData((prev) => ({
        ...prev,
        featured_image: imageUrl,
      }));
      setImagePreview(imageUrl);
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.featured_image && initialData?.featured_image) {
      try {
        await deleteImage(initialData.featured_image);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
    setFormData((prev) => ({
      ...prev,
      featured_image: "",
    }));
    setImagePreview("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const handleSlugGenerate = () => {
    const slug = generateSlugFromTitle(formData.title);
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.slug ||
      !formData.excerpt ||
      !formData.content ||
      !formData.featured_image
    ) {
      alert("All fields are required");
      return;
    }

    try {
      // Include ID if this is an update
      const dataToSubmit = {
        ...formData,
        ...(initialData?.id && { id: initialData.id }),
      };
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Popup Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g., Summer Beach Special Offer"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Slug */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-200">
            URL Slug
          </label>
          <button
            type="button"
            onClick={handleSlugGenerate}
            className="text-xs text-blue-400 hover:text-blue-300 transition"
          >
            Auto-generate from title
          </button>
        </div>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              slug: e.target.value,
            }))
          }
          placeholder="summer-beach-special"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Short Excerpt (for popup display)
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              excerpt: e.target.value,
            }))
          }
          placeholder="Brief description that appears on the homepage popup"
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Full Content */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Full Content (for details page)
        </label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
          placeholder="Detailed content about the offer/promotion"
          rows={8}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Featured Image
        </label>
        <div className="space-y-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded transition"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">
                  Click to upload or drag and drop
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="hidden"
              />
            </label>
          )}
          {isUploadingImage && (
            <p className="text-sm text-blue-400">Uploading image...</p>
          )}
        </div>
      </div>

      {/* Modal CTA Button */}
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4 mt-6">
          CTA Button (Popup Modal)
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={formData.modal_cta_text || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                modal_cta_text: e.target.value,
              }))
            }
            placeholder="e.g., Learn More"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            The button text on the popup modal (leads to dedicated page
            automatically)
          </p>
        </div>
      </div>

      {/* Dedicated Page CTA Button */}
      <div>
        <h3 className="text-lg font-medium text-gray-100 mb-4 mt-6">
          CTA Button (Dedicated Page)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={formData.dedicated_page_cta_text || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dedicated_page_cta_text: e.target.value,
                }))
              }
              placeholder="e.g., Book Now"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Button Link
            </label>
            <input
              type="url"
              value={formData.dedicated_page_cta_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dedicated_page_cta_url: e.target.value,
                }))
              }
              placeholder="e.g., https://example.com/booking"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Add
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400 transition"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              status: e.target.value,
            }))
          }
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading || isUploadingImage}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
        >
          {isLoading
            ? "Saving..."
            : initialData?.id
              ? "Update Popup"
              : "Create Popup"}
        </button>
      </div>
    </form>
  );
}
