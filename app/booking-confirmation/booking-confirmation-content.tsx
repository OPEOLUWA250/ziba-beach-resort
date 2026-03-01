"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

interface BookingDetails {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  room: {
    title: string;
    priceNGN: number;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  payment?: {
    amountNGN: number;
    paystackReference: string;
  };
}

export default function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        // First, try to get from sessionStorage (for mock bookings and recent real bookings)
        if (typeof window !== "undefined") {
          const cachedBooking = sessionStorage.getItem("lastBooking");
          if (cachedBooking) {
            const booking = JSON.parse(cachedBooking);
            if (booking.id === bookingId) {
              setBooking(booking);
              setLoading(false);
              return;
            }
          }
        }

        // Fall back to API for database bookings
        const res = await fetch(`/api/bookings/${bookingId}`);

        if (!res.ok) {
          throw new Error("Booking not found");
        }

        const data = await res.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message || "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-4 text-5xl">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Booking Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/bookings"
            className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Browse Rooms
          </Link>
        </div>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() -
      new Date(booking.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const checkInDate = format(
    new Date(booking.checkInDate),
    "EEEE, MMMM d, yyyy",
  );
  const checkOutDate = format(
    new Date(booking.checkOutDate),
    "EEEE, MMMM d, yyyy",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">✅</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-2 cormorant">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your reservation. We're excited to host you!
          </p>
        </div>

        {/* Main Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Booking Reference */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 sm:p-8">
            <p className="text-sm text-blue-100 mb-2">Booking Reference</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono">
              {booking.id}
            </p>
            <p className="text-xs text-blue-200 mt-2">
              Save this reference for check-in
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Guest Info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Guest Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    NAME
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {booking.user.firstName} {booking.user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    EMAIL
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {booking.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    GUESTS
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {booking.numberOfGuests}{" "}
                    {booking.numberOfGuests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Your Stay
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    CHECK-IN
                  </p>
                  <p className="text-gray-900 font-semibold">{checkInDate}</p>
                  <p className="text-xs text-gray-600 mt-1">From 2:00 PM</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    CHECK-OUT
                  </p>
                  <p className="text-gray-900 font-semibold">{checkOutDate}</p>
                  <p className="text-xs text-gray-600 mt-1">By 11:00 AM</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    ROOM
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {booking.room.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    DURATION
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Special Requests
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-900 text-sm">
                    {booking.specialRequests}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Payment Summary
              </h2>
              {booking.payment ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ₦{booking.room.priceNGN.toLocaleString()} × {nights}{" "}
                      {nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₦{booking.payment.amountNGN.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3">
                    <span>Total Paid</span>
                    <span className="text-green-600">
                      ₦{booking.payment.amountNGN.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ₦{booking.room.priceNGN.toLocaleString()} × {nights}{" "}
                      {nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₦{(booking.room.priceNGN * nights).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      ₦{(booking.room.priceNGN * nights).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            📧 What to Expect
          </h2>
          <ul className="space-y-3 text-blue-900">
            <li className="flex gap-3">
              <span>✓</span>
              <span>
                Confirmation email has been sent to{" "}
                <strong>{booking.user.email}</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>
                Check-in instructions will be sent 24 hours before your arrival
              </span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>Our team is available 24/7 for any questions</span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>Your room is reserved and ready for your arrival</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/bookings"
            className="block text-center bg-white border-2 border-blue-900 text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition"
          >
            Explore More Rooms
          </Link>
          <Link
            href="/"
            className="block text-center bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-800 hover:to-blue-700 transition shadow-lg"
          >
            Return to Homepage
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm mb-2">Questions or need help?</p>
          <p className="text-sm font-semibold text-gray-900">
            Contact us: +234-XXX-XXXX or bookings@zibabeachresort.com
          </p>
        </div>
      </div>
    </div>
  );
}
