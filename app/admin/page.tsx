"use client";

import React from "react";
import {
  TrendingUp,
  Calendar,
  Users,
  Star,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock Data
const revenueData = [
  { date: "Feb 20", revenue: 12500 },
  { date: "Feb 21", revenue: 15300 },
  { date: "Feb 22", revenue: 13800 },
  { date: "Feb 23", revenue: 18900 },
  { date: "Feb 24", revenue: 16500 },
  { date: "Feb 25", revenue: 21200 },
  { date: "Feb 26", revenue: 19800 },
  { date: "Feb 27", revenue: 24300 },
];

const roomUtilizationData = [
  { name: "Occupied", value: 7, fill: "#3B82F6" },
  { name: "Available", value: 2, fill: "#10B981" },
];

const paymentMethodsData = [
  { name: "Paystack", value: 65, fill: "#3B82F6" },
  { name: "Bank Transfer", value: 25, fill: "#10B981" },
  { name: "Card", value: 10, fill: "#F59E0B" },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  bgGradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  bgGradient: string;
}) => {
  return (
    <div
      className={`${bgGradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-opacity-20 border-white`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-200 text-sm font-light mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
          {Icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2">
          {trendUp ? (
            <ArrowUpRight size={16} className="text-green-400" />
          ) : (
            <ArrowDownRight size={16} className="text-red-400" />
          )}
          <span className={trendUp ? "text-green-400" : "text-red-400"}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-8 border border-blue-800 shadow-2xl">
        <h1 className="text-4xl font-light text-white mb-2 cormorant">
          Welcome Back
        </h1>
        <p className="text-blue-200 font-light">
          Here's what's happening with Ziba Beach Resort today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="₦142.5K"
          icon={<CreditCard size={24} className="text-yellow-300" />}
          trend="+12.5% from last week"
          trendUp={true}
          bgGradient="bg-linear-to-br from-yellow-600 to-orange-700"
        />
        <StatCard
          title="Active Bookings"
          value="24"
          icon={<Calendar size={24} className="text-blue-300" />}
          trend="+3 new today"
          trendUp={true}
          bgGradient="bg-linear-to-br from-blue-900 to-blue-800"
        />
        <StatCard
          title="Occupancy Rate"
          value="78%"
          icon={<TrendingUp size={24} className="text-green-300" />}
          trend="+5% from yesterday"
          trendUp={true}
          bgGradient="bg-linear-to-br from-green-600 to-emerald-700"
        />
        <StatCard
          title="Avg Rating"
          value="4.9★"
          icon={<Star size={24} className="text-purple-300" />}
          trend="From 243 reviews"
          trendUp={true}
          bgGradient="bg-linear-to-br from-purple-600 to-pink-700"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white transition-all duration-200 text-left group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Create</p>
              <p className="font-semibold">New Booking</p>
            </div>
            <ArrowUpRight
              size={20}
              className="text-gray-600 group-hover:text-blue-500 transition"
            />
          </div>
        </button>

        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white transition-all duration-200 text-left group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Check-in</p>
              <p className="font-semibold">Today's Guests (3)</p>
            </div>
            <AlertCircle
              size={20}
              className="text-gray-600 group-hover:text-orange-500 transition"
            />
          </div>
        </button>

        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white transition-all duration-200 text-left group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Review</p>
              <p className="font-semibold">Pending Payments</p>
            </div>
            <CreditCard
              size={20}
              className="text-gray-600 group-hover:text-green-500 transition"
            />
          </div>
        </button>

        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white transition-all duration-200 text-left group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">View</p>
              <p className="font-semibold">Room Calendar</p>
            </div>
            <Calendar
              size={20}
              className="text-gray-600 group-hover:text-purple-500 transition"
            />
          </div>
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-white text-xl font-bold mb-6">
            Revenue Trend (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room Utilization */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-white text-xl font-bold mb-6">Occupancy Today</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roomUtilizationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {roomUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {roomUtilizationData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <span className="text-gray-400">{item.name}</span>
                <span className="text-white font-bold">{item.value} rooms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-white text-xl font-bold mb-6">Recent Bookings</h3>
          <div className="space-y-4">
            {[
              {
                guest: "Chisom Patricia",
                room: "Beach Facing Room",
                dates: "Feb 26 - Mar 1",
                status: "confirmed",
              },
              {
                guest: "Tunde Musa",
                room: "Ocean View Suite",
                dates: "Feb 27 - Mar 3",
                status: "pending",
              },
              {
                guest: "Oluwatoyin B.",
                room: "Luxury Villa",
                dates: "Mar 2 - Mar 5",
                status: "confirmed",
              },
            ].map((booking, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold">{booking.guest}</p>
                  <p className="text-gray-400 text-sm">{booking.room}</p>
                  <p className="text-gray-500 text-xs mt-1">{booking.dates}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "confirmed"
                      ? "bg-green-900/30 text-green-400"
                      : "bg-yellow-900/30 text-yellow-400"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-white text-xl font-bold mb-6">System Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-400 shrink-0" />
                <div>
                  <p className="text-red-300 font-semibold">Payment Failed</p>
                  <p className="text-red-200 text-sm">
                    Booking #2024-105 payment retry needed
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-900/20 border border-yellow-900/50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-400 shrink-0" />
                <div>
                  <p className="text-yellow-300 font-semibold">
                    Maintenance Scheduled
                  </p>
                  <p className="text-yellow-200 text-sm">
                    Ocean View Suite - Room inspection tomorrow
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-900/50 rounded-xl">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-blue-400 shrink-0" />
                <div>
                  <p className="text-blue-300 font-semibold">Check-ins Today</p>
                  <p className="text-blue-200 text-sm">
                    3 guests checking in this evening
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
