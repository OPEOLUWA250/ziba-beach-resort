"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  DoorOpen,
  User,
  CreditCard,
} from "lucide-react";

const mockBookings = [
  {
    id: "#2024-001",
    guest: "Chisom Patricia",
    email: "chisom@email.com",
    phone: "+234 801 234 5678",
    room: "Beach Facing Room",
    checkIn: "Feb 26, 2026",
    checkOut: "Mar 1, 2026",
    nights: 3,
    totalPrice: "₦450,000",
    status: "confirmed",
    payment: "paid",
  },
  {
    id: "#2024-002",
    guest: "Tunde Musa",
    email: "tunde@email.com",
    phone: "+234 802 345 6789",
    room: "Ocean View Suite",
    checkIn: "Feb 27, 2026",
    checkOut: "Mar 3, 2026",
    nights: 4,
    totalPrice: "₦720,000",
    status: "pending",
    payment: "pending",
  },
  {
    id: "#2024-003",
    guest: "Oluwatoyin Babawale",
    email: "oluwa@email.com",
    phone: "+234 803 456 7890",
    room: "Luxury Villa",
    checkIn: "Mar 2, 2026",
    checkOut: "Mar 5, 2026",
    nights: 3,
    totalPrice: "₦900,000",
    status: "confirmed",
    payment: "paid",
  },
  {
    id: "#2024-004",
    guest: "Adebayo Okonkwo",
    email: "adebayo@email.com",
    phone: "+234 804 567 8901",
    room: "Beachfront Room",
    checkIn: "Feb 28, 2026",
    checkOut: "Mar 2, 2026",
    nights: 2,
    totalPrice: "₦300,000",
    status: "checked-in",
    payment: "paid",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    confirmed: "bg-green-900/30 text-green-400 border-green-900/50",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-900/50",
    "checked-in": "bg-blue-900/30 text-blue-400 border-blue-900/50",
    completed: "bg-gray-900/30 text-gray-400 border-gray-900/50",
    cancelled: "bg-red-900/30 text-red-400 border-red-900/50",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        colors[status as keyof typeof colors]
      }`}
    >
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const colors = {
    paid: "bg-green-900/30 text-green-400 border-green-900/50",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-900/50",
    failed: "bg-red-900/30 text-red-400 border-red-900/50",
    refunded: "bg-blue-900/30 text-blue-400 border-blue-900/50",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        colors[status as keyof typeof colors]
      }`}
    >
      {status}
    </span>
  );
};

export default function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white cormorant">Bookings</h1>
          <p className="text-gray-400">
            Manage all guest bookings and reservations
          </p>
        </div>
        <button className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg">
          + New Booking
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by guest name or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-12 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="checked-in">Checked In</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-950/50">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBookings(filteredBookings.map((b) => b.id));
                      } else {
                        setSelectedBookings([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Guest
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-700 hover:bg-gray-700/30 transition"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookings([
                            ...selectedBookings,
                            booking.id,
                          ]);
                        } else {
                          setSelectedBookings(
                            selectedBookings.filter((id) => id !== booking.id),
                          );
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-semibold">
                      {booking.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{booking.guest}</p>
                      <p className="text-gray-400 text-xs">{booking.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{booking.room}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white text-sm">{booking.checkIn}</p>
                      <p className="text-gray-400 text-xs">
                        {booking.nights} nights
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-semibold">
                      {booking.totalPrice}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentBadge status={booking.payment} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-900/30 rounded-lg transition text-blue-400">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-900/30 rounded-lg transition text-red-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing {filteredBookings.length} of {mockBookings.length} bookings
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-900 border border-blue-800 rounded-lg text-blue-400">
            1
          </button>
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
