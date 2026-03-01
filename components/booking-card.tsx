"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  title: string;
  priceNGN: number;
}

interface BookingCardProps {
  room: Room;
  checkIn: Date;
  checkOut: Date;
  guests: number;
}

export default function BookingCard({
  room,
  checkIn,
  checkOut,
  guests,
}: BookingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [error, setError] = useState("");

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalPrice = room.priceNGN * nights;

  const handlePayment = async () => {
    // Validate inputs
    if (!email || !firstName || !lastName || !phone) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create booking via API
      const bookingRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: email,
          guestName: `${firstName} ${lastName}`,
          guestPhone: phone,
          roomId: room.id,
          checkInDate: format(checkIn, "yyyy-MM-dd"),
          checkOutDate: format(checkOut, "yyyy-MM-dd"),
          numberOfGuests: guests,
          specialRequests,
          roomPriceNGN: room.priceNGN,
          numberOfNights: nights,
        }),
      });

      if (!bookingRes.ok) {
        const errorData = await bookingRes.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const { booking, payment } = await bookingRes.json();
      const bookingId = booking.id;
      const paystackReference = payment.reference;
      const amountNGN = booking.total_amount_ngn; // Amount in NGN (stored in DB)

      // Step 2: Load Paystack script dynamically
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;

      script.onload = () => {
        if (!window.PaystackPop) {
          setError("Payment gateway failed to load. Please try again.");
          setLoading(false);
          return;
        }

        // Step 3: Initialize Paystack payment
        const handler = window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email,
          amount: amountNGN * 100, // Paystack uses kobo (smallest unit)
          currency: "NGN",
          ref: paystackReference,
          onClose: () => {
            console.log("Payment cancelled");
            setLoading(false);
          },
          onSuccess: async (response: any) => {
            try {
              // Step 4: Verify payment
              const verifyRes = await fetch(
                `/api/payments/verify/${paystackReference}`,
              );
              const verifyData = await verifyRes.json();

              if (verifyData.status === "success" || verifyData.success) {
                // Step 5: Send confirmation email
                await fetch("/api/emails/send-confirmation", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookingId,
                    email,
                  }),
                });

                // Step 6: Redirect to confirmation
                router.push(`/booking-confirmation?bookingId=${bookingId}`);
              } else {
                setError("Payment verification failed");
                setLoading(false);
              }
            } catch (err: any) {
              setError("Failed to verify payment");
              console.error(err);
              setLoading(false);
            }
          },
        });

        handler.openIframe();
      };

      document.body.appendChild(script);
    } catch (err: any) {
      setError(err.message || "Failed to process booking");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg sticky top-20 p-6 space-y-6">
      {/* Booking Summary */}
      <div className="space-y-3 pb-6 border-b-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 cormorant">
          Booking Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in</span>
            <span className="font-semibold text-gray-900">
              {format(checkIn, "MMM d")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-out</span>
            <span className="font-semibold text-gray-900">
              {format(checkOut, "MMM d")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nights</span>
            <span className="font-semibold text-gray-900">{nights}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Room</span>
            <span className="font-semibold text-gray-900">{room.title}</span>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">
                ₦{room.priceNGN.toLocaleString()} × {nights}
              </span>
              <span className="font-semibold text-gray-900">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Information Form */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Guest Information</h4>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            disabled={loading}
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            disabled={loading}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            disabled={loading}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 XXX XXX XXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            disabled={loading}
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Special Requests
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="High floor, extra bed, etc."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
            disabled={loading}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Total Price */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
        <p className="text-gray-600 text-sm mb-1">Total Price</p>
        <p className="text-3xl font-bold text-blue-900 cormorant">
          ₦{totalPrice.toLocaleString()}
        </p>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 disabled:scale-100 shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : (
          `Pay ₦${totalPrice.toLocaleString()}`
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Paystack. Your booking is only confirmed
        after successful payment.
      </p>
    </div>
  );
}

// Type definition for Paystack global
declare global {
  interface Window {
    PaystackPop: any;
  }
}
