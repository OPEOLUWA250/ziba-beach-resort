"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  status: "active" | "inactive" | "locked";
  last_login?: string | null;
  created_by?: string | null;
  created_at: string;
}

interface SessionAdmin {
  id: string;
  username: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

export default function AdminSystemPage() {
  const [sessionAdmin, setSessionAdmin] = useState<SessionAdmin | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "ADMIN",
    status: "active",
  });

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "ADMIN",
    status: "active",
  });

  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const isSuperAdmin = sessionAdmin?.role === "SUPER_ADMIN";

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [meRes, usersRes] = await Promise.all([
        fetch("/api/admin/auth/me", { credentials: "include" }),
        fetch("/api/admin/users", { credentials: "include" }),
      ]);

      if (!meRes.ok) {
        throw new Error("Not authenticated");
      }

      const meData = await meRes.json();
      setSessionAdmin(meData.admin || null);

      if (!usersRes.ok) {
        const payload = await usersRes.json();
        throw new Error(payload.error || "Failed to fetch admins");
      }

      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
    } catch (err: any) {
      setError(err.message || "Failed to load admin system");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeCount = useMemo(
    () => users.filter((u) => u.status === "active").length,
    [users],
  );

  const superAdminCount = useMemo(
    () => users.filter((u) => u.role === "SUPER_ADMIN").length,
    [users],
  );

  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;

    try {
      setSaving(true);
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(createForm),
      });

      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Failed to create admin");

      setShowCreate(false);
      setCreateForm({
        username: "",
        email: "",
        password: "",
        role: "ADMIN",
        status: "active",
      });
      await fetchData();
      showSuccess("Admin created successfully");
    } catch (err: any) {
      setError(err.message || "Failed to create admin");
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !editingUser) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Failed to update admin");

      setEditingUser(null);
      await fetchData();
      showSuccess("Admin updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update admin");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!isSuperAdmin) return;
    if (!window.confirm(`Delete admin ${user.username}?`)) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Failed to delete admin");

      await fetchData();
      showSuccess("Admin deleted successfully");
    } catch (err: any) {
      setError(err.message || "Failed to delete admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white cormorant">
            Admin System
          </h1>
          <p className="text-gray-400">
            SUPER_ADMIN controlled admin management
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus size={16} /> New Admin
          </button>
        )}
      </div>

      {message && (
        <div className="bg-green-900/30 border border-green-900/50 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-green-400" />
          <p className="text-green-400">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Admins</p>
          <p className="text-white text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Admins</p>
          <p className="text-green-400 text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">SUPER_ADMIN</p>
          <p className="text-blue-400 text-2xl font-bold">{superAdminCount}</p>
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-4 text-amber-300 text-sm">
          You are logged in as ADMIN. Only SUPER_ADMIN can create/edit/delete
          admins.
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="bg-gray-950 p-4 border-b border-gray-700 flex items-center gap-2">
          <Users size={18} className="text-blue-400" />
          <h2 className="text-white font-semibold">Admin Users</h2>
        </div>
        {loading ? (
          <div className="p-8 text-gray-400">Loading admins...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900/40">
                  <th className="px-4 py-3 text-left text-gray-400">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-gray-400">Role</th>
                  <th className="px-4 py-3 text-left text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-gray-400">
                    Last Login
                  </th>
                  <th className="px-4 py-3 text-left text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700 hover:bg-gray-700/20"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "SUPER_ADMIN"
                            ? "bg-blue-900/40 text-blue-300"
                            : "bg-gray-700 text-gray-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-green-900/40 text-green-300"
                            : user.status === "locked"
                              ? "bg-red-900/40 text-red-300"
                              : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => beginEdit(user)}
                              className="p-2 rounded-md bg-blue-900/30 text-blue-300 hover:bg-blue-900/50"
                              title="Edit admin"
                            >
                              <Edit2 size={14} />
                            </button>
                            {user.role !== "SUPER_ADMIN" && (
                              <button
                                onClick={() => handleDelete(user)}
                                className="p-2 rounded-md bg-red-900/30 text-red-300 hover:bg-red-900/50"
                                title="Delete admin"
                                disabled={saving}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </>
                        )}
                        {!isSuperAdmin && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Shield size={12} /> SUPER_ADMIN only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && isSuperAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Create Admin</h3>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
              placeholder="Username"
              value={createForm.username}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, username: e.target.value }))
              }
              required
            />
            <input
              type="password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
              placeholder="Email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
            <div className="relative">
              <input
                type={showCreatePassword ? "text" : "password"}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white"
                placeholder="Password (min 10 chars, uppercase, lowercase, number, special char)"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, password: e.target.value }))
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowCreatePassword(!showCreatePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showCreatePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, role: e.target.value }))
                }
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                value={createForm.status}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, status: e.target.value }))
                }
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="locked">locked</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-900 text-white"
              >
                {saving ? "Saving..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingUser && isSuperAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleEdit}
            className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Edit Admin</h3>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
              placeholder="Username"
              value={editForm.username}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, username: e.target.value }))
              }
              required
            />
            <input
              type="password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
            <div className="relative">
              <input
                type={showEditPassword ? "text" : "password"}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white"
                placeholder="New password (leave blank to keep current)"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, password: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={() => setShowEditPassword(!showEditPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                {editingUser?.role === "SUPER_ADMIN" ? (
                  <div className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white flex items-center cursor-not-allowed opacity-60">
                    <span className="text-blue-300 font-medium">SUPER_ADMIN</span>
                    <span className="text-xs text-gray-500 ml-auto">(Immutable)</span>
                  </div>
                ) : (
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, role: e.target.value }))
                    }
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                )}
              </div>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, status: e.target.value }))
                }
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="locked">locked</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-900 text-white"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
