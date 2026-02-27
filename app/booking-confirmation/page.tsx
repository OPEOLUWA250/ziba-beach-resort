"use client";

import { Suspense } from "react";
import BookingConfirmationContent from "./booking-confirmation-content";

export default function BookingConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Confirming your booking...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
