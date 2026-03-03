"use client";

import React, { useState, useEffect } from "react";
import {
  LogIn,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { getAllBookings, updateBookingStatus } from "@/lib/services/booking";

interface Booking {
  id: string;
  booking_reference_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  room_price_ngn: number;
  number_of_nights: number;
  total_amount_ngn: number;
  payment_status: string;
  created_at: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-900/30 text-yellow-400 border-yellow-900/50",
    CONFIRMED: "bg-blue-900/30 text-blue-400 border-blue-900/50",
    CHECKED_IN: "bg-green-900/30 text-green-400 border-green-900/50",
    COMPLETED: "bg-gray-900/30 text-gray-400 border-gray-900/50",
    CANCELLED: "bg-red-900/30 text-red-400 border-red-900/50",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || colors.PENDING}`}
    >
      {status}
    </span>
  );
};

export default function OperationsCheckInOut() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkInForm, setCheckInForm] = useState({
    bookingId: "",
    notes: "",
  });
  const [checkOutForm, setCheckOutForm] = useState({
    bookingId: "",
    roomCondition: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getAllBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Bookings ready for check-in (CONFIRMED status)
  const checkInReady = bookings.filter((b) => b.payment_status === "CONFIRMED");

  // Bookings ready for check-out (CHECKED_IN status)
  const checkOutReady = bookings.filter(
    (b) => b.payment_status === "CHECKED_IN",
  );

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInForm.bookingId) {
      alert("Please select a booking");
      return;
    }

    try {
      setIsSubmitting(true);
      const booking = bookings.find(
        (b) => String(b.id) === String(checkInForm.bookingId),
      );
      if (!booking) {
        console.error(
          "Booking not found. Looking for:",
          checkInForm.bookingId,
          "in",
          bookings.map((b) => b.id),
        );
        alert("Booking not found. Please refresh and try again.");
        return;
      }

      const updated = await updateBookingStatus(booking.id, "CHECKED_IN");

      if (updated) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === booking.id ? { ...b, payment_status: "CHECKED_IN" } : b,
          ),
        );
        setCheckInForm({ bookingId: "", notes: "" });
        setSuccessMessage(
          `Guest ${booking.guest_name} checked in successfully!`,
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error checking in:", err);
      alert("Failed to check in guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkOutForm.bookingId) {
      alert("Please select a booking");
      return;
    }

    try {
      setIsSubmitting(true);
      const booking = bookings.find(
        (b) => String(b.id) === String(checkOutForm.bookingId),
      );
      if (!booking) {
        console.error(
          "Booking not found. Looking for:",
          checkOutForm.bookingId,
          "in",
          bookings.map((b) => b.id),
        );
        alert("Booking not found. Please refresh and try again.");
        return;
      }

      const updated = await updateBookingStatus(booking.id, "COMPLETED");

      if (updated) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === booking.id ? { ...b, payment_status: "COMPLETED" } : b,
          ),
        );
        setCheckOutForm({ bookingId: "", roomCondition: "", notes: "" });
        setSuccessMessage(
          `Guest ${booking.guest_name} checked out successfully!`,
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error checking out:", err);
      alert("Failed to check out guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white cormorant">
          Check-In / Check-Out
        </h1>
        <p className="text-gray-400">Manage guest arrivals and departures</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-900/50 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-400" />
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Clock size={24} className="text-gray-400 animate-spin" />
          <p className="text-gray-400 ml-2">Loading bookings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Check-In Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <LogIn size={24} className="text-green-400" />
              Check-In Guest
            </h3>

            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Select Guest (Confirmed)
                </label>
                <select
                  value={checkInForm.bookingId}
                  onChange={(e) =>
                    setCheckInForm((prev) => ({
                      ...prev,
                      bookingId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                >
                  <option value="">-- Select Guest --</option>
                  {checkInReady.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.guest_name} ({booking.booking_reference_code})
                    </option>
                  ))}
                </select>
                {checkInReady.length === 0 && (
                  <p className="text-gray-500 text-xs mt-2">
                    No guests ready for check-in
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Any special requirements..."
                  value={checkInForm.notes}
                  onChange={(e) =>
                    setCheckInForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !checkInForm.bookingId}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                {isSubmitting ? "Checking In..." : "Complete Check-In"}
              </button>
            </form>
          </div>

          {/* Check-Out Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <LogOut size={24} className="text-blue-400" />
              Check-Out Guest
            </h3>

            <form onSubmit={handleCheckOut} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Select Guest (Checked In)
                </label>
                <select
                  value={checkOutForm.bookingId}
                  onChange={(e) =>
                    setCheckOutForm((prev) => ({
                      ...prev,
                      bookingId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Select Guest --</option>
                  {checkOutReady.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.guest_name} ({booking.booking_reference_code})
                    </option>
                  ))}
                </select>
                {checkOutReady.length === 0 && (
                  <p className="text-gray-500 text-xs mt-2">
                    No guests ready for check-out
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Room Condition
                </label>
                <select
                  value={checkOutForm.roomCondition}
                  onChange={(e) =>
                    setCheckOutForm((prev) => ({
                      ...prev,
                      roomCondition: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Select --</option>
                  <option value="Good Condition">Good Condition</option>
                  <option value="Minor Damage">Minor Damage</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-light block mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Any damage or issues to report..."
                  value={checkOutForm.notes}
                  onChange={(e) =>
                    setCheckOutForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !checkOutForm.bookingId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                {isSubmitting ? "Checking Out..." : "Complete Check-Out"}
              </button>
            </form>
          </div>

          {/* Activity Summary */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="bg-gray-950 p-4 border-b border-gray-700">
              <h3 className="text-white font-bold">Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 flex items-center gap-2">
                    <LogIn size={16} className="text-green-400" />
                    Ready for Check-In
                  </p>
                  <p className="text-white font-bold text-lg">
                    {checkInReady.length}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 flex items-center gap-2">
                    <LogOut size={16} className="text-blue-400" />
                    Ready for Check-Out
                  </p>
                  <p className="text-white font-bold text-lg">
                    {checkOutReady.length}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Completed
                  </p>
                  <p className="text-white font-bold text-lg">
                    {
                      bookings.filter((b) => b.payment_status === "COMPLETED")
                        .length
                    }
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-semibold mb-3">
                  Recent Activity
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {bookings
                    .filter((b) =>
                      ["CHECKED_IN", "COMPLETED"].includes(b.payment_status),
                    )
                    .slice(0, 5)
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-gray-700/30 p-3 rounded-lg"
                      >
                        <p className="text-white text-sm font-medium">
                          {booking.guest_name}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-gray-400 text-xs">
                            {booking.booking_reference_code}
                          </p>
                          <StatusBadge status={booking.payment_status} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
