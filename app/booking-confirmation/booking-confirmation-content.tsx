"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface BookingData {
  id: string;
  booking_reference_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_amount_ngn: number;
  payment_status: string;
  paystack_reference: string;
  room_id: string;
}

export default function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const paystackReference = searchParams.get("ref");

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Verifying payment with reference:", paystackReference);

        // Step 1: Verify payment with Paystack
        if (paystackReference) {
          const verifyRes = await fetch(
            `/api/payments/verify/${paystackReference}`,
          );
          const verifyData = await verifyRes.json();
          console.log("✅ Verification response:", verifyData);
          console.log(
            `   Status: ${verifyData.status}, Success: ${verifyData.success}`,
          );

          if (verifyData.success || verifyData.status === "success") {
            console.log(
              "✅ Payment verified - database status updated to CONFIRMED",
            );
            setPaymentVerified(true);
          } else {
            console.warn(
              `⚠️  Payment verification returned status: ${verifyData.status}`,
            );
          }
        } else {
          console.warn("⚠️  No Paystack reference in URL");
        }

        // Step 2: Fetch booking details
        console.log("📋 Fetching booking details...");
        const bookingRes = await fetch(`/api/bookings/${bookingId}`);
        if (!bookingRes.ok) {
          throw new Error("Failed to fetch booking");
        }
        const bookingData = await bookingRes.json();
        console.log("✅ Booking data:", bookingData);

        const fetchedBooking = bookingData.booking;
        setBooking(fetchedBooking);

        // Step 3: Send confirmation email (now that we have the booking data)
        if (fetchedBooking?.guest_email) {
          console.log("📧 Sending confirmation email...");
          await fetch("/api/emails/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: bookingId,
              email: fetchedBooking.guest_email,
            }),
          }).catch((err) => console.error("Email error:", err));
        }

        setLoading(false);
      } catch (err: any) {
        console.error("❌ Error during verification:", err);
        setError(err.message || "Failed to verify booking");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [bookingId, paystackReference]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-900 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing your booking...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error ? "Something went wrong" : "Booking not found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find your booking details"}
            </p>
            <a
              href="/"
              className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Return Home
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const checkInDate = booking?.check_in_date
    ? new Date(booking.check_in_date)
    : null;
  const checkOutDate = booking?.check_out_date
    ? new Date(booking.check_out_date)
    : null;
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for booking with Ziba Beach Resort
            </p>
          </div>

          {/* Booking Reference */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-center mb-8 text-white">
            <p className="text-blue-100 text-sm mb-2">Booking Reference</p>
            <p className="text-3xl font-bold font-mono">
              {booking.booking_reference_code || "Generating..."}
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Booking Details
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Guest Name</p>
                <p className="text-gray-900 font-semibold">
                  {booking.guest_name}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-900 font-semibold">
                  {booking.guest_email}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-gray-900 font-semibold">
                  {booking.guest_phone}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Guests</p>
                <p className="text-gray-900 font-semibold">
                  {booking.number_of_guests}
                </p>
              </div>
            </div>
          </div>

          {/* Dates & Room */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Stay Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Check-In</p>
                <p className="text-gray-900 font-semibold">
                  {checkInDate
                    ? dateFormatter.format(checkInDate)
                    : "Date not available"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Check-Out</p>
                <p className="text-gray-900 font-semibold">
                  {checkOutDate
                    ? dateFormatter.format(checkOutDate)
                    : "Date not available"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Duration</p>
                <p className="text-gray-900 font-semibold">
                  {nights > 0
                    ? `${nights} night${nights > 1 ? "s" : ""}`
                    : "Duration not available"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Room</p>
                <p className="text-gray-900 font-semibold">
                  {booking.room_id || "Room not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Payment Summary
            </h2>

            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-gray-900">
                  ₦{booking.total_amount_ngn?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-semibold ${
                    booking.payment_status === "CONFIRMED"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {booking.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Check-in Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-900 p-6 rounded-r-lg mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-3">
              Check-In Instructions
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Check-in time: 2:00 PM</li>
              <li>✓ Check-out time: 11:00 AM</li>
              <li>✓ Please bring a valid government-issued ID</li>
              <li>✓ Early check-in available subject to room availability</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Need help? Contact us at{" "}
              <a
                href="tel:+2347047300013"
                className="text-blue-900 font-semibold hover:underline"
              >
                +234 704 730 0013
              </a>
            </p>
            <a
              href="/"
              className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
