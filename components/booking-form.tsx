"use client";

import { useState, useEffect } from "react";
import { format, isPast, addDays } from "date-fns";
import Calendar from "react-calendar";

interface Room {
  id: string;
  title: string;
  priceNGN: number;
}

interface BookingFormProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  checkIn: Date;
  onCheckInChange: (date: Date) => void;
  checkOut: Date;
  onCheckOutChange: (date: Date) => void;
  guests: number;
  onGuestsChange: (guests: number) => void;
}

export default function BookingForm({
  rooms,
  selectedRoom,
  onRoomSelect,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
}: BookingFormProps) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);

  // Check availability whenever room or dates change
  useEffect(() => {
    if (!selectedRoom) return;

    const checkAvailability = async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/bookings/check-availability?roomId=${selectedRoom.id}&checkIn=${format(
            checkIn,
            "yyyy-MM-dd",
          )}&checkOut=${format(checkOut, "yyyy-MM-dd")}`,
        );
        const data = await res.json();
        setAvailable(data.available);
      } catch (error) {
        console.error("Failed to check availability:", error);
        setAvailable(false);
      } finally {
        setChecking(false);
      }
    };

    checkAvailability();
  }, [selectedRoom, checkIn, checkOut]);

  // Validate dates
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isValidCheckIn = !isPast(checkIn) && checkIn < checkOut;
  const isValidCheckOut = checkOut > checkIn;
  const totalPrice = selectedRoom ? selectedRoom.priceNGN * nights : 0;

  return (
    <div className="space-y-6">
      {/* Room Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select a Room
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={`p-4 rounded-lg border-2 transition font-medium text-left ${
                selectedRoom?.id === room.id
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <p className="font-semibold text-gray-900">{room.title}</p>
              <p className="text-blue-900 text-sm">
                ₦{room.priceNGN.toLocaleString()} / night
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Check-in Date
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCheckInCalendar(!showCheckInCalendar)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-left hover:border-blue-500 transition"
            >
              <span className="text-gray-900 font-medium">
                {format(checkIn, "MMM d, yyyy")}
              </span>
            </button>

            {showCheckInCalendar && (
              <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 p-4">
                <Calendar
                  value={checkIn}
                  onChange={(date) => {
                    onCheckInChange(date as Date);
                    setShowCheckInCalendar(false);
                  }}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 365)}
                  className="react-calendar-custom"
                />
              </div>
            )}
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Check-out Date
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCheckOutCalendar(!showCheckOutCalendar)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-left hover:border-blue-500 transition"
            >
              <span className="text-gray-900 font-medium">
                {format(checkOut, "MMM d, yyyy")}
              </span>
            </button>

            {showCheckOutCalendar && (
              <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 p-4">
                <Calendar
                  value={checkOut}
                  onChange={(date) => {
                    onCheckOutChange(date as Date);
                    setShowCheckOutCalendar(false);
                  }}
                  minDate={addDays(checkIn, 1)}
                  maxDate={addDays(new Date(), 365)}
                  className="react-calendar-custom"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guests Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Number of Guests
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => onGuestsChange(num)}
              className={`flex-1 p-3 rounded-lg font-semibold transition border-2 ${
                guests === num
                  ? "border-blue-900 bg-blue-900 text-white"
                  : "border-gray-300 text-gray-700 hover:border-blue-500"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Status */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{nights}</span> night(s) •{" "}
              <span className="font-semibold">{guests}</span> guest(s)
            </p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              ₦{totalPrice.toLocaleString()}
            </p>
          </div>

          {/* Availability Badge */}
          <div className="text-right">
            {checking ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-yellow-700 font-medium">
                  Checking...
                </p>
              </div>
            ) : available ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-700 font-semibold">
                  ✓ Available
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <p className="text-sm text-red-700 font-semibold">
                  ✗ Not Available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs sm:text-sm text-gray-600">
        ✓ Booking is reserved only after successful payment. Check-in is at 2:00
        PM and check-out at 11:00 AM.
      </p>
    </div>
  );
}
