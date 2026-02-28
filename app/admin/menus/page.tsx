"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Trash2, Edit2, Plus, X } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceNGN: number;
  isActive: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  timing: string;
  note: string;
  isActive: boolean;
  items: MenuItem[];
}

export default function AdminMenusPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceNGN: 0,
  });

  // Fetch menu categories
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/menus");
        if (!res.ok) throw new Error("Failed to fetch menus");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err: any) {
        setError(err.message || "Failed to load menus");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Update menu item
  const handleUpdateItem = async (categoryId: string, item: MenuItem) => {
    try {
      const res = await fetch(`/api/menus/${categoryId}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Failed to update item");

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.map((i) => (i.id === item.id ? item : i)),
              }
            : cat,
        ),
      );

      setEditingItem(null);
      setFormData({ name: "", description: "", priceNGN: 0 });
    } catch (err: any) {
      setError(err.message || "Failed to update item");
    }
  };

  // Delete menu item
  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    if (!confirm("Delete this menu item?")) return;

    try {
      const res = await fetch(`/api/menus/${categoryId}/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete item");

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
            : cat,
        ),
      );
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    }
  };

  // Add new menu item
  const handleAddItem = async (categoryId: string) => {
    if (!formData.name || formData.priceNGN === undefined) {
      setError("Name and price are required");
      return;
    }

    try {
      const res = await fetch(`/api/menus/${categoryId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add item");
      const newItem = await res.json();

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, newItem] }
            : cat,
        ),
      );

      setShowAddItem(null);
      setFormData({ name: "", description: "", priceNGN: 0 });
    } catch (err: any) {
      setError(err.message || "Failed to add item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-700 text-sm mb-2 block"
            >
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Menu Management
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-blue-900 mb-1">
                  {category.name}
                </h2>
                <p className="text-sm text-blue-700">{category.timing}</p>
                {category.note && (
                  <p className="text-sm text-blue-600 mt-2 italic">
                    {category.note}
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {category.items.map((item) =>
                  editingItem?.id === item.id ? (
                    // Edit Mode
                    <div
                      key={item.id}
                      className="p-6 bg-amber-50 border-l-4 border-amber-400"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 block mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter item name"
                            value={editingItem.name}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 block mb-1">
                            Price (NGN)
                          </label>
                          <input
                            type="number"
                            placeholder="Enter price"
                            value={editingItem.priceNGN}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                priceNGN: parseFloat(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-xs font-semibold text-gray-700 block mb-1">
                          Description
                        </label>
                        <textarea
                          placeholder="Enter item description"
                          value={editingItem.description || ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateItem(category.id, editingItem)
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors flex items-start justify-between group"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <span className="text-lg font-bold text-blue-600">
                            ₦{item.priceNGN.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(category.id, item.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Add Item Form */}
              {showAddItem === category.id ? (
                <div className="p-6 bg-green-50 border-t border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">
                    Add New Item
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter item name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Price (NGN)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={formData.priceNGN}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priceNGN: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter item description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddItem(category.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => {
                        setShowAddItem(null);
                        setFormData({ name: "", description: "", priceNGN: 0 });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddItem(category.id)}
                  className="w-full p-6 text-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 border-t border-gray-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Item to {category.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
