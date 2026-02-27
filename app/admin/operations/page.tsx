"use client";

import React, { useState } from "react";
import {
  LogIn,
  LogOut,
  Wrench,
  ClipboardList,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
  Edit2,
} from "lucide-react";

const mockCheckInOuts = [
  {
    id: 1,
    guest: "Chisom Patricia",
    room: "Ocean View Suite",
    type: "check-in",
    time: "3:30 PM",
    status: "completed",
    date: "Feb 26, 2026",
  },
  {
    id: 2,
    guest: "Tunde Musa",
    room: "Garden Escape Deluxe",
    type: "check-out",
    time: "11:00 AM",
    status: "completed",
    date: "Feb 26, 2026",
  },
  {
    id: 3,
    guest: "Oluwatoyin Babawale",
    room: "Beachfront Presidential",
    type: "check-in",
    time: "4:15 PM",
    status: "pending",
    date: "Feb 26, 2026",
  },
];

const mockMaintenance = [
  {
    id: 1,
    room: "Room 101 - Ocean View Suite",
    issue: "Air conditioning not cooling",
    priority: "high",
    status: "in-progress",
    assignee: "John Maintenance",
    date: "Feb 25, 2026",
  },
  {
    id: 2,
    room: "Room 207 - Garden Escape",
    issue: "Water heater issue",
    priority: "medium",
    status: "completed",
    assignee: "Ify Maintenance",
    date: "Feb 24, 2026",
  },
  {
    id: 3,
    room: "Room 305 - Beach Suite",
    issue: "Bathroom mirror crack",
    priority: "low",
    status: "pending",
    assignee: "Unassigned",
    date: "Feb 26, 2026",
  },
];

const mockHousekeeping = [
  {
    id: 1,
    room: "Room 101",
    type: "standard-clean",
    status: "completed",
    time: "45 mins",
    staff: "Maria",
  },
  {
    id: 2,
    room: "Room 102",
    type: "deep-clean",
    status: "in-progress",
    time: "In progress",
    staff: "Chioma",
  },
  {
    id: 3,
    room: "Room 103",
    type: "standard-clean",
    status: "pending",
    time: "Scheduled",
    staff: "Unassigned",
  },
  {
    id: 4,
    room: "Room 104",
    type: "post-checkout",
    status: "completed",
    time: "30 mins",
    staff: "Blessing",
  },
];

export default function OperationsTools() {
  const [activeTab, setActiveTab] = useState("checkin");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900/30 text-green-400";
      case "in-progress":
        return "bg-blue-900/30 text-blue-400";
      case "pending":
        return "bg-yellow-900/30 text-yellow-400";
      case "high":
        return "bg-red-900/30 text-red-400";
      default:
        return "bg-gray-700/30 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} />;
      case "in-progress":
        return <Clock size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white cormorant">
          Operations Tools
        </h1>
        <p className="text-gray-400">Manage daily operations and maintenance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab("checkin")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
            activeTab === "checkin"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Check-In/Out
        </button>
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
            activeTab === "maintenance"
              ? "text-white border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Maintenance Log
        </button>
        <button
          onClick={() => setActiveTab("housekeeping")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
            activeTab === "housekeeping"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Housekeeping Tasks
        </button>
      </div>

      {/* Check-In/Out Tab */}
      {activeTab === "checkin" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Check-In Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <LogIn size={24} className="text-green-400" />
              Check-In Guest
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Booking ID
                </label>
                <input
                  type="text"
                  placeholder="#2024-001"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Guest Name
                </label>
                <input
                  type="text"
                  placeholder="Enter guest name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Room Number
                </label>
                <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500">
                  <option>-- Select Room --</option>
                  <option>101</option>
                  <option>102</option>
                  <option>103</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                />
              </div>
              <button className="w-full bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
                <LogIn size={20} />
                Complete Check-In
              </button>
            </div>
          </div>

          {/* Check-Out Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <LogOut size={24} className="text-blue-400" />
              Check-Out Guest
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Booking ID
                </label>
                <input
                  type="text"
                  placeholder="#2024-002"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Guest Name
                </label>
                <input
                  type="text"
                  placeholder="Enter guest name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Room Condition
                </label>
                <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  <option>-- Select --</option>
                  <option>Good Condition</option>
                  <option>Minor Damage</option>
                  <option>Requires Cleaning</option>
                  <option>Requires Repairs</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Any damage or issues to report..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
                <LogOut size={20} />
                Complete Check-Out
              </button>
            </div>
          </div>

          {/* Check-In/Out History */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="bg-gray-950 p-4 border-b border-gray-700">
              <h3 className="text-white font-bold">Today's Activity</h3>
            </div>
            <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
              {mockCheckInOuts.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-700/30 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 flex-1">
                      {item.type === "check-in" ? (
                        <LogIn size={18} className="text-green-400 mt-0.5" />
                      ) : (
                        <LogOut size={18} className="text-blue-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.guest}</p>
                        <p className="text-gray-400 text-xs">{item.room}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {item.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${getStatusColor(
                        item.status,
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Log Tab */}
      {activeTab === "maintenance" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2">
              <Plus size={18} />
              Report Maintenance Issue
            </button>
          </div>

          {mockMaintenance.map((issue) => (
            <div
              key={issue.id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench size={18} className="text-yellow-400" />
                    <h4 className="text-white font-semibold">{issue.room}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(
                        issue.priority,
                      )}`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{issue.issue}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Assignee: {issue.assignee}</span>
                    <span>Status: {issue.status}</span>
                    <span>{issue.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Housekeeping Tasks Tab */}
      {activeTab === "housekeeping" && (
        <div>
          <div className="mb-6 flex justify-end">
            <button className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2">
              <Plus size={18} />
              Assign New Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {mockHousekeeping.map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{task.room}</h4>
                    <p className="text-gray-400 text-sm capitalize">
                      {task.type.replace("-", " ")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap ${getStatusColor(
                      task.status,
                    )}`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status}
                  </span>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Duration: {task.time}</span>
                    <span>Staff: {task.staff}</span>
                  </div>
                  {task.status === "pending" && (
                    <button className="w-full bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-3 py-2 rounded-lg text-sm font-semibold transition">
                      Assign Staff
                    </button>
                  )}
                  {task.status === "in-progress" && (
                    <button className="w-full bg-green-900/30 hover:bg-green-900/50 text-green-400 px-3 py-2 rounded-lg text-sm font-semibold transition">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
