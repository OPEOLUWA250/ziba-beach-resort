"use client";

import React, { useState } from "react";
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
import { Download, Filter, Calendar } from "lucide-react";

const revenueByDay = [
  { date: "Feb 20", revenue: 12500, bookings: 4 },
  { date: "Feb 21", revenue: 15300, bookings: 5 },
  { date: "Feb 22", revenue: 13800, bookings: 4 },
  { date: "Feb 23", revenue: 18900, bookings: 6 },
  { date: "Feb 24", revenue: 16500, bookings: 5 },
  { date: "Feb 25", revenue: 21200, bookings: 7 },
  { date: "Feb 26", revenue: 19800, bookings: 6 },
  { date: "Feb 27", revenue: 24300, bookings: 8 },
];

const revenueByRoom = [
  { name: "Beach Facing", value: 45000, fill: "#3B82F6" },
  { name: "Ocean View Suite", value: 62000, fill: "#10B981" },
  { name: "Luxury Villa", value: 85000, fill: "#F59E0B" },
  { name: "Beachfront", value: 38000, fill: "#8B5CF6" },
  { name: "Sunset View", value: 55000, fill: "#EC4899" },
];

const paymentMethods = [
  { name: "Paystack", value: 65, fill: "#3B82F6" },
  { name: "Bank Transfer", value: 25, fill: "#10B981" },
  { name: "Card", value: 10, fill: "#F59E0B" },
];

export default function RevenueAnalytics() {
  const [dateRange, setDateRange] = useState("monthly");

  const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.revenue, 0);
  const totalBookings = revenueByDay.reduce(
    (sum, day) => sum + day.bookings,
    0,
  );
  const avgBookingValue = Math.round(totalRevenue / totalBookings);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white cormorant">Revenue</h1>
          <p className="text-gray-400">Financial analytics and reports</p>
        </div>
        <button className="bg-linear-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-900 to-emerald-950 rounded-2xl p-6 border border-green-800 shadow-lg">
          <p className="text-green-200 text-sm font-light mb-2">
            Total Revenue
          </p>
          <h3 className="text-4xl font-bold text-white mb-4">
            ₦{(totalRevenue / 1000).toFixed(1)}K
          </h3>
          <p className="text-green-300 text-sm">+12.5% from last week</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-cyan-950 rounded-2xl p-6 border border-blue-800 shadow-lg">
          <p className="text-blue-200 text-sm font-light mb-2">
            Total Bookings
          </p>
          <h3 className="text-4xl font-bold text-white mb-4">
            {totalBookings}
          </h3>
          <p className="text-blue-300 text-sm">Avg 6 bookings per day</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-pink-950 rounded-2xl p-6 border border-purple-800 shadow-lg">
          <p className="text-purple-200 text-sm font-light mb-2">
            Avg Booking Value
          </p>
          <h3 className="text-4xl font-bold text-white mb-4">
            ₦{avgBookingValue.toLocaleString()}
          </h3>
          <p className="text-purple-300 text-sm">Per reservation</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex gap-3 flex-wrap">
        <button className="px-4 py-2 bg-blue-900 text-blue-300 rounded-lg text-sm font-semibold">
          This Month
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-semibold transition">
          Last Month
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-semibold transition">
          Last 3 Months
        </button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-semibold transition">
          Custom Range
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-white text-xl font-bold mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDay}>
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
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
          <h3 className="text-white text-xl font-bold mb-6">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {paymentMethods.map((entry, index) => (
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
            {paymentMethods.map((method) => (
              <div key={method.name} className="flex justify-between">
                <span className="text-gray-400">{method.name}</span>
                <span className="text-white font-semibold">
                  {method.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Room Type */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-white text-xl font-bold mb-6">
          Revenue by Room Type
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueByRoom}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              stroke="#9CA3AF"
              dataKey="name"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#F3F4F6" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {revenueByRoom.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Report */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-white text-xl font-bold mb-6">Detailed Report</h3>
        <div className="space-y-4">
          {[
            { label: "Gross Revenue", value: "₦142,500", change: "+12.5%" },
            {
              label: "Refunds & Adjustments",
              value: "-₦5,200",
              change: "-2.3%",
            },
            { label: "Discounts Applied", value: "-₦8,500", change: "-3.8%" },
            { label: "Net Revenue", value: "₦128,800", change: "+9.2%" },
            { label: "Outstanding Payments", value: "₦15,000", change: "+15%" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/20"
            >
              <div>
                <p className="text-gray-300 font-medium">{item.label}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{item.value}</p>
                <p className="text-gray-400 text-sm">{item.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
