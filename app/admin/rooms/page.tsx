"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Check,
  Clock,
  Wrench,
  Lock,
} from "lucide-react";

const mockRooms = [
  {
    id: "room01",
    name: "Beach Facing Room",
    type: "Standard",
    capacity: 2,
    price: 150000,
    status: "booked",
    currentGuest: "Chisom Patricia",
    daysLeft: 2,
    occupancy: "100%",
  },
  {
    id: "room02",
    name: "Ocean View Suite",
    type: "Deluxe",
    capacity: 4,
    price: 180000,
    status: "available",
    currentGuest: null,
    daysLeft: null,
    occupancy: "0%",
  },
  {
    id: "room03",
    name: "Luxury Villa",
    type: "Premium",
    capacity: 6,
    price: 300000,
    status: "available",
    currentGuest: null,
    daysLeft: null,
    occupancy: "0%",
  },
  {
    id: "room04",
    name: "Beachfront Room",
    type: "Standard",
    capacity: 2,
    price: 150000,
    status: "maintenance",
    currentGuest: null,
    daysLeft: null,
    occupancy: "0%",
  },
  {
    id: "room05",
    name: "Sunset View Room",
    type: "Deluxe",
    capacity: 3,
    price: 200000,
    status: "booked",
    currentGuest: "Tunde Musa",
    daysLeft: 4,
    occupancy: "100%",
  },
  {
    id: "room06",
    name: "Garden Room",
    type: "Standard",
    capacity: 2,
    price: 120000,
    status: "blocked",
    currentGuest: null,
    daysLeft: null,
    occupancy: "0%",
  },
  {
    id: "room07",
    name: "Infinity Pool Room",
    type: "Deluxe",
    capacity: 4,
    price: 250000,
    status: "booked",
    currentGuest: "Oluwatoyin B.",
    daysLeft: 6,
    occupancy: "100%",
  },
  {
    id: "room08",
    name: "Paradise Suite",
    type: "Premium",
    capacity: 5,
    price: 280000,
    status: "available",
    currentGuest: null,
    daysLeft: null,
    occupancy: "0%",
  },
  {
    id: "room09",
    name: "Tropical Terrace",
    type: "Standard",
    capacity: 2,
    price: 140000,
    status: "available",
    currentGuest: null,
    daysLeft: null,
    occupancy: "0%",
  },
];

const RoomStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "booked":
      return <Clock size={20} className="text-red-400" />;
    case "available":
      return <Check size={20} className="text-green-400" />;
    case "maintenance":
      return <Wrench size={20} className="text-yellow-400" />;
    case "blocked":
      return <Lock size={20} className="text-gray-400" />;
    default:
      return <AlertCircle size={20} className="text-gray-400" />;
  }
};

const RoomCard = ({ room }: { room: (typeof mockRooms)[0] }) => {
  const statusColors = {
    booked: "bg-red-900/20 border-red-900/50",
    available: "bg-green-900/20 border-green-900/50",
    maintenance: "bg-yellow-900/20 border-yellow-900/50",
    blocked: "bg-gray-800/50 border-gray-700",
  };

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg ${
        statusColors[room.status as keyof typeof statusColors]
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">{room.name}</h3>
          <p className="text-gray-400 text-sm">
            {room.type} • {room.capacity} guests
          </p>
        </div>
        <RoomStatusIcon status={room.status} />
      </div>

      <div className="mb-4 pb-4 border-b border-gray-700/50">
        <p className="text-gray-300 text-sm font-semibold">
          ₦{room.price.toLocaleString()}/night
        </p>
      </div>

      {room.status === "booked" && room.currentGuest && (
        <div className="mb-4 p-3 bg-black/30 rounded-lg">
          <p className="text-gray-400 text-xs mb-1">Current Guest</p>
          <p className="text-white font-semibold text-sm">
            {room.currentGuest}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {room.daysLeft} days left
          </p>
        </div>
      )}

      {room.status === "available" && (
        <div className="mb-4 p-3 bg-green-900/20 rounded-lg">
          <p className="text-green-300 text-sm font-semibold">Available Now</p>
        </div>
      )}

      {room.status === "maintenance" && (
        <div className="mb-4 p-3 bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-300 text-sm font-semibold">
            Under Maintenance
          </p>
        </div>
      )}

      {room.status === "blocked" && (
        <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
          <p className="text-gray-300 text-sm font-semibold">Blocked</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded-lg transition text-sm font-semibold">
          <Eye size={16} className="inline mr-1" /> View
        </button>
        <button className="flex-1 px-3 py-2 bg-gray-700/30 hover:bg-gray-700/50 text-gray-400 rounded-lg transition text-sm font-semibold">
          <Edit size={16} className="inline mr-1" /> Edit
        </button>
        <button className="px-3 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default function RoomsManagement() {
  const bookedRooms = mockRooms.filter((r) => r.status === "booked").length;
  const availableRooms = mockRooms.filter(
    (r) => r.status === "available",
  ).length;
  const maintenanceRooms = mockRooms.filter(
    (r) => r.status === "maintenance",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white cormorant">Rooms</h1>
          <p className="text-gray-400">
            Manage all rooms and their configurations
          </p>
        </div>
        <button className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg">
          + Add Room
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Rooms</p>
          <p className="text-3xl font-bold text-white">{mockRooms.length}</p>
        </div>
        <div className="bg-red-900/20 rounded-xl p-4 border border-red-900/50">
          <p className="text-red-300 text-sm">Booked</p>
          <p className="text-3xl font-bold text-red-400">{bookedRooms}</p>
        </div>
        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/50">
          <p className="text-green-300 text-sm">Available</p>
          <p className="text-3xl font-bold text-green-400">{availableRooms}</p>
        </div>
        <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-900/50">
          <p className="text-yellow-300 text-sm">Maintenance</p>
          <p className="text-3xl font-bold text-yellow-400">
            {maintenanceRooms}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex gap-3 flex-wrap">
        <button className="px-4 py-2 bg-blue-900 text-blue-300 rounded-lg text-sm font-semibold">
          All Rooms
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-semibold transition">
          Available
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-semibold transition">
          Booked
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-semibold transition">
          Maintenance
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
