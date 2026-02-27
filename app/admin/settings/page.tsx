"use client";

import React, { useState } from "react";
import {
  Settings,
  Hotel,
  CreditCard,
  Clock,
  FileText,
  Bell,
  Shield,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("hotel");
  const [hotelInfo, setHotelInfo] = useState({
    name: "Ziba Beach Resort",
    email: "info@zibabeachresort.com",
    phone: "+234 901 234 5678",
    address: "Lekki Beach, Lagos, Nigeria",
    description: "A luxury beach resort experience",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    paystackKey: "pk_live_xxxxxxxxxxxxx",
    bankTransfer: true,
    cashPayment: false,
    onlineInitiated: true,
    currencyCode: "NGN",
  });

  const handleHotelChange = (field: string, value: string) => {
    setHotelInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: any) => {
    setPaymentSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white cormorant">Settings</h1>
        <p className="text-gray-400">
          Manage hotel configuration and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab("hotel")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "hotel"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Hotel size={18} />
          Hotel Info
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "payment"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <CreditCard size={18} />
          Payment Methods
        </button>
        <button
          onClick={() => setActiveTab("operations")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "operations"
              ? "text-white border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Clock size={18} />
          Operations
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "policies"
              ? "text-white border-b-2 border-purple-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FileText size={18} />
          Policies
        </button>
      </div>

      {/* Hotel Info Tab */}
      {activeTab === "hotel" && (
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Hotel className="text-blue-400" size={28} />
            Hotel Information
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Hotel Name
                </label>
                <input
                  type="text"
                  value={hotelInfo.name}
                  onChange={(e) => handleHotelChange("name", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={hotelInfo.email}
                  onChange={(e) => handleHotelChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={hotelInfo.phone}
                  onChange={(e) => handleHotelChange("phone", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Currency Code
                </label>
                <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-light block mb-2">
                Full Address
              </label>
              <input
                type="text"
                value={hotelInfo.address}
                onChange={(e) => handleHotelChange("address", e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-light block mb-2">
                Hotel Description
              </label>
              <textarea
                value={hotelInfo.description}
                onChange={(e) =>
                  handleHotelChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Default Check-In Time
                </label>
                <input
                  type="time"
                  value={hotelInfo.checkInTime}
                  onChange={(e) =>
                    handleHotelChange("checkInTime", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Default Check-Out Time
                </label>
                <input
                  type="time"
                  value={hotelInfo.checkOutTime}
                  onChange={(e) =>
                    handleHotelChange("checkOutTime", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button className="w-full md:w-auto bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === "payment" && (
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <CreditCard className="text-green-400" size={28} />
            Payment Configuration
          </h2>

          <div className="space-y-8">
            {/* Paystack Configuration */}
            <div className="pb-8 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">₦</span>
                </div>
                <h3 className="text-white text-xl font-bold">Paystack</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Configure your Paystack account for online payments
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm font-light block mb-2">
                    Public Key
                  </label>
                  <input
                    type="password"
                    value={paymentSettings.paystackKey}
                    onChange={(e) =>
                      handlePaymentChange("paystackKey", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    id="paystack-active"
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="paystack-active"
                    className="text-gray-300 text-sm"
                  >
                    Enable Paystack payments
                  </label>
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="pb-8 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🏦</span>
                </div>
                <h3 className="text-white text-xl font-bold">Bank Transfer</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Enable bank transfer as a payment option
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="bank-enabled"
                    defaultChecked
                    onChange={(e) =>
                      handlePaymentChange("bankTransfer", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="bank-enabled"
                    className="text-gray-300 text-sm"
                  >
                    Accept bank transfer payments
                  </label>
                </div>
                {paymentSettings.bankTransfer && (
                  <div className="ml-7 space-y-3 p-3 bg-gray-700/30 rounded-lg">
                    <input
                      type="text"
                      placeholder="Account Name"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Bank Name"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cash Payment */}
            <div className="pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">💵</span>
                </div>
                <h3 className="text-white text-xl font-bold">Cash Payment</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Allow guests to pay with cash at check-in
              </p>
              <div>
                <input
                  type="checkbox"
                  id="cash-enabled"
                  onChange={(e) =>
                    handlePaymentChange("cashPayment", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor="cash-enabled"
                  className="text-gray-300 text-sm ml-3"
                >
                  Accept cash payments
                </label>
              </div>
            </div>

            <button className="w-full md:w-auto bg-linear-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
              <Save size={20} />
              Save Payment Settings
            </button>
          </div>
        </div>
      )}

      {/* Operations Tab */}
      {activeTab === "operations" && (
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Clock className="text-yellow-400" size={28} />
            Operations Settings
          </h2>

          <div className="space-y-8">
            {/* Business Hours */}
            <div className="pb-8 border-b border-gray-700">
              <h3 className="text-white text-lg font-bold mb-6">
                Business Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-gray-400 w-24 text-sm">{day}</span>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                    <span className="text-gray-300 text-sm">-</span>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="pb-8 border-b border-gray-700">
              <h3 className="text-white text-lg font-bold mb-6">
                Notifications
              </h3>
              <div className="space-y-3">
                {[
                  "New bookings",
                  "Payment received",
                  "Guest check-in",
                  "Maintenance alerts",
                  "Low inventory",
                ].map((notif) => (
                  <div key={notif} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={notif}
                      defaultChecked
                      className="w-4 h-4"
                    />
                    <label htmlFor={notif} className="text-gray-300 text-sm">
                      Notify for {notif}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Policies */}
            <div className="pb-8">
              <h3 className="text-white text-lg font-bold mb-6">
                Guest Policies
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm font-light block mb-2">
                    Cancellation Deadline (hours before check-in)
                  </label>
                  <input
                    type="number"
                    defaultValue="24"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-light block mb-2">
                    Refund Percentage for Late Cancellation (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="50"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            <button className="w-full md:w-auto bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
              <Save size={20} />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === "policies" && (
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <FileText className="text-purple-400" size={28} />
            Policies & Terms
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm font-light block mb-2">
                Cancellation Policy
              </label>
              <textarea
                defaultValue="Guests can cancel free of charge up to 24 hours before check-in. Cancellations within 24 hours will incur a 50% charge."
                rows={5}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-light block mb-2">
                House Rules
              </label>
              <textarea
                defaultValue="• No smoking in rooms\n• Quiet hours 10 PM - 8 AM\n• Maximum occupancy as per room type\n• Guests responsible for damages"
                rows={5}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-light block mb-2">
                Privacy Policy
              </label>
              <textarea
                defaultValue="We are committed to protecting your privacy. Your personal information is used only for booking and communication purposes and will not be shared with third parties."
                rows={5}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <button className="w-full md:w-auto bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
              <Save size={20} />
              Save Policies
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
