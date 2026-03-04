"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Footer from "@/components/footer";
import Confetti from "@/components/confetti";
import { Check, Loader2, AlertCircle, Copy } from "lucide-react";
import { getRoomName } from "@/lib/utils";

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
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const hasProcessedRef = useRef(false);

  const copyReceiptLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        alert(
          "Failed to copy link. Please copy from your browser address bar.",
        );
      }
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasProcessedRef.current) {
        return;
      }
      hasProcessedRef.current = true;

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

        // Step 1b: Force booking status confirmation by bookingId
        const confirmRes = await fetch("/api/bookings/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            reference: paystackReference || "",
          }),
        });

        if (!confirmRes.ok) {
          const confirmText = await confirmRes.text();
          console.warn(
            "[Booking Confirmation] confirm-payment returned non-OK:",
            {
              status: confirmRes.status,
              body: confirmText,
            },
          );
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

        // Trigger confetti celebration on successful booking
        setShowConfetti(true);

        // Step 3: Send confirmation email (now that we have the booking data)
        if (fetchedBooking?.guest_email) {
          console.log("📧 Sending confirmation email...");
          const emailRes = await fetch("/api/emails/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: bookingId,
              email: fetchedBooking.guest_email,
            }),
          });

          if (!emailRes.ok) {
            const emailText = await emailRes.text();
            console.warn(
              "[Booking Confirmation] send-confirmation returned non-OK:",
              {
                status: emailRes.status,
                body: emailText,
              },
            );
          }
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
        <main className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12 pt-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-900 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <main className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12 pt-20">
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
      {/* Confetti Celebration */}
      <Confetti active={showConfetti} duration={4000} particleCount={60} />

      <main className="min-h-screen bg-linear-to-b from-blue-50 to-white py-6 sm:py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Receipt Card - No Scrolling */}
          <div
            id="booking-receipt-container"
            className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 ease-out"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="relative">
                  <Check className="w-5 h-5 animate-check-pulse" />
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Payment Successful
                </h1>
              </div>
              <p className="text-blue-100 text-xs">Ziba Beach Resort</p>
            </div>

            {/* Content - Compact Layout */}
            <div className="p-4 sm:p-5 text-xs sm:text-sm space-y-3 sm:space-y-4">
              {/* Booking Ref Box */}
              <div className="bg-linear-to-r from-emerald-50 to-blue-50 p-3 rounded border border-emerald-200 text-center">
                <p className="text-gray-600 text-xs font-medium mb-1">
                  Reference Code
                </p>
                <p className="font-mono font-bold text-blue-900 text-sm break-all">
                  {booking.booking_reference_code || "Generating..."}
                </p>
              </div>

              {/* Paystack Reference Box */}
              {booking.paystack_reference && (
                <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-3 rounded border border-blue-200 text-center">
                  <p className="text-gray-600 text-xs font-medium mb-1">
                    Paystack Reference
                  </p>
                  <p className="font-mono font-bold text-blue-900 text-sm break-all">
                    {booking.paystack_reference}
                  </p>
                </div>
              )}

              {/* Guest Info - Compact */}
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {booking.guest_name}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="font-semibold text-gray-900 text-right text-xs">
                    {booking.guest_email}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-600 font-medium">Phone:</span>
                  <span className="font-semibold text-gray-900">
                    {booking.guest_phone}
                  </span>
                </div>
              </div>

              {/* Stay Details - Compact Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-gray-500 text-xs mb-0.5">Check In</p>
                  <p className="font-bold text-gray-900 text-xs">
                    {checkInDate
                      ? new Date(checkInDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-gray-500 text-xs mb-0.5">Check Out</p>
                  <p className="font-bold text-gray-900 text-xs">
                    {checkOutDate
                      ? new Date(checkOutDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <p className="text-gray-500 text-xs mb-0.5">Duration</p>
                  <p className="font-bold text-gray-900 text-xs">
                    {nights > 0
                      ? `${nights} Night${nights > 1 ? "s" : ""}`
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded text-center border border-blue-200">
                  <p className="text-gray-500 text-xs mb-0.5">Guests</p>
                  <p className="font-bold text-gray-900 text-xs">
                    {booking.number_of_guests}
                  </p>
                </div>
              </div>

              {/* Room */}
              <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
                <p className="text-gray-600 text-xs font-medium mb-1">
                  Room Type
                </p>
                <p className="font-bold text-blue-900 text-xs">
                  {getRoomName(booking.room_id) || "N/A"}
                </p>
              </div>

              {/* Payment - Highlighted */}
              <div className="bg-linear-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 p-3 rounded">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-700">
                    ₦{booking.total_amount_ngn?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      booking.payment_status === "CONFIRMED"
                        ? "bg-emerald-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {booking.payment_status === "CONFIRMED"
                      ? "Payment Received"
                      : booking.payment_status}
                  </span>
                </div>
              </div>

              {/* Important Notes - Compact */}
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded">
                <p className="font-bold text-amber-900 text-xs mb-1.5">
                  ⚡ Important
                </p>
                <ul className="text-gray-700 space-y-0.5 text-xs">
                  <li>• Check-in: 3:00 PM, Check-out: 12:00 PM</li>
                  <li>• Bring valid ID for check-in</li>
                  <li>• Confirmation sent to email</li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 space-y-2">
              <p className="text-center text-gray-600 text-xs">
                Questions?{" "}
                <a
                  href="tel:+2347047300013"
                  className="text-blue-900 font-bold hover:underline"
                >
                  +234 704 730 0013
                </a>
              </p>
              <button
                onClick={copyReceiptLink}
                className="w-full bg-linear-to-r from-blue-600 to-blue-500 text-white py-2 rounded font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <Copy size={16} />
                Copy Link to Receipt
              </button>
              <a
                href="/"
                className="block w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors text-center text-sm"
              >
                Home
              </a>
            </div>
          </div>

          {/* Actions Hint */}
          <p className="text-center text-gray-500 text-xs mt-4">
            💡 Copy this receipt link to save or share your booking receipt
          </p>
        </div>
      </main>
      <Footer />
      {copiedLink && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          Receipt link has been copied.
        </div>
      )}

      <style jsx>{`
        @keyframes check-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        .animate-check-pulse {
          animation: check-pulse 1.5s ease-in-out 3;
        }
      `}</style>
    </>
  );
}
