"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format, isPast, startOfToday, addDays } from "date-fns";
import DateRangePicker from "./date-range-picker";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
  pricePerNight: number;
  onProceedToBooking: (checkIn: Date, checkOut: Date) => void;
}

export default function AvailabilityModal({
  isOpen,
  onClose,
  roomId,
  roomName,
  pricePerNight,
  onProceedToBooking,
}: AvailabilityModalProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "idle" | "checking" | "available" | "not_available"
  >("idle");
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);

  // Fetch booked dates when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchBookedDates = async () => {
      setLoadingBookedDates(true);
      try {
        const res = await fetch(
          `/api/bookings/room-booked-dates?roomId=${roomId}`,
        );
        const data = await res.json();
        setBookedDates(data.bookedDates || []);
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
        setBookedDates([]);
      } finally {
        setLoadingBookedDates(false);
      }
    };

    fetchBookedDates();
  }, [isOpen, roomId]);

  const handleCheckInChange = (date: Date) => {
    setCheckInDate(date);
    // Reset checkout if it's before check-in
    if (checkOutDate && date >= checkOutDate) {
      setCheckOutDate(null);
    }
    setAvailabilityStatus("idle");
  };

  const handleCheckOutChange = (date: Date) => {
    if (checkInDate && date > checkInDate) {
      setCheckOutDate(date);
      const daysDiff = Math.ceil(
        (date.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      setNights(daysDiff);
      setTotalPrice(daysDiff * pricePerNight);
      setAvailabilityStatus("idle");

      // Auto-check availability after a brief delay so state updates complete
      setTimeout(() => {
        checkAvailabilityImmediate(checkInDate, date);
      }, 300);
    }
  };

  const checkAvailabilityImmediate = async (checkIn: Date, checkOut: Date) => {
    setIsChecking(true);
    setAvailabilityStatus("checking");

    try {
      // Extract local date components to avoid timezone shifts
      const checkInStr = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`;
      const checkOutStr = `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`;
      
      const response = await fetch("/api/bookings/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkInDate: checkInStr + "T00:00:00.000Z",
          checkOutDate: checkOutStr + "T00:00:00.000Z",
        }),
      });

      const data = await response.json();
      console.log("Availability response:", data);

      if ("available" in data && data.available === true) {
        setAvailabilityStatus("available");
      } else if ("available" in data && data.available === false) {
        setAvailabilityStatus("not_available");
      } else if ("error" in data && response.ok) {
        setAvailabilityStatus("available");
      } else {
        setAvailabilityStatus("not_available");
      }
    } catch (error) {
      console.error("Availability check failed:", error);
      setAvailabilityStatus("available");
    } finally {
      setIsChecking(false);
    }
  };

  const handleProceed = () => {
    if (availabilityStatus === "available" && checkInDate && checkOutDate) {
      onProceedToBooking(checkInDate, checkOutDate);
    }
  };

  // Auto-scroll to results when availability status changes
  useEffect(() => {
    if (
      (availabilityStatus === "available" ||
        availabilityStatus === "not_available") &&
      resultsRef.current
    ) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  }, [availabilityStatus]);

  if (!isOpen) return null;

  const today = startOfToday();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-50 to-blue-100 px-6 sm:px-8 pt-6 pb-4 border-b-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-blue-900" />
                <h2 className="text-2xl font-bold text-blue-900">
                  Check Availability
                </h2>
              </div>
              <p className="text-blue-700 font-light mt-1">{roomName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-200 rounded-lg transition"
            >
              <X className="w-5 h-5 text-blue-900" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 sm:px-8 py-8 space-y-8">
          {/* Date Range Picker */}
          <div className="space-y-5">
            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <DateRangePicker
                startDate={checkInDate}
                endDate={checkOutDate}
                onStartDateChange={handleCheckInChange}
                onEndDateChange={handleCheckOutChange}
                minDate={today}
                maxDate={addDays(today, 365)}
                bookedDates={bookedDates}
              />
            </div>

            {/* Auto-checking status */}
            {availabilityStatus === "checking" && (
              <div className="animate-pulse bg-linear-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-blue-700">
                  🔍 Checking availability...
                </p>
              </div>
            )}
          </div>

          {/* Availability Results */}
          {availabilityStatus === "available" &&
            checkInDate &&
            checkOutDate && (
              <div
                ref={resultsRef}
                className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 space-y-4 animate-in fade-in duration-300"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-7 h-7 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-lg text-blue-900">
                      Perfect! Room is Available
                    </h3>
                    <p className="text-sm text-blue-800 font-light mt-1">
                      This {roomName} is available for your selected dates.
                      Proceed with your booking!
                    </p>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-white rounded-lg p-5 space-y-3 border-2 border-blue-200 shadow-sm">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    📋 Booking Summary
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600 font-semibold uppercase">
                        Check-In
                      </span>
                      <span className="text-base font-bold text-gray-900 mt-1">
                        {format(checkInDate, "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {format(checkInDate, "EEEE")}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600 font-semibold uppercase">
                        Check-Out
                      </span>
                      <span className="text-base font-bold text-gray-900 mt-1">
                        {format(checkOutDate, "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {format(checkOutDate, "EEEE")}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Nights:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {nights}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-700">
                        Price per Night:
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        ₦{pricePerNight.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      Total Price:
                    </span>
                    <span className="text-2xl font-bold text-blue-900">
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

          {availabilityStatus === "not_available" && (
            <div
              ref={resultsRef}
              className="bg-red-50 border-2 border-red-300 rounded-xl p-6 space-y-3 animate-in fade-in duration-300"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg text-red-900">
                    Room Not Available
                  </h3>
                  <p className="text-sm text-red-800 font-light mt-1">
                    This room is already booked for some of your selected dates.
                    Please choose different dates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCheckInDate(null);
                  setCheckOutDate(null);
                  setAvailabilityStatus("idle");
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Try Different Dates
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 border-t-2 border-gray-200 px-6 sm:px-8 py-4 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 border-2 border-gray-400 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            disabled={availabilityStatus !== "available"}
            className="w-full sm:w-auto px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg order-1 sm:order-2"
          >
            Proceed to Booking
          </button>
        </div>
      </div>
    </div>
  );
}
