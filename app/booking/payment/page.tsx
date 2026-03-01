"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { format, parse, differenceInDays } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface RoomData {
  id: string;
  title: string;
  description: string;
  priceNGN: number;
  capacity: number;
  images: string[];
  amenities: string[];
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomIdParam = searchParams.get("roomId");
  const roomNameParam = searchParams.get("roomName");
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Fallback room data for demo mode
  const fallbackRooms: { [key: string]: RoomData } = {
    room01: {
      id: "room01",
      title: "Beach Facing Room",
      description: "Experience the essence of beach luxury with stunning ocean views",
      priceNGN: 202000,
      capacity: 3,
      images: ["/Ziba-hero.jpg"],
      amenities: ["WiFi", "Minibar", "Room Service", "Daily Housekeeping", "Beach Access"],
    },
    room02: {
      id: "room02",
      title: "Beach Facing Family Room",
      description: "Spacious family accommodation with flexible sleeping arrangements",
      priceNGN: 225000,
      capacity: 6,
      images: ["/Ziba-hero.jpg"],
      amenities: ["WiFi", "Kids Welcome", "Room Service", "Family Beach Amenities", "Game Console"],
    },
    room03: {
      id: "room03",
      title: "Beach Facing Family Room",
      description: "Premium family space with expansive pool and ocean views",
      priceNGN: 247500,
      capacity: 6,
      images: ["/Ziba-hero.jpg"],
      amenities: ["WiFi", "Premium Service", "Ocean View", "Family Activities", "Telescope"],
    },
  };

  // Parse dates
  const checkInDate = checkInParam
    ? parse(checkInParam, "yyyy-MM-dd", new Date())
    : null;
  const checkOutDate = checkOutParam
    ? parse(checkOutParam, "yyyy-MM-dd", new Date())
    : null;

  const nights =
    checkInDate && checkOutDate
      ? differenceInDays(checkOutDate, checkInDate)
      : 0;

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        
        // First check fallback data
        if (roomIdParam && fallbackRooms[roomIdParam]) {
          setRoom(fallbackRooms[roomIdParam]);
          return;
        }

        // Try API
        const res = await fetch("/api/rooms");
        const data = await res.json();
        const roomsList = data.rooms || data || [];

        if (!Array.isArray(roomsList) || roomsList.length === 0) {
          // Fallback if API returns empty
          if (roomIdParam && fallbackRooms[roomIdParam]) {
            setRoom(fallbackRooms[roomIdParam]);
            return;
          }
          setError("Unable to load room data");
          return;
        }

        // Search for room by multiple criteria
        let foundRoom = null;
        foundRoom = roomsList.find((r: RoomData) => r.id === roomIdParam);

        if (!foundRoom && roomNameParam) {
          foundRoom = roomsList.find(
            (r: RoomData) =>
              r.title &&
              r.title.toLowerCase().includes(roomNameParam.toLowerCase()),
          );
        }

        if (!foundRoom && roomIdParam) {
          foundRoom = roomsList.find(
            (r: RoomData) =>
              (r.title &&
                r.title.toLowerCase().includes(roomIdParam.toLowerCase())) ||
              (r.id && r.id.toLowerCase().includes(roomIdParam.toLowerCase())),
          );
        }

        // Last resort: use fallback
        if (!foundRoom && roomIdParam && fallbackRooms[roomIdParam]) {
          foundRoom = fallbackRooms[roomIdParam];
        }

        if (!foundRoom) {
          console.error(
            "Room not found. Available rooms:",
            roomsList,
            "Search params:",
            { roomIdParam, roomNameParam },
          );
          setError("Room not found");
          return;
        }

        setRoom(foundRoom);
      } catch (err) {
        console.error("Failed to fetch room:", err);
        // Use fallback on error
        if (roomIdParam && fallbackRooms[roomIdParam]) {
          setRoom(fallbackRooms[roomIdParam]);
        } else {
          setError("Failed to load room details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomIdParam, roomNameParam]);

  if (!checkInDate || !checkOutDate || !roomIdParam) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold">
              Missing booking information
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Please select a room and dates first
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading room details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !room) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold">
              {error || "Room not found"}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const totalPrice = room.priceNGN * nights;

  // Check if Paystack key is valid (not placeholder)
  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  const isValidPaystackKey =
    paystackKey &&
    paystackKey !== "pk_test_xxxxxxxxxxxx" &&
    paystackKey.startsWith("pk_");

  const handlePayment = async () => {
    if (!guestName || !guestEmail || !guestPhone) {
      setError("Please fill in all guest information");
      return;
    }

    setProcessing(true);

    try {
      // Create booking
      const bookingRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          numberOfGuests: 1,
          email: guestEmail,
          firstName: guestName.split(" ")[0],
          lastName: guestName.split(" ").slice(1).join(" "),
          phone: guestPhone,
          specialRequests,
          totalAmount: totalPrice,
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingData.booking) {
        throw new Error(bookingData.error || "Failed to create booking");
      }

      const booking = bookingData.booking;
      const paystackReference = bookingData.paystackReference;

      if (!isValidPaystackKey) {
        // Demo mode - simulate successful payment
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Store booking details in sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("lastBooking", JSON.stringify(booking));
        }

        // Send confirmation email with booking details included
        const nights = Math.ceil(
          (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
            (1000 * 60 * 60 * 24),
        );

        await fetch("/api/emails/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.id,
            email: guestEmail,
            bookingDetails: {
              id: booking.id,
              checkInDate: checkInDate.toISOString(),
              checkOutDate: checkOutDate.toISOString(),
              roomTitle: room.title,
              totalAmount: totalPrice,
              numberOfGuests: 1,
            },
          }),
        }).catch((err) => console.error("Failed to send email:", err));

        // Redirect to confirmation
        router.push(`/booking-confirmation?bookingId=${booking.id}`);
        return;
      }

      // Initialize Paystack with real key
      if (typeof window !== "undefined" && window.PaystackPop) {
        window.PaystackPop.setup({
          key: paystackKey,
          email: guestEmail,
          amount: totalPrice * 100, // Paystack expects amount in kobo
          ref: paystackReference,
          onClose: () => {
            setProcessing(false);
          },
          onSuccess: async () => {
            // Verify payment
            const verifyRes = await fetch(
              `/api/payments/verify/${paystackReference}`,
              {
                method: "POST",
              },
            );

            if (!verifyRes.ok) {
              setError("Payment verification failed");
              return;
            }

            // Store booking details in sessionStorage
            if (typeof window !== "undefined") {
              sessionStorage.setItem("lastBooking", JSON.stringify(booking));
            }

            // Send confirmation email with booking details included
            const nights = Math.ceil(
              (new Date(checkOutDate).getTime() -
                new Date(checkInDate).getTime()) /
                (1000 * 60 * 60 * 24),
            );

            // Send confirmation email
            await fetch("/api/emails/send-confirmation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: booking.id,
                email: guestEmail,
                bookingDetails: {
                  id: booking.id,
                  checkInDate: checkInDate.toISOString(),
                  checkOutDate: checkOutDate.toISOString(),
                  roomTitle: room.title,
                  totalAmount: totalPrice,
                  numberOfGuests: 1,
                },
              }),
            }).catch((err) => console.error("Failed to send email:", err));

            // Redirect to confirmation
            router.push(`/booking-confirmation?bookingId=${booking.id}`);
          },
        }).openIframe();
      } else {
        // Load Paystack script if not loaded
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => {
          if (window.PaystackPop) {
            window.PaystackPop.setup({
              key: paystackKey,
              email: guestEmail,
              amount: totalPrice * 100,
              ref: paystackReference,
              onClose: () => setProcessing(false),
              onSuccess: async () => {
                const verifyRes = await fetch(
                  `/api/payments/verify/${paystackReference}`,
                  {
                    method: "POST",
                  },
                );

                if (!verifyRes.ok) {
                  setError("Payment verification failed");
                  return;
                }

                // Store booking details in sessionStorage
                if (typeof window !== "undefined") {
                  sessionStorage.setItem(
                    "lastBooking",
                    JSON.stringify(booking),
                  );
                }

                // Send confirmation email with booking details included
                const nights = Math.ceil(
                  (new Date(checkOutDate).getTime() -
                    new Date(checkInDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                );

                await fetch("/api/emails/send-confirmation", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookingId: booking.id,
                    email: guestEmail,
                    bookingDetails: {
                      id: booking.id,
                      checkInDate: checkInDate.toISOString(),
                      checkOutDate: checkOutDate.toISOString(),
                      roomTitle: room.title,
                      totalAmount: totalPrice,
                      numberOfGuests: 1,
                    },
                  }),
                }).catch((err) => console.error("Failed to send email:", err));

                router.push(`/booking-confirmation?bookingId=${booking.id}`);
              },
            }).openIframe();
          }
        };
        document.body.appendChild(script);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process booking");
      setProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Payment
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your details to finalize your booking
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6 border-2 border-blue-200">
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">Room</p>
              <h2 className="text-xl font-bold text-gray-900">{room.title}</h2>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-In:</span>
                <span className="font-semibold text-gray-900">
                  {format(checkInDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-Out:</span>
                <span className="font-semibold text-gray-900">
                  {format(checkOutDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nights:</span>
                <span className="font-semibold text-gray-900">{nights}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Price:</span>
              <span className="text-2xl font-bold text-blue-900">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Guest Information Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Your Details
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name*
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={processing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  disabled={processing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone*
                </label>
                <input
                  type="tel"
                  placeholder="+234 123 456 7890"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  disabled={processing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  placeholder="Any special requests for your stay?"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  disabled={processing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processing || !guestName || !guestEmail || !guestPhone}
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base shadow-lg"
            >
              {processing
                ? "Processing..."
                : isValidPaystackKey
                  ? "Pay with Paystack"
                  : "Complete Booking (Demo)"}
            </button>

            {!isValidPaystackKey && (
              <div className="mt-3 bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-xs text-green-700 text-center">
                ✓ Demo Mode: Payment will be simulated. Configure Paystack keys
                for real payments.
              </div>
            )}

            <p className="text-xs text-gray-600 text-center mt-4">
              {isValidPaystackKey
                ? "💳 Secure payment powered by Paystack. Your details are safe and encrypted."
                : "Demo mode enabled for testing. No real payment processed."}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
