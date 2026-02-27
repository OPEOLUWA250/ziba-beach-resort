"use client";

import React, { useState } from "react";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";

const mockGuests = [
  {
    id: 1,
    name: "Chisom Patricia",
    email: "chisom@email.com",
    phone: "+234 801 234 5678",
    totalBookings: 5,
    totalSpent: 1500000,
    lastBooking: "Feb 26, 2026",
    repeatGuest: true,
    notes: "VIP guest, prefers beach view",
  },
  {
    id: 2,
    name: "Tunde Musa",
    email: "tunde@email.com",
    phone: "+234 802 345 6789",
    totalBookings: 2,
    totalSpent: 850000,
    lastBooking: "Feb 27, 2026",
    repeatGuest: true,
    notes: "Corporate group bookings",
  },
  {
    id: 3,
    name: "Oluwatoyin Babawale",
    email: "oluwa@email.com",
    phone: "+234 803 456 7890",
    totalBookings: 1,
    totalSpent: 900000,
    lastBooking: "Mar 2, 2026",
    repeatGuest: false,
    notes: "Honeymoon suite preference",
  },
  {
    id: 4,
    name: "Adebayo Okonkwo",
    email: "adebayo@email.com",
    phone: "+234 804 567 8901",
    totalBookings: 3,
    totalSpent: 650000,
    lastBooking: "Feb 28, 2026",
    repeatGuest: true,
    notes: "Flexible with dates",
  },
  {
    id: 5,
    name: "Folake Ayokunle",
    email: "folake@email.com",
    phone: "+234 805 678 9012",
    totalBookings: 1,
    totalSpent: 420000,
    lastBooking: "Jan 15, 2026",
    repeatGuest: false,
    notes: "Corporate guest",
  },
];

export default function GuestsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<
    (typeof mockGuests)[0] | null
  >(null);

  const filteredGuests = mockGuests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const repeatGuests = mockGuests.filter((g) => g.repeatGuest).length;
  const totalRevenue = mockGuests.reduce((sum, g) => sum + g.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white cormorant">Guests</h1>
        <p className="text-gray-400">
          Manage guest profiles and booking history
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-cyan-950 rounded-2xl p-6 border border-blue-800 shadow-lg">
          <p className="text-blue-200 text-sm font-light mb-2">Total Guests</p>
          <h3 className="text-4xl font-bold text-white">{mockGuests.length}</h3>
          <p className="text-blue-300 text-sm mt-2">Accumulated guests</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-pink-950 rounded-2xl p-6 border border-purple-800 shadow-lg">
          <p className="text-purple-200 text-sm font-light mb-2">
            Repeat Guests
          </p>
          <h3 className="text-4xl font-bold text-white">{repeatGuests}</h3>
          <p className="text-purple-300 text-sm mt-2">
            {Math.round((repeatGuests / mockGuests.length) * 100)}% loyalty rate
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-emerald-950 rounded-2xl p-6 border border-green-800 shadow-lg">
          <p className="text-green-200 text-sm font-light mb-2">
            Total Revenue
          </p>
          <h3 className="text-4xl font-bold text-white">
            ₦{(totalRevenue / 1000000).toFixed(1)}M
          </h3>
          <p className="text-green-300 text-sm mt-2">From all guests</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search by guest name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest List */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="sticky top-0 bg-gray-950 p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Guest Directory</h3>
          </div>
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
            {filteredGuests.map((guest) => (
              <div
                key={guest.id}
                onClick={() => setSelectedGuest(guest)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedGuest?.id === guest.id
                    ? "bg-blue-900/30 border-l-2 border-blue-500"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold">{guest.name}</h4>
                      {guest.repeatGuest && (
                        <Heart
                          fill="#EC4899"
                          size={16}
                          className="text-pink-500"
                        />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{guest.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">
                      ₦{(guest.totalSpent / 1000).toFixed(0)}K
                    </p>
                    <p className="text-gray-400 text-xs">
                      {guest.totalBookings} bookings
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Details Panel */}
        {selectedGuest ? (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg h-fit sticky top-0">
            <h3 className="text-white text-xl font-bold mb-6">Guest Profile</h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-gray-400 text-sm font-light">
                  Full Name
                </label>
                <p className="text-white font-semibold mt-1">
                  {selectedGuest.name}
                </p>
              </div>

              {/* Contact */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-gray-400 text-sm font-light flex items-center gap-2 mb-1">
                    <Mail size={14} /> Email
                  </label>
                  <a
                    href={`mailto:${selectedGuest.email}`}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    {selectedGuest.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-gray-400 text-sm font-light flex items-center gap-2 mb-1">
                    <Phone size={14} /> Phone
                  </label>
                  <a
                    href={`tel:${selectedGuest.phone}`}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    {selectedGuest.phone}
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <label className="text-gray-400 text-sm font-light block mb-3">
                  Booking History
                </label>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Total Bookings</span>
                    <span className="text-white font-bold">
                      {selectedGuest.totalBookings}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Total Spent</span>
                    <span className="text-white font-bold">
                      ₦{selectedGuest.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Last Booking</span>
                    <span className="text-white font-bold text-sm">
                      {selectedGuest.lastBooking}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-gray-300">Guest Type</span>
                    <span
                      className={`text-sm font-bold ${
                        selectedGuest.repeatGuest
                          ? "text-pink-400"
                          : "text-gray-400"
                      }`}
                    >
                      {selectedGuest.repeatGuest
                        ? "⭐ Repeat Guest"
                        : "First Time"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border-t border-gray-700 pt-4">
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Internal Notes
                </label>
                <p className="text-gray-300 text-sm italic bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                  {selectedGuest.notes}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
                <button className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-semibold">
                  <Mail size={16} /> Email
                </button>
                <button className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-400 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-semibold">
                  <MessageSquare size={16} /> Message
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg h-fit flex items-center justify-center text-gray-400">
            <p>Select a guest to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
