"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, Home } from "lucide-react";
import Link from "next/link";

interface HoneymoonBooking {
  id: string;
  guest_name: string;
  email: string;
  phone: string;
  package_name: string;
  package_price: number;
  check_in_date: string;
  payment_status: string;
  paystack_reference: string;
  created_at: string;
}

export default function HoneymoonConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "demo";
  const [booking, setBooking] = useState<HoneymoonBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;

      let attempts = 0;
      const maxAttempts = 5;
      let foundBooking = null;

      while (attempts < maxAttempts) {
        try {
          const res = await fetch(`/api/honeymoon/${bookingId}`);
          if (res.ok) {
            foundBooking = await res.json();
            break;
          }

          if (res.status === 404 && attempts < maxAttempts - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
            continue;
          }

          throw new Error("Failed to fetch booking");
        } catch (err) {
          console.error("Error fetching booking:", err);
          if (attempts === maxAttempts - 1) {
            setError("Failed to load booking details");
            break;
          }
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (foundBooking) {
        setBooking(foundBooking);
      }
      setLoading(false);
    };

    if (bookingId && bookingId !== "demo") {
      fetchBooking();
    } else {
      // Demo mode
      setBooking({
        id: "DEMO-" + Date.now(),
        guest_name: "Demo Guest",
        email: "demo@example.com",
        phone: "+234 8xxxxxxxxxx",
        package_name: "Demo Honeymoon Package",
        package_price: 900000,
        check_in_date: new Date().toISOString().split("T")[0],
        payment_status: "COMPLETED",
        paystack_reference: "DEMO-REF-" + Date.now(),
        created_at: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Booking not found"}</p>
          <Link
            href="/experience"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(booking.created_at);
  const formattedDate = bookingDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = bookingDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden print:shadow-none">
          {/* Header with Gradient */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-12 text-white text-center">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-blue-100">Your honeymoon booking is confirmed</p>
          </div>

          {/* Receipt Content */}
          <div className="p-8 space-y-8">
            {/* Booking Reference */}
            <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
              <p className="text-blue-900 text-sm font-semibold mb-2 uppercase tracking-wide">
                Booking Reference
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {booking.paystack_reference}
              </p>
              <p className="text-blue-700 text-xs mt-2">
                {formattedDate} at {formattedTime}
              </p>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Package Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Package</p>
                  <p className="font-semibold text-gray-800">
                    {booking.package_name}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Check-in Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(booking.check_in_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Guest Information
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Guest Name:</span>
                  <span className="font-semibold text-gray-800">
                    {booking.guest_name}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-800">
                    {booking.email}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-800">
                    {booking.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Payment Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Package Price:</span>
                  <span className="font-semibold text-gray-800">
                    ₦{booking.package_price.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-t border-gray-200 pt-2">
                  <span className="text-lg font-bold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₦{booking.package_price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <p className="text-center text-blue-900 text-sm font-semibold mb-2 uppercase tracking-wide">
                Payment Status
              </p>
              <p className="text-center text-lg font-bold text-blue-900">
                {booking.payment_status === "COMPLETED"
                  ? "✓ Completed"
                  : booking.payment_status}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>✓ Confirmation email sent to {booking.email}</li>
                <li>✓ Check your email for booking details and instructions</li>
                <li>✓ Arrive at least 1 hour before your check-in date</li>
                <li>
                  ✓ Contact us for any questions: contact@zibabeachresort.com
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-8 py-6 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              <Download size={20} />
              Print Receipt
            </button>

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
            >
              <Home size={20} />
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
