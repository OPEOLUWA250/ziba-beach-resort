import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ViewBookingContentNew } from "./view-booking-content-new";

function ViewBookingLoading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading receipt lookup...</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ViewBooking() {
  return (
    <Suspense fallback={<ViewBookingLoading />}>
      <ViewBookingContentNew />
    </Suspense>
  );
}
