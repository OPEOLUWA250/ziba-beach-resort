"use client";

import React, { useState } from "react";
import {
  Users,
  Lock,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const mockAdminUsers = [
  {
    id: 1,
    name: "Chinedu Okezie",
    email: "chinedu@zibaresort.com",
    role: "Owner",
    status: "active",
    lastLogin: "Feb 26, 2:30 PM",
    joinedDate: "Jan 1, 2024",
  },
  {
    id: 2,
    name: "Tayo Adeyemi",
    email: "tayo@zibaresort.com",
    role: "Manager",
    status: "active",
    lastLogin: "Feb 26, 11:00 AM",
    joinedDate: "Jan 15, 2024",
  },
  {
    id: 3,
    name: "Zainab Hassan",
    email: "zainab@zibaresort.com",
    role: "Staff",
    status: "active",
    lastLogin: "Feb 25, 4:15 PM",
    joinedDate: "Feb 1, 2024",
  },
  {
    id: 4,
    name: "Emeka Nwankwo",
    email: "emeka@zibaresort.com",
    role: "Staff",
    status: "inactive",
    lastLogin: "Feb 10, 9:30 AM",
    joinedDate: "Jan 20, 2024",
  },
];

const mockActivityLog = [
  {
    id: 1,
    user: "Chinedu Okezie",
    action: "Created new booking",
    details: "Booking #2024-045",
    timestamp: "Feb 26, 2:15 PM",
    type: "create",
  },
  {
    id: 2,
    user: "Tayo Adeyemi",
    action: "Updated room rates",
    details: "Increased Ocean View Suite by 5%",
    timestamp: "Feb 26, 1:45 PM",
    type: "update",
  },
  {
    id: 3,
    user: "Zainab Hassan",
    action: "Marked maintenance completed",
    details: "Room 305 repairs finished",
    timestamp: "Feb 26, 12:30 PM",
    type: "maintenance",
  },
  {
    id: 4,
    user: "Chinedu Okezie",
    action: "Deleted guest review",
    details: "Spam review removed",
    timestamp: "Feb 26, 10:20 AM",
    type: "delete",
  },
  {
    id: 5,
    user: "Tayo Adeyemi",
    action: "Generated revenue report",
    details: "Monthly report exported",
    timestamp: "Feb 25, 3:50 PM",
    type: "report",
  },
];

const permissions = {
  Owner: [
    "View all data",
    "Manage all bookings",
    "Manage staff",
    "Financial reports",
    "System settings",
    "Delete data",
  ],
  Manager: [
    "View all data",
    "Manage bookings",
    "Guest management",
    "Financial reports",
    "View activity log",
  ],
  Staff: [
    "View assigned bookings",
    "Check-in/Check-out",
    "Housekeeping tasks",
    "Basic reporting",
  ],
};

export default function AdminSystem() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<
    (typeof mockAdminUsers)[0] | null
  >(null);

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-900/30 text-green-400"
      : "bg-gray-700/30 text-gray-400";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-purple-900/30 text-purple-400";
      case "Manager":
        return "bg-blue-900/30 text-blue-400";
      case "Staff":
        return "bg-gray-700/30 text-gray-400";
      default:
        return "bg-gray-700/30 text-gray-400";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return "➕";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      case "maintenance":
        return "🔧";
      case "report":
        return "📊";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white cormorant">
          Admin System
        </h1>
        <p className="text-gray-400">
          Manage admin users, roles, and permissions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "users"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Users size={18} />
          Admin Users
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "roles"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Shield size={18} />
          Roles & Permissions
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "activity"
              ? "text-white border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Activity size={18} />
          Activity Log
        </button>
      </div>

      {/* Admin Users Tab */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="bg-gray-950 p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-bold">Admin Users</h3>
              <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition">
                <Plus size={16} />
                Add User
              </button>
            </div>

            <div className="divide-y divide-gray-700">
              {mockAdminUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 cursor-pointer transition ${
                    selectedUser?.id === user.id
                      ? "bg-blue-900/20 border-l-2 border-blue-500"
                      : "hover:bg-gray-700/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{user.name}</h4>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">
                      Last: {user.lastLogin}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Details */}
          {selectedUser && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg h-fit sticky top-0">
              <h3 className="text-white text-lg font-bold mb-6">
                User Details
              </h3>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {selectedUser.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-4 border-t border-gray-700 pt-4">
                  <div>
                    <p className="text-gray-500 text-xs">NAME</p>
                    <p className="text-white font-semibold">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">EMAIL</p>
                    <p className="text-white font-semibold">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">ROLE</p>
                    <p className="text-white font-semibold">
                      {selectedUser.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">STATUS</p>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedUser.status === "active" ? (
                        <CheckCircle2 size={16} className="text-green-400" />
                      ) : (
                        <AlertCircle size={16} className="text-gray-400" />
                      )}
                      <span className="text-white font-semibold capitalize">
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">JOINED</p>
                    <p className="text-white font-semibold">
                      {selectedUser.joinedDate}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 border-t border-gray-700 pt-4">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-4 py-2 rounded-lg font-semibold transition">
                    <Edit2 size={18} />
                    Edit User
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-lg font-semibold transition">
                    <Trash2 size={18} />
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(permissions).map(([role, perms]) => (
            <div
              key={role}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-bold">{role}</h3>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400">
                  <Edit2 size={18} />
                </button>
              </div>

              <div className="space-y-3 border-t border-gray-700 pt-4">
                {perms.map((perm, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-green-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-gray-300 text-sm">{perm}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition">
                Manage Permissions
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === "activity" && (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="bg-gray-950 p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Activity Log</h3>
          </div>

          <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
            {mockActivityLog.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-700/30 transition">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{getActivityIcon(log.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold">{log.action}</h4>
                      <span className="text-gray-500 text-xs">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{log.details}</p>
                    <p className="text-gray-500 text-xs mt-2">By: {log.user}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-950 p-4 border-t border-gray-700">
            <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition">
              View Full Activity Log →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
