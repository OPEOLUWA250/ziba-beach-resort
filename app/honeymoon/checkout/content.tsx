"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";

// Declare PaystackPop globally
declare global {
  interface Window {
    PaystackPop: any;
  }
}

const honeymoonPackages: Record<
  number,
  {
    id: number;
    name: string;
    nights: string;
    room: string;
    price: string;
  }
> = {
  1: {
    id: 1,
    name: "Beach Facing Escape",
    nights: "2-night",
    room: "Beach Facing Room",
    price: "900000",
  },
  2: {
    id: 2,
    name: "Suite Romance",
    nights: "2-night",
    room: "Beach Facing Suite",
    price: "1020000",
  },
  3: {
    id: 3,
    name: "Overwater Paradise",
    nights: "2-night",
    room: "Overwater Terrace Room",
    price: "940000",
  },
  4: {
    id: 4,
    name: "Overwater Luxury",
    nights: "2-night",
    room: "Overwater Terrace Suite",
    price: "1070000",
  },
  5: {
    id: 5,
    name: "Extended Beach Bliss",
    nights: "4-night",
    room: "Beach Facing Room",
    price: "1500000",
  },
  6: {
    id: 6,
    name: "Extended Suite Escape",
    nights: "4-night",
    room: "Beach Facing Suite",
    price: "1720000",
  },
  7: {
    id: 7,
    name: "Extended Overwater",
    nights: "4-night",
    room: "Overwater Room",
    price: "1760000",
  },
  8: {
    id: 8,
    name: "Extended Overwater Suite",
    nights: "4-night",
    room: "Overwater Suite",
    price: "1940000",
  },
  9: {
    id: 9,
    name: "Ultimate Beach Romance",
    nights: "6-night",
    room: "Beach Facing Room",
    price: "2100000",
  },
  10: {
    id: 10,
    name: "Ultimate Luxury Suite",
    nights: "6-night",
    room: "Beach Facing Suite",
    price: "2280000",
  },
  11: {
    id: 11,
    name: "Extended Overwater Luxury",
    nights: "4-night",
    room: "Overwater Suite",
    price: "2340000",
  },
  12: {
    id: 12,
    name: "Premium Overwater Escape",
    nights: "6-night",
    room: "Overwater Suite",
    price: "2720000",
  },
};

export default function HoneymoonCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = parseInt(searchParams.get("packageId") || "0", 10);

  const [guestData, setGuestData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkInDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPackage = honeymoonPackages[packageId];

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Package not found</p>
          <button
            onClick={() => router.push("/experience")}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Back to Experiences
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (
        !guestData.fullName ||
        !guestData.email ||
        !guestData.phone ||
        !guestData.checkInDate
      ) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Create booking
      const createRes = await fetch("/api/honeymoon/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          packagePrice: parseInt(selectedPackage.price) / 100,
          guestName: guestData.fullName,
          email: guestData.email,
          phone: guestData.phone,
          checkInDate: guestData.checkInDate,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create booking");
      }

      const { id: bookingId, amount } = await createRes.json();

      // Initialize Paystack
      if (!window.PaystackPop) {
        throw new Error("Paystack not loaded");
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: guestData.email,
        amount: amount,
        ref: `HM-${bookingId}`,
        onClose: () => {
          console.log("Payment window closed");
        },
        onSuccess: async (response: any) => {
          console.log("Payment successful:", response.reference);
          localStorage.setItem("lastOrderCompleted", "true");

          // Confirm payment
          await fetch("/api/honeymoon/confirm-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId }),
          });

          router.push(`/honeymoon/confirmation?bookingId=${bookingId}`);
        },
      });

      handler.openIframe();

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  };

  const handleDemo = () => {
    localStorage.setItem("lastOrderCompleted", "true");
    router.push("/honeymoon/confirmation");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/experience")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition"
        >
          <ChevronLeft size={20} />
          Back to Experiences
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-gray-600 text-sm mb-1">Package</p>
                <p className="text-xl font-semibold text-gray-800">
                  {selectedPackage.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Duration</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPackage.nights}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Room Type</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPackage.room}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 text-sm mb-1">Total Price</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₦{parseInt(selectedPackage.price).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-3 font-semibold">
                Package Includes:
              </p>
              <ul className="space-y-2">
                <li className="text-gray-700 text-sm">
                  • Decorated room upon arrival
                </li>
                <li className="text-gray-700 text-sm">• 3 meals daily</li>
                <li className="text-gray-700 text-sm">• Horse riding</li>
                <li className="text-gray-700 text-sm">• 1-hr couple massage</li>
                <li className="text-gray-700 text-sm">
                  • Sunset Picnic & Romantic Dinner
                </li>
                <li className="text-gray-700 text-sm">
                  • Complimentary minibar
                </li>
              </ul>
            </div>
          </div>

          {/* Guest Information Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Guest Information
            </h2>

            <form onSubmit={handlePaystackPayment} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={guestData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={guestData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={guestData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 8xxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  value={guestData.checkInDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>

              <button
                type="button"
                onClick={handleDemo}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Demo Mode
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
