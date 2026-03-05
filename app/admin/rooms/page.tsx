"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Save,
  Loader,
} from "lucide-react";

interface Room {
  id: string;
  title: string;
  description?: string;
  pricengn?: number;
  price?: number;
  capacity: number;
  status: string;
  amenities?: string[];
  images?: string[];
}

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
    case "fully-booked":
      return <Lock size={20} className="text-gray-500" />;
    default:
      return <AlertCircle size={20} className="text-gray-400" />;
  }
};

const RoomCard = ({
  room,
  onPriceUpdate,
  onStatusUpdate,
  onDelete,
  isUpdating,
}: {
  room: Room;
  onPriceUpdate: (roomId: string, newPrice: number) => void;
  onStatusUpdate: (roomId: string, newStatus: string) => void;
  onDelete: (roomId: string) => void;
  isUpdating: boolean;
}) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Use price field which is mapped from pricengn by API
  const displayPrice = room.price || room.pricengn || 0;
  const [editPrice, setEditPrice] = useState(displayPrice.toString());

  // Sync editPrice when room price changes
  useEffect(() => {
    setEditPrice(displayPrice.toString());
  }, [displayPrice]);

  const statusConfig = {
    booked: { color: "bg-blue-500", label: "Booked", icon: "📅" },
    available: { color: "bg-blue-600", label: "Available", icon: "✓" },
    maintenance: { color: "bg-blue-400", label: "Maintenance", icon: "🔧" },
    blocked: { color: "bg-blue-300", label: "Blocked", icon: "🚫" },
    "fully-booked": { color: "bg-blue-900", label: "Fully Booked", icon: "🔒" },
  };

  const currentStatus =
    statusConfig[room.status as keyof typeof statusConfig] ||
    statusConfig.available;

  const handleSavePrice = () => {
    const newPrice = parseInt(editPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onPriceUpdate(room.id, newPrice);
      setIsEditingPrice(false);
    }
  };

  const handleCancelEdit = () => {
    setEditPrice(displayPrice.toString());
    setIsEditingPrice(false);
  };

  const toggleFullyBooked = () => {
    const newStatus =
      room.status === "fully-booked" ? "available" : "fully-booked";
    onStatusUpdate(room.id, newStatus);
  };

  const isFullyBooked = room.status === "fully-booked";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-blue-100">
      {/* Header with Status Badge */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 px-6 py-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {room.id.toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{room.title}</p>
          </div>
          <div
            className={`${currentStatus.color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
          >
            <span>{currentStatus.icon}</span>
            {currentStatus.label}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>👥</span>
          <span>{room.capacity} guests max</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Price Section */}
        <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50 hover:bg-blue-100 transition">
          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-3">
            Price Per Night
          </p>
          <div
            className="cursor-pointer group"
            onClick={() => setIsEditingPrice(true)}
          >
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold text-gray-900">
                ₦{displayPrice.toLocaleString()}
              </p>
              <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition text-sm font-semibold flex items-center gap-1">
                <Edit size={16} />
                Click to Edit
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={toggleFullyBooked}
            disabled={isUpdating}
            className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 ${
              isFullyBooked
                ? "bg-blue-900 hover:bg-blue-950 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            title={isFullyBooked ? "Mark as Available" : "Mark as Fully Booked"}
          >
            {isFullyBooked ? (
              <>
                <Lock size={16} />
                <span>Booked</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Available</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isUpdating}
            className="w-full py-2 px-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Price Edit Modal */}
      {isEditingPrice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Edit Price</h2>
              <button
                onClick={() => handleCancelEdit()}
                className="text-white hover:bg-white/20 p-1 rounded transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Current Price</p>
                <p className="text-4xl font-bold text-gray-900">
                  ₦{displayPrice.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  New Price
                </label>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border-2 border-gray-200">
                  <span className="text-2xl font-bold text-gray-600">₦</span>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="flex-1 text-2xl font-bold text-gray-900 focus:outline-none bg-transparent"
                    placeholder="0"
                    disabled={isUpdating}
                    autoFocus
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSavePrice}
                  disabled={isUpdating}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Delete Room</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-900 font-semibold mb-2">
                  {room.title || room.id}
                </p>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete this room? This action cannot
                  be undone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onDelete(room.id);
                    setShowDeleteModal(false);
                  }}
                  disabled={isUpdating}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isUpdating}
                  className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch rooms from Supabase on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/rooms");
        const data = await response.json();

        if (data.success && data.rooms) {
          setRooms(data.rooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handlePriceUpdate = async (roomId: string, newPrice: number) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
      });

      const data = await response.json();

      if (data.success && data.room) {
        // Update with the normalized room from API
        setRooms(
          rooms.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  ...data.room, // Use actual response including pricengn and price
                  pricengn: data.room.price, // Ensure pricengn is in sync
                }
              : room,
          ),
        );
        console.log("Price updated successfully:", data.room);
      } else {
        console.error("Price update failed:", data.error);
      }
    } catch (error) {
      console.error("Error updating price:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async (roomId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setRooms(
          rooms.map((room) =>
            room.id === roomId ? { ...room, status: newStatus } : room,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setRooms(rooms.filter((room) => room.id !== roomId));
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const bookedRooms = rooms.filter((r) => r.status === "booked").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = rooms.filter(
    (r) => r.status === "maintenance",
  ).length;
  const fullyBookedRooms = rooms.filter(
    (r) => r.status === "fully-booked",
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader
            size={48}
            className="animate-spin text-blue-400 mx-auto mb-4"
          />
          <p className="text-gray-400">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Room Management
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Edit prices, manage availability & fully booked status
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
          disabled={isUpdating}
        >
          <Plus size={20} />
          Add Room
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all">
          <p className="text-blue-300 text-sm uppercase tracking-wider font-semibold mb-2">
            Total Rooms
          </p>
          <p className="text-4xl font-black text-white">{rooms.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600/30 to-green-700/30 backdrop-blur-sm rounded-2xl p-5 border border-green-400/30 hover:border-green-400/60 transition-all">
          <p className="text-green-300 text-sm uppercase tracking-wider font-semibold mb-2">
            Available
          </p>
          <p className="text-4xl font-black text-green-400">{availableRooms}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600/30 to-pink-700/30 backdrop-blur-sm rounded-2xl p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all">
          <p className="text-purple-300 text-sm uppercase tracking-wider font-semibold mb-2">
            Fully Booked
          </p>
          <p className="text-4xl font-black text-purple-400">
            {fullyBookedRooms}
          </p>
        </div>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="text-center py-16">
          <Lock size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg mb-2">No rooms found</p>
          <p className="text-gray-500 text-sm">
            Create your first room to get started managing your inventory
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onPriceUpdate={handlePriceUpdate}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
