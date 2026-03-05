"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Flag,
  LogIn,
  LogOut,
  MessageSquare,
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

interface OperationsNote {
  id: string;
  booking_id: string;
  note_type: "note" | "issue";
  note: string;
  created_by?: string;
  created_at: string;
}

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getStayDuration = (checkInDate: string) => {
  const start = new Date(checkInDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - start);
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days === 0) return `${hours}h`;
  return `${days}d ${hours}h`;
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
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomNames, setRoomNames] = useState<Record<string, string>>({});
  const [notesMap, setNotesMap] = useState<
    Record<string, { note?: string; issue?: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"workflow" | "monitor">(
    "workflow",
  );
  const [checkInForm, setCheckInForm] = useState({ bookingId: "", notes: "" });
  const [checkOutForm, setCheckOutForm] = useState({
    bookingId: "",
    roomCondition: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [bookingsData, roomsResponse, notesResponse] = await Promise.all([
        getAllBookings(),
        fetch("/api/rooms"),
        fetch("/api/admin/operations/notes"),
      ]);

      setBookings(bookingsData || []);

      if (roomsResponse.ok) {
        const roomsPayload = await roomsResponse.json();
        const map: Record<string, string> = {};
        (roomsPayload?.rooms || []).forEach((room: any) => {
          map[room.id] = room.title || room.id;
        });
        setRoomNames(map);
      }

      if (notesResponse.ok) {
        const notesPayload = await notesResponse.json();
        const map: Record<string, { note?: string; issue?: string }> = {};
        (notesPayload?.notes || []).forEach((entry: OperationsNote) => {
          if (!map[entry.booking_id]) map[entry.booking_id] = {};
          if (entry.note_type === "issue") {
            map[entry.booking_id].issue = entry.note;
          } else {
            map[entry.booking_id].note = entry.note;
          }
        });
        setNotesMap(map);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching operations data:", err);
      setError("Failed to load operations data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const checkInReady = useMemo(
    () => bookings.filter((b) => b.payment_status === "CONFIRMED"),
    [bookings],
  );

  const checkOutReady = useMemo(
    () => bookings.filter((b) => b.payment_status === "CHECKED_IN"),
    [bookings],
  );

  const checkedInGuests = checkOutReady;

  const saveOperationsNote = async (
    bookingId: string,
    noteType: "note" | "issue",
    noteText: string,
  ) => {
    if (!noteText.trim()) return;

    const response = await fetch("/api/admin/operations/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        noteType,
        note: noteText.trim(),
        createdBy: "operations-admin",
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload.error || "Failed to save note");
    }

    setNotesMap((prev) => ({
      ...prev,
      [bookingId]: {
        ...(prev[bookingId] || {}),
        [noteType]: noteText.trim(),
      },
    }));
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInForm.bookingId) return;

    try {
      setIsSubmitting(true);
      const booking = bookings.find(
        (b) => String(b.id) === String(checkInForm.bookingId),
      );
      if (!booking) return;

      const updated = await updateBookingStatus(booking.id, "CHECKED_IN");
      if (updated) {
        if (checkInForm.notes.trim()) {
          await saveOperationsNote(booking.id, "note", checkInForm.notes);
        }
        await refreshData();
        setCheckInForm({ bookingId: "", notes: "" });
        setSuccessMessage(
          `Guest ${booking.guest_name} checked in successfully!`,
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error checking in:", err);
      setError("Failed to check in guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkOutForm.bookingId) return;

    try {
      setIsSubmitting(true);
      const booking = bookings.find(
        (b) => String(b.id) === String(checkOutForm.bookingId),
      );
      if (!booking) return;

      const updated = await updateBookingStatus(booking.id, "COMPLETED");
      if (updated) {
        const notesBundle = [checkOutForm.roomCondition, checkOutForm.notes]
          .filter(Boolean)
          .join(" | ");
        if (notesBundle.trim()) {
          await saveOperationsNote(booking.id, "note", notesBundle);
        }
        await refreshData();
        setCheckOutForm({ bookingId: "", roomCondition: "", notes: "" });
        setSuccessMessage(
          `Guest ${booking.guest_name} checked out successfully!`,
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error checking out:", err);
      setError("Failed to check out guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async (booking: Booking) => {
    const note = window.prompt(
      "Add status note",
      notesMap[booking.id]?.note || "",
    );
    if (note === null) return;
    if (!note.trim()) return;

    try {
      await saveOperationsNote(booking.id, "note", note);
      setSuccessMessage(`Note saved for ${booking.guest_name}`);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (error: any) {
      setError(error.message || "Failed to save note");
    }
  };

  const handleFlagIssue = async (booking: Booking) => {
    const issue = window.prompt(
      "Flag an issue",
      notesMap[booking.id]?.issue || "",
    );
    if (issue === null) return;
    if (!issue.trim()) return;

    try {
      await saveOperationsNote(booking.id, "issue", issue);
      setSuccessMessage(`Issue flagged for ${booking.guest_name}`);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (error: any) {
      setError(error.message || "Failed to flag issue");
    }
  };

  const handleCheckoutNow = async (booking: Booking) => {
    try {
      setIsSubmitting(true);
      await updateBookingStatus(booking.id, "COMPLETED");
      await refreshData();
      setSuccessMessage(`${booking.guest_name} checked out successfully!`);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch {
      setError("Failed to checkout guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light text-white cormorant">
          Check-In / Check-Out
        </h1>
        <p className="text-gray-400">Manage guest arrivals and departures</p>
      </div>

      <div className="flex gap-4 border-b border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-5 py-3 font-semibold whitespace-nowrap ${
            activeTab === "workflow"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Check-In / Check-Out
        </button>
        <button
          onClick={() => setActiveTab("monitor")}
          className={`px-5 py-3 font-semibold whitespace-nowrap ${
            activeTab === "monitor"
              ? "text-white border-b-2 border-green-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Checked-In Monitor ({checkedInGuests.length})
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-900/30 border border-green-900/50 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-400" />
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

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
      ) : activeTab === "workflow" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                {isSubmitting ? "Checking In..." : "Complete Check-In"}
              </button>
            </form>
          </div>

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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                {isSubmitting ? "Checking Out..." : "Complete Check-Out"}
              </button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
            <div className="bg-gray-950 p-4 border-b border-gray-700">
              <h3 className="text-white font-bold">Summary</h3>
            </div>
            <div className="p-6 space-y-4">
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
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="bg-gray-950 p-4 border-b border-gray-700">
            <h3 className="text-white font-bold">Checked-In Guest Monitor</h3>
            <p className="text-gray-400 text-sm mt-1">
              Monitor all currently checked-in guests in one place
            </p>
          </div>

          {checkedInGuests.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No checked-in guests right now.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900/40">
                    <th className="px-3 py-3 text-left text-gray-400">
                      Guest Name
                    </th>
                    <th className="px-3 py-3 text-left text-gray-400">Room</th>
                    <th className="px-3 py-3 text-left text-gray-400">
                      Check-In Time
                    </th>
                    <th className="px-3 py-3 text-left text-gray-400">
                      Stay Duration
                    </th>
                    <th className="px-3 py-3 text-left text-gray-400">
                      Checkout Due
                    </th>
                    <th className="px-3 py-3 text-left text-gray-400">
                      Status Notes
                    </th>
                    <th className="px-3 py-3 text-left text-gray-400">
                      Quick Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {checkedInGuests.map((booking) => {
                    const note = notesMap[booking.id]?.note;
                    const issue = notesMap[booking.id]?.issue;
                    return (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-700 hover:bg-gray-700/20"
                      >
                        <td className="px-3 py-3">
                          <p className="text-white font-medium">
                            {booking.guest_name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {booking.booking_reference_code}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-gray-200">
                          {roomNames[booking.room_id] || booking.room_id}
                        </td>
                        <td className="px-3 py-3 text-gray-200">
                          {formatDateTime(booking.check_in_date)}
                        </td>
                        <td className="px-3 py-3 text-gray-200">
                          {getStayDuration(booking.check_in_date)}
                        </td>
                        <td className="px-3 py-3 text-gray-200">
                          {formatDateTime(booking.check_out_date)}
                        </td>
                        <td className="px-3 py-3">
                          {note ? (
                            <p className="text-gray-200 text-xs mb-1">
                              📝 {note}
                            </p>
                          ) : (
                            <p className="text-gray-500 text-xs">No note</p>
                          )}
                          {issue ? (
                            <p className="text-red-300 text-xs">🚩 {issue}</p>
                          ) : null}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => router.push("/admin/bookings")}
                              className="px-2.5 py-1.5 rounded-md bg-blue-900/40 text-blue-300 hover:bg-blue-900/60 flex items-center gap-1"
                            >
                              <Eye size={14} /> View booking
                            </button>
                            <button
                              onClick={() => handleAddNote(booking)}
                              className="px-2.5 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 flex items-center gap-1"
                            >
                              <MessageSquare size={14} /> Add note
                            </button>
                            <button
                              onClick={() => handleFlagIssue(booking)}
                              className="px-2.5 py-1.5 rounded-md bg-amber-900/40 text-amber-300 hover:bg-amber-900/60 flex items-center gap-1"
                            >
                              <Flag size={14} /> Flag issue
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
