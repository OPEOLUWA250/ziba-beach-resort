"use client";

import React, { useState } from "react";
import {
  Send,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  Search,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";

const mockEmails = [
  {
    id: 1,
    type: "confirmation",
    subject: "Booking Confirmation #2024-001",
    recipient: "Chisom Patricia",
    sent: "Feb 26, 2026",
    status: "sent",
    opens: 1,
  },
  {
    id: 2,
    type: "reminder",
    subject: "Reminder: Check-in Tomorrow",
    recipient: "Tunde Musa",
    sent: "Feb 26, 2026",
    status: "sent",
    opens: 1,
  },
  {
    id: 3,
    type: "feedback",
    subject: "Please Share Your Experience",
    recipient: "Oluwatoyin Babawale",
    sent: "Feb 20, 2026",
    status: "sent",
    opens: 0,
  },
  {
    id: 4,
    type: "promotion",
    subject: "Special Summer Offer - 20% Off",
    recipient: "All Guests",
    sent: "Feb 15, 2026",
    status: "sent",
    opens: 45,
  },
  {
    id: 5,
    type: "invoice",
    subject: "Payment Invoice - Booking #2024-003",
    recipient: "Adebayo Okonkwo",
    sent: "Feb 18, 2026",
    status: "sent",
    opens: 1,
  },
];

export default function CommunicationsHub() {
  const [activeTab, setActiveTab] = useState("history");
  const [messageText, setMessageText] = useState("");

  const emailTypes = {
    confirmation: { icon: "📧", color: "blue" },
    reminder: { icon: "⏰", color: "yellow" },
    feedback: { icon: "⭐", color: "purple" },
    promotion: { icon: "🎉", color: "pink" },
    invoice: { icon: "💳", color: "green" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white cormorant">
          Communications
        </h1>
        <p className="text-gray-400">Manage guest communications and emails</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-4 font-semibold transition-colors ${
            activeTab === "history"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Email History
        </button>
        <button
          onClick={() => setActiveTab("broadcast")}
          className={`px-6 py-4 font-semibold transition-colors ${
            activeTab === "broadcast"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Broadcast Email
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-6 py-4 font-semibold transition-colors ${
            activeTab === "templates"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Templates
        </button>
      </div>

      {/* Email History Tab */}
      {activeTab === "history" && (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="bg-gray-950 p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Email Log</h3>
          </div>
          <div className="divide-y divide-gray-700">
            {mockEmails.map((email) => (
              <div
                key={email.id}
                className="p-4 hover:bg-gray-700/30 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-2xl">
                      {emailTypes[email.type as keyof typeof emailTypes].icon}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">
                        {email.subject}
                      </h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {email.recipient}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">{email.sent}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-semibold mb-2">
                      {email.status}
                    </span>
                    <p className="text-gray-400 text-sm">
                      {email.opens} open{email.opens !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Email Tab */}
      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-white text-xl font-bold mb-6">
              Send Broadcast Email
            </h3>

            <div className="space-y-6">
              {/* Recipient Selection */}
              <div>
                <label className="text-gray-400 text-sm font-light block mb-3">
                  Recipients
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition">
                    <input type="radio" name="recipient" defaultChecked />
                    <span className="text-white text-sm font-semibold">
                      All Guests
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition">
                    <input type="radio" name="recipient" />
                    <span className="text-white text-sm font-semibold">
                      Repeat Guests Only
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition">
                    <input type="radio" name="recipient" />
                    <span className="text-white text-sm font-semibold">
                      Booked This Month
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition">
                    <input type="radio" name="recipient" />
                    <span className="text-white text-sm font-semibold">
                      Custom List
                    </span>
                  </label>
                </div>
              </div>

              {/* Email Template */}
              <div>
                <label className="text-gray-400 text-sm font-light block mb-3">
                  Email Template
                </label>
                <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  <option>-- Select Template --</option>
                  <option>Welcome Email</option>
                  <option>Promotional Offer</option>
                  <option>Holiday Greeting</option>
                  <option>Survey Request</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Write your email message..."
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
                <Send size={20} />
                Send Email
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg h-fit">
            <h3 className="text-white font-bold mb-4">Preview</h3>
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="text-gray-300 text-sm space-y-4">
                <div>
                  <p className="text-gray-500 text-xs">Subject:</p>
                  <p className="text-white font-semibold">Email Subject Here</p>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <p className="text-gray-300">Dear Guest,</p>
                  <p className="text-gray-300 mt-2">
                    {messageText.substring(0, 100)}
                    {messageText.length > 100 ? "..." : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          {[
            "Welcome Email",
            "Booking Confirmation",
            "Check-in Reminder",
            "Follow-up Survey",
          ].map((template) => (
            <div
              key={template}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="text-white font-semibold">{template}</h4>
                <p className="text-gray-400 text-sm">Automated template</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-700 rounded-lg transition text-blue-400">
                  <Eye size={20} />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          <button className="w-full border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-xl p-4 text-gray-400 hover:text-white transition flex items-center justify-center gap-2">
            <Plus size={20} />
            Create New Template
          </button>
        </div>
      )}
    </div>
  );
}
