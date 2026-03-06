"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Loader,
  AlertCircle,
} from "lucide-react";
import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/services/experiences";

interface Experience {
  id: string;
  name: string;
  price_per_person: number;
  category: "day-pass" | "honeymoon" | "team-building";
  description?: string;
  age_group?: string;
  available: boolean;
}

const ExperienceCard = ({
  experience,
  onEdit,
  onDelete,
  isUpdating,
}: {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const categoryColors = {
    "day-pass": "bg-blue-600",
    honeymoon: "bg-pink-600",
    "team-building": "bg-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 px-6 py-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {experience.name}
            </h3>
            <span
              className={`${categoryColors[experience.category]} text-white px-3 py-1 rounded-full text-xs font-semibold inline-block mt-2`}
            >
              {experience.category.replace("-", " ")}
            </span>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              experience.available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {experience.available ? "✓ Available" : "✗ Unavailable"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Price */}
        <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Price Per Person
          </p>
          <p className="text-3xl font-bold text-gray-900">
            ₦{experience.price_per_person.toLocaleString()}
          </p>
        </div>

        {/* Description */}
        {experience.description && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{experience.description}</p>
          </div>
        )}

        {/* Age Group */}
        {experience.age_group && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-900 uppercase tracking-wider mb-1">
              Age Group
            </p>
            <p className="text-sm font-medium text-yellow-900">
              {experience.age_group}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onEdit(experience)}
            disabled={isUpdating}
            className="w-full py-2 px-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isUpdating}
            className="w-full py-2 px-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Delete Experience
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-900 font-semibold mb-2">
                  {experience.name}
                </p>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete this experience? This action
                  cannot be undone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onDelete(experience.id);
                    setShowDeleteModal(false);
                  }}
                  disabled={isUpdating}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isUpdating}
                  className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition disabled:opacity-50 font-semibold"
                >
                  Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ExperiencesManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Experience | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const addonKeywords = ["massage", "horse", "paint", "lunch", "picnic"];

  const isAddOnExperience = (name: string) => {
    const normalizedName = name.toLowerCase();
    return addonKeywords.some((keyword) => normalizedName.includes(keyword));
  };

  const addOnExperiences = experiences.filter((exp) =>
    isAddOnExperience(exp.name),
  );
  const ticketExperiences = experiences.filter(
    (exp) => !isAddOnExperience(exp.name),
  );
  const premiumTickets = ticketExperiences.filter((exp) =>
    exp.name.toLowerCase().includes("plus"),
  );
  const normalTickets = ticketExperiences.filter(
    (exp) => !exp.name.toLowerCase().includes("plus"),
  );

  // Fetch experiences on mount
  useEffect(() => {
    const loadExperiences = async () => {
      setIsLoading(true);
      try {
        const data = await getAllExperiences();
        setExperiences(data);
      } catch (error) {
        console.error("Error loading experiences:", error);
        setErrorMessage("Failed to load experiences");
      } finally {
        setIsLoading(false);
      }
    };

    loadExperiences();
  }, []);

  const handleEdit = (experience: Experience) => {
    setFormData(experience);
    setEditingId(experience.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setIsUpdating(true);
    try {
      const result = await deleteExperience(id);
      if (result.success) {
        setExperiences(experiences.filter((exp) => exp.id !== id));
      } else {
        setErrorMessage(result.error || "Failed to delete experience");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsUpdating(true);
    try {
      const result = editingId
        ? await updateExperience(editingId, {
            name: formData.name,
            price_per_person: formData.price_per_person,
            category: formData.category,
            age_group: formData.age_group,
            description: formData.description,
            available: formData.available,
          })
        : await createExperience({
            name: formData.name,
            price_per_person: formData.price_per_person,
            category: formData.category,
            age_group: formData.age_group,
            description: formData.description,
            available: formData.available,
          });

      if (result.success) {
        const data = await getAllExperiences();
        setExperiences(data);
        setShowForm(false);
        setEditingId(null);
        setFormData(null);
      } else {
        setErrorMessage(result.error || "Failed to save experience");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      id: "",
      name: "",
      price_per_person: 0,
      category: "day-pass",
      age_group: "",
      available: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Day Pass Management
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Manage all-day pass experiences and ticketing options
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            disabled={isUpdating}
          >
            <Plus size={20} />
            Add Experience
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/30">
            <p className="text-blue-300 text-sm uppercase tracking-wider font-semibold mb-2">
              Total
            </p>
            <p className="text-4xl font-black text-white">
              {experiences.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-600/30 to-green-700/30 backdrop-blur-sm rounded-2xl p-5 border border-green-400/30">
            <p className="text-green-300 text-sm uppercase tracking-wider font-semibold mb-2">
              Available
            </p>
            <p className="text-4xl font-black text-green-400">
              {experiences.filter((e) => e.available).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-600/30 to-red-700/30 backdrop-blur-sm rounded-2xl p-5 border border-red-400/30">
            <p className="text-red-300 text-sm uppercase tracking-wider font-semibold mb-2">
              Unavailable
            </p>
            <p className="text-4xl font-black text-red-400">
              {experiences.filter((e) => !e.available).length}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-red-400 font-semibold">Error</p>
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader
              size={48}
              className="mx-auto mb-4 text-gray-500 animate-spin"
            />
            <p className="text-gray-400 text-lg">Loading experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg mb-2">No experiences found</p>
            <p className="text-gray-500 text-sm">
              Create your first experience to get started
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Normal Tickets
                </h2>
                <span className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-200 text-xs font-semibold border border-blue-700/40">
                  {normalTickets.length}
                </span>
              </div>
              {normalTickets.length === 0 ? (
                <p className="text-sm text-gray-400">No normal tickets yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {normalTickets.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isUpdating={isUpdating}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Premium Tickets
                </h2>
                <span className="px-3 py-1 rounded-full bg-purple-900/40 text-purple-200 text-xs font-semibold border border-purple-700/40">
                  {premiumTickets.length}
                </span>
              </div>
              {premiumTickets.length === 0 ? (
                <p className="text-sm text-gray-400">No premium tickets yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumTickets.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isUpdating={isUpdating}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Add-On Experiences
                </h2>
                <span className="px-3 py-1 rounded-full bg-green-900/40 text-green-200 text-xs font-semibold border border-green-700/40">
                  {addOnExperiences.length}
                </span>
              </div>
              {addOnExperiences.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No add-on experiences yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addOnExperiences.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isUpdating={isUpdating}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && formData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Experience" : "Add Experience"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData(null);
                  }}
                  className="text-white hover:bg-white/20 p-1 rounded transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Experience name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Price Per Person
                  </label>
                  <input
                    type="number"
                    value={formData.price_per_person}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_person: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Experience["category"],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="day-pass">Day Pass</option>
                    <option value="honeymoon">Honeymoon</option>
                    <option value="team-building">Team Building</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Age Group
                  </label>
                  <input
                    type="text"
                    value={formData.age_group}
                    onChange={(e) =>
                      setFormData({ ...formData, age_group: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 18+ years"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({ ...formData, available: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Available
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating || !formData.name}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData(null);
                    }}
                    className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
