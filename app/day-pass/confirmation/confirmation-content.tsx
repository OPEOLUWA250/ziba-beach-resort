"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Check, AlertCircle, Loader2, Download } from "lucide-react";
import { format } from "date-fns";
import { downloadReceiptPDF } from "@/lib/pdf-utils";

interface DayPassBooking {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phone: string;
  visitDate: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentStatus: string;
}

export default function DayPassConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const paystackReference = searchParams.get("ref");
  const [downloading, setDownloading] = useState(false);

  const [booking, setBooking] = useState<DayPassBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }

      const maxRetries = 5;
      const retryDelay = 1000; // 1 second
      let attemptCount = 0;

      const attemptFetch = async () => {
        attemptCount++;
        try {
          console.log(
            `[Confirmation] Attempt ${attemptCount}/${maxRetries} to fetch booking ${bookingId}`,
          );
          const res = await fetch(`/api/day-pass/${bookingId}`);

          if (!res.ok) {
            const errorText = await res.text();
            console.error("[Confirmation] API Error:", res.status, errorText);

            // Retry on 404 or 400 (booking might not be written yet, or params not extracted)
            if (
              (res.status === 404 || res.status === 400) &&
              attemptCount < maxRetries
            ) {
              console.log(
                `[Confirmation] Error, retrying in ${retryDelay}ms...`,
              );
              setTimeout(attemptFetch, retryDelay);
              return;
            }

            throw new Error(`Failed to fetch booking: ${res.status}`);
          }

          const data = await res.json();
          console.log("[Confirmation] Booking data retrieved:", data);
          setBooking(data);
          setLoading(false);
        } catch (err: any) {
          console.error("[Confirmation] Fetch error:", err);
          if (attemptCount < maxRetries) {
            console.log(`[Confirmation] Error, retrying in ${retryDelay}ms...`);
            setTimeout(attemptFetch, retryDelay);
          } else {
            setError(err.message || "Failed to load booking");
            setLoading(false);
          }
        }
      };

      attemptFetch();
    };

    fetchBooking();
  }, [bookingId]);

  // Mark payment as completed if ref param exists (backup confirmation)
  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const res = await fetch("/api/day-pass/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });
        if (res.ok) {
          console.log("[Confirmation] Payment confirmed");
        }
      } catch (err) {
        console.error("[Confirmation] Error confirming payment:", err);
      }
    };

    if (bookingId) {
      confirmPayment();
    }
  }, [bookingId]);

  const downloadReceipt = async () => {
    if (!booking) {
      alert("Booking data not available");
      return;
    }
    setDownloading(true);

    try {
      const success = await downloadReceiptPDF(
        "daypass-receipt-container",
        `Day-Pass-Receipt-${booking.referenceCode}.pdf`,
      );
      if (!success) {
        alert(
          "Failed to download receipt. Please try again or use screenshot.",
        );
      }
    } catch (err) {
      console.error("Error downloading receipt:", err);
      alert("Failed to download receipt. Please try again or use screenshot.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-900 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {error ? "Something went wrong" : "Booking not found"}
        </h1>
        <p className="text-gray-600">
          {error || "We couldn't find your booking details"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Receipt Card */}
      <div
        id="daypass-receipt-container"
        className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Check className="w-5 h-5" />
            <h1 className="text-xl sm:text-2xl font-bold">Confirmed!</h1>
          </div>
          <p className="text-blue-100 text-xs">Day Pass Booking</p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 text-xs sm:text-sm space-y-3 sm:space-y-4">
          {/* Booking Ref Box */}
          <div className="bg-linear-to-r from-blue-50 to-blue-100 p-3 rounded border border-blue-200 text-center">
            <p className="text-gray-600 text-xs font-medium mb-1">
              Reference Code
            </p>
            <p className="font-mono font-bold text-blue-900 text-sm break-all">
              {booking.referenceCode}
            </p>
          </div>

          {/* Guest Info */}
          <div className="space-y-2">
            <div className="flex justify-between border-b border-gray-200 pb-1.5">
              <span className="text-gray-600 font-medium">Name:</span>
              <span className="font-semibold text-gray-900 text-right">
                {booking.fullName}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1.5">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="font-semibold text-gray-900 text-right text-xs">
                {booking.email}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1.5">
              <span className="text-gray-600 font-medium">Phone:</span>
              <span className="font-semibold text-gray-900">
                {booking.phone}
              </span>
            </div>
          </div>

          {/* Visit Date - Highlighted */}
          <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
            <p className="text-gray-600 text-xs font-medium mb-1">Visit Date</p>
            <p className="font-bold text-blue-900">
              {format(new Date(booking.visitDate), "EEE, MMM d, yyyy")}
            </p>
          </div>

          {/* Items Summary */}
          <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
            <p className="text-gray-600 text-xs font-medium mb-2">
              Items (
              {booking.items.reduce((sum, item) => sum + item.quantity, 0)})
            </p>
            <div className="space-y-1 text-xs">
              {booking.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-blue-900">
                  <span>{item.name}</span>
                  <span>×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-linear-to-r from-blue-50 to-blue-100 border-2 border-blue-300 p-3 rounded">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-lg sm:text-xl font-bold text-blue-700">
                ₦{booking.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Status</span>
              <span className="px-2 py-1 rounded text-xs font-bold bg-blue-600 text-white">
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded">
            <p className="font-bold text-amber-900 text-xs mb-1.5">
              ⚡ Important
            </p>
            <ul className="text-gray-700 space-y-0.5 text-xs">
              <li>• Check-in time: 10:00 AM</li>
              <li>• Duration: 8 hours (10:00 AM - 6:00 PM)</li>
              <li>• Bring valid ID for check-in</li>
              <li>• Confirmation sent to email</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-2">
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
            onClick={downloadReceipt}
            disabled={downloading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <Download size={16} />
            {downloading ? "Downloading..." : "Download Receipt"}
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
        💡 Download, screenshot, or print this receipt for your records
      </p>
    </div>
  );
}
