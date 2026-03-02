"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";

interface Booking {
  id: string;
  booking_reference_code: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  rooms?: {
    title: string;
    description: string;
    priceNGN: number;
    capacity: number;
  };
}

export default function ViewBooking() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const email = searchParams.get("email");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref || !email) {
      setError("Booking reference and email are required");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(
          `/api/bookings/view?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(email)}`,
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Booking not found");
        }

        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch booking",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [ref, email]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your booking...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">
              Please check your booking reference and email address.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold">No booking found</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkOutDate);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <AlertCircle className="w-5 h-5" />,
    CONFIRMED: <CheckCircle className="w-5 h-5" />,
    CANCELLED: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Confirmed
              </h1>
              <p className="text-gray-600">
                Your reservation is confirmed and ready
              </p>
            </div>

            {/* Booking Reference */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-center mb-6">
              <p className="text-blue-200 text-sm mb-2">Booking Reference</p>
              <p className="text-white text-3xl font-bold font-mono">
                {booking.booking_reference_code}
              </p>
              <p className="text-blue-200 text-xs mt-2">
                Please save this reference for check-in
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-8">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${statusColors[booking.status]}`}
              >
                {statusIcons[booking.status]}
                {booking.status}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Booking Details
            </h2>

            {/* Room Info */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room</h3>
              <p className="text-2xl font-bold text-blue-900 mb-2">
                {booking.rooms?.title || "Room"}
              </p>
              {booking.rooms?.description && (
                <p className="text-gray-600">{booking.rooms.description}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-900" />
                  <p className="text-sm text-gray-600 font-semibold">
                    Check-In
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {format(checkInDate, "MMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-500">2:00 PM arrival</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-900" />
                  <p className="text-sm text-gray-600 font-semibold">
                    Check-Out
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {format(checkOutDate, "MMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-500">11:00 AM departure</p>
              </div>
            </div>

            {/* Guests & Price */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-900" />
                  <p className="text-sm text-gray-600 font-semibold">Guests</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {booking.numberOfGuests}{" "}
                  {booking.numberOfGuests === 1 ? "Guest" : "Guests"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-900" />
                  <p className="text-sm text-gray-600 font-semibold">
                    Duration
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {nights} {nights === 1 ? "night" : "nights"}
                </p>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  Special Requests
                </p>
                <p className="text-gray-900">{booking.specialRequests}</p>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex justify-between mb-4 pb-4 border-b border-blue-200">
                <span className="text-gray-900 font-semibold">
                  ₦{booking.rooms?.priceNGN.toLocaleString()} × {nights} night
                  {nights !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-900 font-semibold">
                  ₦{((booking.rooms?.priceNGN || 0) * nights).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-3xl font-bold text-blue-900">
                  ₦{booking.totalAmount?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Important Information
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-900 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Check-In Time
                  </h3>
                  <p className="text-gray-600">
                    Check-in is at 2:00 PM. Early check-in may be available upon
                    request.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-900 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Check-Out Time
                  </h3>
                  <p className="text-gray-600">
                    Check-out is at 11:00 AM. Late checkout available for a fee.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-900 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Documentation
                  </h3>
                  <p className="text-gray-600">
                    Please bring a valid ID and your booking reference code.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-900 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Contact Us
                  </h3>
                  <p className="text-gray-600">
                    For any questions or changes, please call us at +234 704 730
                    0013
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Booking */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Need to make changes to your booking?
            </p>
            <button className="bg-white border-2 border-gray-300 text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
