"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This route has been deprecated - redirecting to stay page
export default function BookingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/bookings");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to rooms...</p>
      </div>
    </div>
  );
}
