"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit, Trash2, X } from "lucide-react";
import {
  getAllBookings,
  getAllDayPassBookings,
  updateBookingStatus,
  updateDayPassBookingStatus,
} from "@/lib/services/booking";
import { getRoomById, getAllRooms } from "@/lib/services/rooms";

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
  special_requests?: string;
  room_price_ngn: number;
  number_of_nights: number;
  total_amount_ngn: number;
  payment_status: string;
  paystack_reference?: string;
  created_at: string;
}

interface DayPassBooking {
  id: string;
  reference_code: string;
  full_name: string;
  email: string;
  phone: string;
  visit_date: string;
  items: any[];
  total_amount: number;
  payment_status: string;
  paystack_reference?: string;
  created_at: string;
}

interface Room {
  id: string;
  title: string;
  description?: string;
  priceNGN?: number;
  price_ngn?: number;
  capacity: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-900/30 text-yellow-400 border-yellow-900/50",
    CONFIRMED: "bg-green-900/30 text-green-400 border-green-900/50",
    PAID: "bg-green-900/30 text-green-400 border-green-900/50",
    CHECKED_IN: "bg-blue-900/30 text-blue-400 border-blue-900/50",
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Room Booking Detail Modal
const RoomBookingModal = ({
  booking,
  isOpen,
  onClose,
  onApprove,
  onDecline,
  isUpdating,
}: {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDecline: () => void;
  isUpdating: boolean;
}) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => {
    if (isOpen && booking) {
      const fetchRoom = async () => {
        setLoadingRoom(true);
        const roomData = await getRoomById(booking.room_id);
        setRoom(roomData);
        setLoadingRoom(false);
      };
      fetchRoom();
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const statusMap: Record<string, string> = {
    PENDING: "Awaiting Confirmation",
    CONFIRMED: "Confirmed",
    PAID: "Payment Received",
    CHECKED_IN: "Guest Checked In",
    COMPLETED: "Stay Completed",
    CANCELLED: "Cancelled",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
          <h2 className="text-2xl font-light text-white cormorant">
            Room Booking Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Guest Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Guest Name</p>
                <p className="text-white font-medium">{booking.guest_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{booking.guest_email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-white font-medium">{booking.guest_phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Number of Guests</p>
                <p className="text-white font-medium">
                  {booking.number_of_guests} guest
                  {booking.number_of_guests !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Room Information */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Room Information
            </h3>
            {loadingRoom ? (
              <p className="text-gray-400">Loading room details...</p>
            ) : room ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Room Name</p>
                  <p className="text-white font-medium">{room.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Capacity</p>
                  <p className="text-white font-medium">
                    {room.capacity} guest
                    {room.capacity !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Room not found</p>
            )}
          </div>

          {/* Booking Details */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Booking Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Booking Reference</p>
                <p className="text-white font-medium font-mono">
                  {booking.booking_reference_code}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Check-In Date</p>
                <p className="text-white font-medium">
                  {formatDate(booking.check_in_date)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Check-Out Date</p>
                <p className="text-white font-medium">
                  {formatDate(booking.check_out_date)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Number of Nights</p>
                <p className="text-white font-medium">
                  {booking.number_of_nights} night
                  {booking.number_of_nights !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Price per Night</p>
                <p className="text-white font-medium">
                  ₦{booking.room_price_ngn.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-white font-medium text-lg">
                  ₦{booking.total_amount_ngn.toLocaleString()}
                </p>
              </div>
            </div>
            {booking.paystack_reference && (
              <div className="bg-blue-950/30 p-3 rounded border border-blue-600/40 mt-4">
                <p className="text-gray-300 text-sm mb-2">Paystack Reference</p>
                <p className="text-white font-medium font-mono text-base break-all">
                  {booking.paystack_reference}
                </p>
              </div>
            )}
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white">
                Special Requests
              </h3>
              <p className="text-gray-300 bg-gray-700/30 p-4 rounded-lg">
                {booking.special_requests}
              </p>
            </div>
          )}

          {/* Status */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">Current Status</h3>
            <div className="flex items-center gap-4">
              <StatusBadge status={booking.payment_status} />
              <p className="text-gray-400">
                {statusMap[booking.payment_status] || booking.payment_status}
              </p>
            </div>
          </div>

          {/* Booking Metadata */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Booking Metadata
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Booked On</p>
                <p className="text-white font-medium">
                  {formatDate(booking.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 border-t border-gray-700 p-6 bg-gray-800 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
            disabled={isUpdating}
          >
            Close
          </button>
          <button
            onClick={onDecline}
            className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            disabled={
              isUpdating ||
              booking.payment_status === "CANCELLED" ||
              booking.payment_status === "COMPLETED"
            }
          >
            {isUpdating ? "Updating..." : "Decline"}
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            disabled={
              isUpdating ||
              booking.payment_status === "COMPLETED" ||
              booking.payment_status === "CANCELLED"
            }
          >
            {isUpdating ? "Updating..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Day Pass Booking Detail Modal
const DayPassBookingModal = ({
  booking,
  isOpen,
  onClose,
  onApprove,
  onDecline,
  isUpdating,
}: {
  booking: DayPassBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDecline: () => void;
  isUpdating: boolean;
}) => {
  if (!isOpen || !booking) return null;

  const statusMap: Record<string, string> = {
    PENDING: "Awaiting Confirmation",
    CHECKED_IN: "Guest Checked In",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const itemsList = Array.isArray(booking.items)
    ? booking.items
    : Object.values(booking.items || {});

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
          <h2 className="text-2xl font-light text-white cormorant">
            Day Pass Booking Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Guest Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Guest Name</p>
                <p className="text-white font-medium">{booking.full_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{booking.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-white font-medium">{booking.phone}</p>
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">Visit Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Visit Date</p>
                <p className="text-white font-medium">
                  {formatDate(booking.visit_date)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Reference Code</p>
                <p className="text-white font-medium font-mono">
                  {booking.reference_code}
                </p>
              </div>
            </div>
            {booking.paystack_reference && (
              <div className="bg-gray-700/20 p-3 rounded border border-blue-600/30 mt-2">
                <p className="text-gray-400 text-sm mb-1">Paystack Reference</p>
                <p className="text-white font-medium font-mono text-base">
                  {booking.paystack_reference}
                </p>
              </div>
            )}
          </div>

          {/* Items Purchased */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Items Purchased
            </h3>
            {itemsList && itemsList.length > 0 ? (
              <div className="space-y-2">
                {itemsList.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-700/30 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {item.name || item.title || `Item ${idx + 1}`}
                      </p>
                      {item.quantity && (
                        <p className="text-gray-400 text-sm">
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                    {item.price && (
                      <p className="text-white font-semibold">
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No items recorded</p>
            )}
          </div>

          {/* Payment Summary */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Payment Summary
            </h3>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Total Amount</p>
                <p className="text-white font-semibold text-lg">
                  ₦{booking.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">Current Status</h3>
            <div className="flex items-center gap-4">
              <StatusBadge status={booking.payment_status} />
              <p className="text-gray-400">
                {statusMap[booking.payment_status] || booking.payment_status}
              </p>
            </div>
          </div>

          {/* Booking Metadata */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Booking Metadata
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Booked On</p>
                <p className="text-white font-medium">
                  {formatDate(booking.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 border-t border-gray-700 p-6 bg-gray-800 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            disabled={isUpdating}
          >
            Close
          </button>
          <button
            onClick={onDecline}
            className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition disabled:opacity-50"
            disabled={
              isUpdating ||
              booking.payment_status === "CANCELLED" ||
              booking.payment_status === "COMPLETED"
            }
          >
            {isUpdating ? "Updating..." : "Decline"}
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            disabled={
              isUpdating ||
              booking.payment_status === "CANCELLED" ||
              booking.payment_status === "COMPLETED"
            }
          >
            {isUpdating
              ? "Updating..."
              : booking.payment_status === "CHECKED_IN"
                ? "Check Out"
                : "Activate Pass"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BookingsManagement() {
  const [activeTab, setActiveTab] = useState<"rooms" | "daypass">("rooms");

  // Room Bookings State
  const [roomBookings, setRoomBookings] = useState<Booking[]>([]);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [roomSearchTerm, setRoomSearchTerm] = useState("");
  const [roomFilterStatus, setRoomFilterStatus] = useState("all");
  const [selectedRoomBookings, setSelectedRoomBookings] = useState<string[]>(
    [],
  );

  // Day Pass Bookings State
  const [dayPassBookings, setDayPassBookings] = useState<DayPassBooking[]>([]);
  const [dayPassLoading, setDayPassLoading] = useState(true);
  const [dayPassError, setDayPassError] = useState<string | null>(null);
  const [dayPassSearchTerm, setDayPassSearchTerm] = useState("");
  const [dayPassFilterStatus, setDayPassFilterStatus] = useState("all");
  const [selectedDayPassBookings, setSelectedDayPassBookings] = useState<
    string[]
  >([]);

  // Modal States
  const [selectedRoomBooking, setSelectedRoomBooking] =
    useState<Booking | null>(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedDayPassBooking, setSelectedDayPassBooking] =
    useState<DayPassBooking | null>(null);
  const [dayPassModalOpen, setDayPassModalOpen] = useState(false);
  const [isModalUpdating, setIsModalUpdating] = useState(false);

  // New Booking Modal States
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [newBookingType, setNewBookingType] = useState<
    "room" | "daypass" | null
  >(null);

  // Room Booking Form States
  const [roomForm, setRoomForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    pricePerNight: 0,
  });
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [roomFormLoading, setRoomFormLoading] = useState(false);
  const [roomFormError, setRoomFormError] = useState<string | null>(null);

  // Day Pass Booking Form States
  const [dayPassForm, setDayPassForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    visitDate: "",
    items: [] as { name: string; quantity: number; price: number }[],
    itemName: "",
    itemQuantity: 1,
    itemPrice: 0,
  });
  const [dayPassFormLoading, setDayPassFormLoading] = useState(false);
  const [dayPassFormError, setDayPassFormError] = useState<string | null>(null);

  // Load available rooms when room booking form opens
  useEffect(() => {
    if (newBookingType === "room") {
      const loadRooms = async () => {
        try {
          const rooms = await getAllRooms();
          setAvailableRooms(rooms);
        } catch (err) {
          console.error("Error loading rooms:", err);
          setRoomFormError("Failed to load available rooms");
        }
      };
      loadRooms();
    }
  }, [newBookingType]);

  // Fetch Room Bookings
  useEffect(() => {
    const fetchRoomBookings = async () => {
      try {
        setRoomLoading(true);
        const data = await getAllBookings();
        setRoomBookings(data);
        setRoomError(null);
      } catch (err) {
        console.error("Error fetching room bookings:", err);
        setRoomError("Failed to load room bookings");
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoomBookings();
  }, []);

  // Fetch Day Pass Bookings
  useEffect(() => {
    const fetchDayPassBookings = async () => {
      try {
        setDayPassLoading(true);
        const data = await getAllDayPassBookings();
        setDayPassBookings(data);
        setDayPassError(null);
      } catch (err) {
        console.error("Error fetching day-pass bookings:", err);
        setDayPassError("Failed to load day-pass bookings");
      } finally {
        setDayPassLoading(false);
      }
    };

    fetchDayPassBookings();
  }, []);

  // Filter Room Bookings
  const filteredRoomBookings = roomBookings.filter((booking) => {
    const matchesSearch =
      booking.guest_name.toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
      booking.booking_reference_code
        .toLowerCase()
        .includes(roomSearchTerm.toLowerCase()) ||
      booking.guest_email.toLowerCase().includes(roomSearchTerm.toLowerCase());
    const matchesFilter =
      roomFilterStatus === "all" || booking.payment_status === roomFilterStatus;
    return matchesSearch && matchesFilter;
  });

  // Filter Day Pass Bookings
  const filteredDayPassBookings = dayPassBookings.filter((booking) => {
    const matchesSearch =
      booking.full_name
        .toLowerCase()
        .includes(dayPassSearchTerm.toLowerCase()) ||
      booking.reference_code
        .toLowerCase()
        .includes(dayPassSearchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(dayPassSearchTerm.toLowerCase());
    const matchesFilter =
      dayPassFilterStatus === "all" ||
      booking.payment_status === dayPassFilterStatus;
    return matchesSearch && matchesFilter;
  });

  // Room Booking Modal Handlers
  const handleOpenRoomModal = (booking: Booking) => {
    setSelectedRoomBooking(booking);
    setRoomModalOpen(true);
  };

  const handleCloseRoomModal = () => {
    setRoomModalOpen(false);
    setSelectedRoomBooking(null);
  };

  const handleApproveRoomBooking = async () => {
    if (!selectedRoomBooking) return;
    setIsModalUpdating(true);
    try {
      const newStatus =
        selectedRoomBooking.payment_status === "PENDING"
          ? "CONFIRMED"
          : "CHECKED_IN";
      const updated = await updateBookingStatus(
        selectedRoomBooking.id,
        newStatus,
      );
      if (updated) {
        setRoomBookings((prev) =>
          prev.map((b) =>
            b.id === selectedRoomBooking.id
              ? { ...b, payment_status: newStatus }
              : b,
          ),
        );
        setSelectedRoomBooking({
          ...selectedRoomBooking,
          payment_status: newStatus,
        });
      }
    } catch (err) {
      console.error("Error approving booking:", err);
    } finally {
      setIsModalUpdating(false);
    }
  };

  const handleDeclineRoomBooking = async () => {
    if (!selectedRoomBooking) return;
    setIsModalUpdating(true);
    try {
      const updated = await updateBookingStatus(
        selectedRoomBooking.id,
        "CANCELLED",
      );
      if (updated) {
        setRoomBookings((prev) =>
          prev.map((b) =>
            b.id === selectedRoomBooking.id
              ? { ...b, payment_status: "CANCELLED" }
              : b,
          ),
        );
        setSelectedRoomBooking({
          ...selectedRoomBooking,
          payment_status: "CANCELLED",
        });
      }
    } catch (err) {
      console.error("Error declining booking:", err);
    } finally {
      setIsModalUpdating(false);
    }
  };

  // Day Pass Modal Handlers
  const handleOpenDayPassModal = (booking: DayPassBooking) => {
    setSelectedDayPassBooking(booking);
    setDayPassModalOpen(true);
  };

  const handleCloseDayPassModal = () => {
    setDayPassModalOpen(false);
    setSelectedDayPassBooking(null);
  };

  const handleApproveDayPassBooking = async () => {
    if (!selectedDayPassBooking) return;
    setIsModalUpdating(true);
    try {
      // Allow activation from PENDING, CHECKED_IN, or COMPLETED (for legacy online payments)
      let newStatus: string;
      if (selectedDayPassBooking.payment_status === "COMPLETED") {
        // Legacy: if payment was marked complete, treat as needing activation
        newStatus = "CHECKED_IN";
      } else if (selectedDayPassBooking.payment_status === "PENDING") {
        newStatus = "CHECKED_IN";
      } else if (selectedDayPassBooking.payment_status === "CHECKED_IN") {
        newStatus = "COMPLETED";
      } else {
        newStatus = "CHECKED_IN";
      }

      const updated = await updateDayPassBookingStatus(
        selectedDayPassBooking.id,
        newStatus,
      );
      if (updated) {
        setDayPassBookings((prev) =>
          prev.map((b) =>
            b.id === selectedDayPassBooking.id
              ? { ...b, payment_status: newStatus }
              : b,
          ),
        );
        setSelectedDayPassBooking({
          ...selectedDayPassBooking,
          payment_status: newStatus,
        });
      }
    } catch (err) {
      console.error("Error approving day-pass booking:", err);
    } finally {
      setIsModalUpdating(false);
    }
  };

  const handleDeclineDayPassBooking = async () => {
    if (!selectedDayPassBooking) return;
    setIsModalUpdating(true);
    try {
      const updated = await updateDayPassBookingStatus(
        selectedDayPassBooking.id,
        "CANCELLED",
      );
      if (updated) {
        setDayPassBookings((prev) =>
          prev.map((b) =>
            b.id === selectedDayPassBooking.id
              ? { ...b, payment_status: "CANCELLED" }
              : b,
          ),
        );
        setSelectedDayPassBooking({
          ...selectedDayPassBooking,
          payment_status: "CANCELLED",
        });
      }
    } catch (err) {
      console.error("Error declining day-pass booking:", err);
    } finally {
      setIsModalUpdating(false);
    }
  };

  // Room Booking Form Handlers
  const handleCreateRoomBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoomFormError(null);

    // Validation
    if (
      !roomForm.guestName ||
      !roomForm.guestEmail ||
      !roomForm.guestPhone ||
      !roomForm.roomId ||
      !roomForm.checkInDate ||
      !roomForm.checkOutDate ||
      !roomForm.pricePerNight ||
      roomForm.pricePerNight <= 0
    ) {
      setRoomFormError(
        "Please fill in all required fields and enter a valid price",
      );
      return;
    }

    const checkIn = new Date(roomForm.checkInDate);
    const checkOut = new Date(roomForm.checkOutDate);

    if (checkIn >= checkOut) {
      setRoomFormError("Check-out date must be after check-in date");
      return;
    }

    try {
      setRoomFormLoading(true);

      // Calculate nights and total amount
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      const totalAmount = roomForm.pricePerNight * nights;

      // Submit to API
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: roomForm.guestName,
          guestEmail: roomForm.guestEmail,
          guestPhone: roomForm.guestPhone,
          roomId: roomForm.roomId,
          checkInDate: new Date(roomForm.checkInDate).toISOString(),
          checkOutDate: new Date(roomForm.checkOutDate).toISOString(),
          numberOfGuests: 1,
          specialRequests: "",
          roomPriceNGN: roomForm.pricePerNight,
          numberOfNights: nights,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create booking");
      }

      // Reset form and refresh bookings
      setRoomForm({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        pricePerNight: 0,
      });
      setNewBookingModalOpen(false);
      setNewBookingType(null);

      // Refresh bookings list
      const updatedBookings = await getAllBookings();
      setRoomBookings(updatedBookings);
    } catch (err) {
      console.error("Error creating room booking:", err);
      setRoomFormError(
        err instanceof Error ? err.message : "Failed to create booking",
      );
    } finally {
      setRoomFormLoading(false);
    }
  };

  // Day Pass Booking Form Handlers
  const handleAddDayPassItem = () => {
    if (
      !dayPassForm.itemName ||
      dayPassForm.itemQuantity < 1 ||
      dayPassForm.itemPrice < 0
    ) {
      setDayPassFormError("Please fill in item details correctly");
      return;
    }

    const newItem = {
      name: dayPassForm.itemName,
      quantity: dayPassForm.itemQuantity,
      price: dayPassForm.itemPrice,
    };

    setDayPassForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      itemName: "",
      itemQuantity: 1,
      itemPrice: 0,
    }));
    setDayPassFormError(null);
  };

  const handleRemoveDayPassItem = (index: number) => {
    setDayPassForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleCreateDayPassBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setDayPassFormError(null);

    // Validation
    if (
      !dayPassForm.fullName ||
      !dayPassForm.email ||
      !dayPassForm.phone ||
      !dayPassForm.visitDate ||
      dayPassForm.items.length === 0
    ) {
      setDayPassFormError(
        "Please fill in all required fields and add at least one item",
      );
      return;
    }

    try {
      setDayPassFormLoading(true);

      // Calculate total amount
      const totalAmount = dayPassForm.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Submit to API
      const response = await fetch("/api/day-pass/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: dayPassForm.fullName,
          email: dayPassForm.email,
          phone: dayPassForm.phone,
          visitDate: dayPassForm.visitDate,
          items: dayPassForm.items,
          totalAmount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create booking");
      }

      // Reset form and refresh bookings
      setDayPassForm({
        fullName: "",
        email: "",
        phone: "",
        visitDate: "",
        items: [],
        itemName: "",
        itemQuantity: 1,
        itemPrice: 0,
      });
      setNewBookingModalOpen(false);
      setNewBookingType(null);

      // Refresh bookings list
      const updatedBookings = await getAllDayPassBookings();
      setDayPassBookings(updatedBookings);
    } catch (err) {
      console.error("Error creating day-pass booking:", err);
      setDayPassFormError(
        err instanceof Error ? err.message : "Failed to create booking",
      );
    } finally {
      setDayPassFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white cormorant">Bookings</h1>
          <p className="text-gray-400">
            {roomBookings.length + dayPassBookings.length} total bookings • Live
          </p>
        </div>
        <button
          onClick={() => {
            setNewBookingModalOpen(true);
            setNewBookingType(null);
          }}
          className="bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg"
        >
          + New Booking
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "rooms"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 border-b-2 border-transparent hover:text-gray-300"
            }`}
          >
            Room Bookings ({roomBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("daypass")}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === "daypass"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 border-b-2 border-transparent hover:text-gray-300"
            }`}
          >
            Day Pass Bookings ({dayPassBookings.length})
          </button>
        </div>
      </div>

      {/* Room Bookings Tab */}
      {activeTab === "rooms" && (
        <div className="space-y-6">
          {/* Error Message */}
          {roomError && (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-300">
              {roomError}
            </div>
          )}

          {/* Filters & Search */}
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search by guest name, email, or booking ID..."
                  value={roomSearchTerm}
                  onChange={(e) => setRoomSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <div className="relative">
                <select
                  value={roomFilterStatus}
                  onChange={(e) => setRoomFilterStatus(e.target.value)}
                  className="appearance-none pl-12 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CHECKED_IN">Checked In</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <Filter
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Room Bookings Table */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
            {roomLoading ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">Loading room bookings...</p>
              </div>
            ) : filteredRoomBookings.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">No room bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-950/50">
                      <th className="px-3 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoomBookings(
                                filteredRoomBookings.map((b) => b.id),
                              );
                            } else {
                              setSelectedRoomBookings([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Booking ID
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Guest
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Check-In / Check-Out
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Nights
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Amount
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Guests
                      </th>
                      <th className="px-3 py-3 text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoomBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg cursor-pointer hover:translate-x-1"
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRoomBookings.includes(booking.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRoomBookings([
                                  ...selectedRoomBookings,
                                  booking.id,
                                ]);
                              } else {
                                setSelectedRoomBookings(
                                  selectedRoomBookings.filter(
                                    (id) => id !== booking.id,
                                  ),
                                );
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-white font-semibold text-sm">
                            {booking.booking_reference_code}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div
                            onClick={() => handleOpenRoomModal(booking)}
                            className="cursor-pointer hover:opacity-80 transition"
                          >
                            <p className="text-white font-medium text-sm hover:text-blue-400">
                              {booking.guest_name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {booking.guest_email}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div>
                            <p className="text-white text-sm">
                              {formatDate(booking.check_in_date)}
                            </p>
                            <p className="text-gray-400 text-xs">
                              to {formatDate(booking.check_out_date)}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-white text-sm">
                            {booking.number_of_nights}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-white font-semibold text-sm">
                            ₦{booking.total_amount_ngn.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge status={booking.payment_status} />
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-white text-sm">
                            {booking.number_of_guests}
                          </p>
                        </td>
                        <td className="px-3 py-3">
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
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {filteredRoomBookings.length} of {roomBookings.length}{" "}
              room bookings
            </p>
          </div>
        </div>
      )}

      {/* Day Pass Bookings Tab */}
      {activeTab === "daypass" && (
        <div className="space-y-6">
          {/* Error Message */}
          {dayPassError && (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-300">
              {dayPassError}
            </div>
          )}

          {/* Filters & Search */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search by guest name, email, or reference ID..."
                  value={dayPassSearchTerm}
                  onChange={(e) => setDayPassSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <div className="relative">
                <select
                  value={dayPassFilterStatus}
                  onChange={(e) => setDayPassFilterStatus(e.target.value)}
                  className="appearance-none pl-12 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <Filter
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Day Pass Bookings Table */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
            {dayPassLoading ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">Loading day-pass bookings...</p>
              </div>
            ) : filteredDayPassBookings.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">No day-pass bookings found</p>
              </div>
            ) : (
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
                              setSelectedDayPassBookings(
                                filteredDayPassBookings.map((b) => b.id),
                              );
                            } else {
                              setSelectedDayPassBookings([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                        Reference ID
                      </th>
                      <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                        Guest
                      </th>
                      <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                        Visit Date
                      </th>
                      <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDayPassBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg cursor-pointer hover:translate-x-1"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedDayPassBookings.includes(
                              booking.id,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDayPassBookings([
                                  ...selectedDayPassBookings,
                                  booking.id,
                                ]);
                              } else {
                                setSelectedDayPassBookings(
                                  selectedDayPassBookings.filter(
                                    (id) => id !== booking.id,
                                  ),
                                );
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold text-sm">
                            {booking.reference_code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            onClick={() => handleOpenDayPassModal(booking)}
                            className="cursor-pointer hover:opacity-80 transition"
                          >
                            <p className="text-white font-medium text-sm hover:text-blue-400">
                              {booking.full_name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {booking.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">
                            {formatDate(booking.visit_date)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">
                            {booking.items?.length || 0} item
                            {(booking.items?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold text-sm">
                            ₦{booking.total_amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.payment_status} />
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
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {filteredDayPassBookings.length} of{" "}
              {dayPassBookings.length} day-pass bookings
            </p>
          </div>
        </div>
      )}

      {/* New Booking Type Selector Modal */}
      {newBookingModalOpen && !newBookingType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-light text-white cormorant">
                Create New Booking
              </h2>
              <button
                onClick={() => {
                  setNewBookingModalOpen(false);
                  setNewBookingType(null);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-sm">
                Select the type of booking you want to create:
              </p>

              <button
                onClick={() => {
                  setNewBookingType("room");
                }}
                className="w-full p-4 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-900/50 rounded-lg transition text-left"
              >
                <h3 className="text-white font-semibold">Room Booking</h3>
                <p className="text-gray-400 text-sm">
                  Create a new room reservation
                </p>
              </button>

              <button
                onClick={() => {
                  setNewBookingType("daypass");
                }}
                className="w-full p-4 bg-green-900/30 hover:bg-green-900/50 border border-green-900/50 rounded-lg transition text-left"
              >
                <h3 className="text-white font-semibold">Day Pass Booking</h3>
                <p className="text-gray-400 text-sm">
                  Create a new day-pass booking
                </p>
              </button>
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setNewBookingModalOpen(false);
                  setNewBookingType(null);
                }}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Booking Creation Form Modal */}
      {newBookingModalOpen && newBookingType === "room" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-2xl font-light text-white cormorant">
                Create Room Booking
              </h2>
              <button
                onClick={() => {
                  setNewBookingModalOpen(false);
                  setNewBookingType(null);
                  setRoomFormError(null);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomBooking} className="p-6 space-y-6">
              {roomFormError && (
                <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{roomFormError}</p>
                </div>
              )}

              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Guest Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={roomForm.guestName}
                    onChange={(e) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        guestName: e.target.value,
                      }))
                    }
                    className="col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={roomForm.guestEmail}
                    onChange={(e) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        guestEmail: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={roomForm.guestPhone}
                    onChange={(e) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        guestPhone: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Room Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Room Selection
                </h3>
                <select
                  value={roomForm.roomId}
                  onChange={(e) =>
                    setRoomForm((prev) => ({
                      ...prev,
                      roomId: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a room...</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.title} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Per Night */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Price Per Night
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">₦</span>
                  <input
                    type="number"
                    placeholder="Enter price per night"
                    min="1000"
                    step="1000"
                    value={roomForm.pricePerNight || ""}
                    onChange={(e) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        pricePerNight: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Booking Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Booking Dates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={roomForm.checkInDate}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          checkInDate: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={roomForm.checkOutDate}
                      onChange={(e) =>
                        setRoomForm((prev) => ({
                          ...prev,
                          checkOutDate: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setNewBookingModalOpen(false);
                    setNewBookingType(null);
                    setRoomForm({
                      guestName: "",
                      guestEmail: "",
                      guestPhone: "",
                      roomId: "",
                      checkInDate: "",
                      checkOutDate: "",
                      pricePerNight: 0,
                    });
                    setRoomFormError(null);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roomFormLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {roomFormLoading ? "Creating..." : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Day Pass Booking Creation Form Modal */}
      {newBookingModalOpen && newBookingType === "daypass" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-2xl font-light text-white cormorant">
                Create Day Pass Booking
              </h2>
              <button
                onClick={() => {
                  setNewBookingModalOpen(false);
                  setNewBookingType(null);
                  setDayPassFormError(null);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form
              onSubmit={handleCreateDayPassBooking}
              className="p-6 space-y-6"
            >
              {dayPassFormError && (
                <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{dayPassFormError}</p>
                </div>
              )}

              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Guest Information
                </h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={dayPassForm.fullName}
                  onChange={(e) =>
                    setDayPassForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={dayPassForm.email}
                    onChange={(e) =>
                      setDayPassForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={dayPassForm.phone}
                    onChange={(e) =>
                      setDayPassForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {/* Visit Date */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Visit Details
                </h3>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={dayPassForm.visitDate}
                    onChange={(e) =>
                      setDayPassForm((prev) => ({
                        ...prev,
                        visitDate: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Items</h3>
                <div className="space-y-3 bg-gray-700/20 p-4 rounded-lg">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Lunch Package"
                      value={dayPassForm.itemName}
                      onChange={(e) =>
                        setDayPassForm((prev) => ({
                          ...prev,
                          itemName: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={dayPassForm.itemQuantity}
                        onChange={(e) =>
                          setDayPassForm((prev) => ({
                            ...prev,
                            itemQuantity: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={dayPassForm.itemPrice}
                        onChange={(e) =>
                          setDayPassForm((prev) => ({
                            ...prev,
                            itemPrice: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDayPassItem}
                    className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    Add Item
                  </button>
                </div>

                {dayPassForm.items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-gray-300 font-semibold">
                      Added Items:
                    </h4>
                    {dayPassForm.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-700/30 p-3 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">
                            Qty: {item.quantity} × ₦
                            {item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveDayPassItem(idx)}
                            className="text-red-400 hover:text-red-300 text-xs mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <p className="text-gray-400 text-sm">Total Amount</p>
                      <p className="text-white font-semibold text-lg">
                        ₦
                        {dayPassForm.items
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0,
                          )
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setNewBookingModalOpen(false);
                    setNewBookingType(null);
                    setDayPassForm({
                      fullName: "",
                      email: "",
                      phone: "",
                      visitDate: "",
                      items: [],
                      itemName: "",
                      itemQuantity: 1,
                      itemPrice: 0,
                    });
                    setDayPassFormError(null);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dayPassFormLoading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dayPassFormLoading ? "Creating..." : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <RoomBookingModal
        booking={selectedRoomBooking}
        isOpen={roomModalOpen}
        onClose={handleCloseRoomModal}
        onApprove={handleApproveRoomBooking}
        onDecline={handleDeclineRoomBooking}
        isUpdating={isModalUpdating}
      />
      <DayPassBookingModal
        booking={selectedDayPassBooking}
        isOpen={dayPassModalOpen}
        onClose={handleCloseDayPassModal}
        onApprove={handleApproveDayPassBooking}
        onDecline={handleDeclineDayPassBooking}
        isUpdating={isModalUpdating}
      />
    </div>
  );
}
