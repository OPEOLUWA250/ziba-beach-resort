"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Search, Eye } from "lucide-react";
import Link from "next/link";
import { PopupForm } from "./popup-form";
import { PopupData } from "@/lib/services/popups";

interface PopupFull extends PopupData {
  id: string;
  createdAt: string;
}

export default function AdminPopupsPage() {
  const [popups, setPopups] = useState<PopupFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupFull | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/popups");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch popups (${response.status})`,
        );
      }

      setPopups(data.popups || []);
    } catch (error: any) {
      console.error("Error loading popups:", error);
      alert(`Error loading popups: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Deactivate all other active popups when setting one to ACTIVE
  const deactivateOthersIfNeeded = async (newFormData: any) => {
    if (newFormData.status === "ACTIVE") {
      // Deactivate all other ACTIVE popups
      const activePopups = popups.filter(
        (p) => p.status === "ACTIVE" && p.id !== newFormData.id,
      );

      for (const popup of activePopups) {
        try {
          await fetch(`/api/popups/${popup.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "INACTIVE" }),
          });
        } catch (error) {
          console.error("Error deactivating popup:", error);
        }
      }
    }
  };

  const handleCreatePopup = async (formData: any) => {
    try {
      setIsFormLoading(true);

      // If making this ACTIVE, deactivate others
      if (formData.status === "ACTIVE") {
        const activePopups = popups.filter((p) => p.status === "ACTIVE");
        for (const popup of activePopups) {
          try {
            await fetch(`/api/popups/${popup.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "INACTIVE" }),
            });
          } catch (error) {
            console.error("Error deactivating popup:", error);
          }
        }
      }

      const response = await fetch("/api/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to create popup (${response.status})`,
        );
      }

      alert("Popup created successfully!");
      setShowCreateForm(false);
      await fetchPopups();
    } catch (error: any) {
      console.error("Create popup error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleUpdatePopup = async (formData: any) => {
    try {
      setIsFormLoading(true);

      // If making this ACTIVE, deactivate others
      if (formData.status === "ACTIVE") {
        const activePopups = popups.filter(
          (p) => p.status === "ACTIVE" && p.id !== editingPopup?.id,
        );
        for (const popup of activePopups) {
          try {
            await fetch(`/api/popups/${popup.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "INACTIVE" }),
            });
          } catch (error) {
            console.error("Error deactivating popup:", error);
          }
        }
      }

      const response = await fetch(`/api/popups/${editingPopup?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to update popup (${response.status})`,
        );
      }

      alert("Popup updated successfully!");
      setEditingPopup(null);
      setShowCreateForm(false);
      await fetchPopups();
    } catch (error: any) {
      console.error("Update popup error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeletePopup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this popup?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/popups/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to delete popup (${response.status})`,
        );
      }

      alert("Popup deleted successfully!");
      setShowCreateForm(false);
      setEditingPopup(null);
      await fetchPopups();
    } catch (error: any) {
      console.error("Delete popup error:", error);
      alert(`Error deleting popup: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPopups = popups.filter(
    (popup) =>
      popup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      popup.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (showCreateForm || editingPopup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-light text-white cormorant">
            {editingPopup ? "Edit Popup" : "Create New Popup"}
          </h1>
          <button
            onClick={() => {
              setShowCreateForm(false);
              setEditingPopup(null);
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            Cancel
          </button>
        </div>
        <PopupForm
          initialData={editingPopup || undefined}
          onSubmit={editingPopup ? handleUpdatePopup : handleCreatePopup}
          isLoading={isFormLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light text-white cormorant">
          Popup Offers
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={20} />
          New Popup
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search popups by title or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Popups List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading popups...</div>
      ) : filteredPopups.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {searchTerm
            ? "No popups found matching your search"
            : "No popups yet"}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPopups.map((popup) => (
            <div
              key={popup.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition"
            >
              <div className="flex gap-4">
                {/* Image */}
                {popup.featured_image && (
                  <img
                    src={popup.featured_image}
                    alt={popup.title}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {popup.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">{popup.slug}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {popup.excerpt}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                        popup.status === "ACTIVE"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {popup.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/popups/${popup.slug}`}
                      target="_blank"
                      className="p-2 text-green-400 hover:bg-green-900/20 rounded transition"
                      title="View Popup Details"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => {
                        setEditingPopup(popup as PopupFull);
                        setShowCreateForm(false);
                      }}
                      className="p-2 text-blue-400 hover:bg-blue-900/20 rounded transition disabled:opacity-50"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePopup(popup.id)}
                      disabled={deletingId === popup.id}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Popups</p>
          <p className="text-3xl font-bold text-white">{popups.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-400">
            {popups.filter((p) => p.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Inactive</p>
          <p className="text-3xl font-bold text-red-400">
            {popups.filter((p) => p.status !== "ACTIVE").length}
          </p>
        </div>
      </div>
    </div>
  );
}
