"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PaymentSuccessModal from "@/components/payment-success-modal";
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Fallback room data for demo mode - ALL 9 ROOMS
  const fallbackRooms: { [key: string]: RoomData } = {
    room01: {
      id: "room01",
      title: "Beach Facing Room",
      description:
        "Experience the essence of beach luxury with stunning ocean views and direct access to our pristine shoreline.",
      priceNGN: 202000,
      capacity: 3,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi",
        "Minibar",
        "Room Service",
        "Daily Housekeeping",
        "Safe Deposit Box",
        "Wake-up Service",
        "24/7 Concierge",
        "Beach Towel Service",
      ],
    },
    room02: {
      id: "room02",
      title: "Beach Facing Family Room - Partial View",
      description:
        "Partial View - Spacious family accommodation with flexible sleeping arrangements, perfect for creating unforgettable memories.",
      priceNGN: 225000,
      capacity: 6,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi",
        "Minibar",
        "Kids Welcome Package",
        "Childminding Service Available",
        "Room Service",
        "Family Beach Amenities",
        "Game Console",
        "Beach Equipment",
      ],
    },
    room03: {
      id: "room03",
      title: "Beach Facing Family Room - Full View",
      description:
        "Full View - Premium family space with expansive pool and ocean views, offering the perfect backdrop for quality family time.",
      priceNGN: 247500,
      capacity: 6,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi",
        "Minibar",
        "Kids Welcome Package",
        "Childminding Service",
        "Premium Room Service",
        "Family Activities",
        "Telescope for Stargazing",
        "Beach Equipment Package",
      ],
    },
    room04: {
      id: "room04",
      title: "Beach Facing Connecting Room",
      description:
        "Two interconnected rooms offering flexibility and privacy. Perfect for groups or families needing separate spaces.",
      priceNGN: 202500,
      capacity: 3,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi in both units",
        "Minibars",
        "Room Service",
        "Priority Housekeeping",
        "24/7 Concierge",
        "Family Entertainment",
        "Beach Equipment",
        "Priority Dining",
      ],
    },
    room05: {
      id: "room05",
      title: "Beach Facing Suite",
      description:
        "Sophisticated luxury living with dedicated living room and sleeping quarters offering ultimate in space and comfort.",
      priceNGN: 231750,
      capacity: 3,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi",
        "Premium Minibar",
        "24/7 Room Service",
        "Butler Service Available",
        "Concierge",
        "Nespresso Machine",
        "Premium Toiletries",
        "Newspaper Delivery",
      ],
    },
    room06: {
      id: "room06",
      title: "Two Bedroom Apartment",
      description:
        "The epitome of luxury and space. A full apartment experience with private pool, two bedrooms, and comprehensive amenities.",
      priceNGN: 450000,
      capacity: 6,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi throughout",
        "Premium Minibar",
        "24/7 Concierge",
        "Chef Service Available",
        "Private Butler",
        "Laundry Service",
        "Private Beach Cabana",
        "Entertainment System",
      ],
    },
    room07: {
      id: "room07",
      title: "Overwater Terrace Room",
      description:
        "Suspended over crystal-clear waters, this intimate sanctuary offers the unique experience of waking to ocean views.",
      priceNGN: 213750,
      capacity: 2,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi",
        "Premium Minibar",
        "24/7 Room Service",
        "Romantic Turndown Service",
        "Snorkeling Equipment",
        "Telescope",
        "Premium Toiletries",
        "Champagne Service",
      ],
    },
    room08: {
      id: "room08",
      title: "Overwater Terrace Suite",
      description:
        "The ultimate water-based luxury. This expansive suite features a dedicated living room and bedroom suspended over the ocean.",
      priceNGN: 258750,
      capacity: 3,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi",
        "Premium Minibar",
        "24/7 Butler Service",
        "Personalized Concierge",
        "Snorkeling & Water Sports",
        "Premium Entertainment System",
        "Spa Bath",
        "Breakfast on Terrace",
      ],
    },
    room09: {
      id: "room09",
      title: "Ziba Black",
      description:
        "Elegantly designed with sophisticated aesthetics. This distinctive room combines modern luxury with beach accessibility.",
      priceNGN: 202500,
      capacity: 3,
      images: ["/Ziba-hero.jpg"],
      amenities: [
        "WiFi",
        "Premium Minibar",
        "Room Service",
        "Daily Housekeeping",
        "Safe Deposit Box",
        "Concierge Service",
        "Beach Access",
        "Turndown Service",
      ],
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
    setError("");

    try {
      console.log("📝 Creating booking with data:", {
        guestEmail,
        guestName,
        guestPhone,
        roomId: room.id,
        checkInDate: format(checkInDate, "yyyy-MM-dd"),
        checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
        roomPriceNGN: room.priceNGN,
        numberOfNights: nights,
      });

      // Create booking
      const bookingRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: guestEmail,
          guestName: guestName,
          guestPhone: guestPhone,
          roomId: room.id,
          checkInDate: format(checkInDate, "yyyy-MM-dd"),
          checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
          numberOfGuests: 1,
          specialRequests,
          roomPriceNGN: room.priceNGN,
          numberOfNights: nights,
        }),
      });

      console.log("📬 Booking API response status:", bookingRes.status);
      const bookingData = await bookingRes.json();
      console.log("📥 Booking API response:", bookingData);

      if (!bookingRes.ok) {
        const errorMsg = bookingData.error || `API error: ${bookingRes.status}`;
        console.error("❌ Booking creation failed:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!bookingData.booking) {
        throw new Error(bookingData.error || "No booking returned from API");
      }

      const booking = bookingData.booking;
      const { payment } = bookingData;
      const paystackReference = payment.reference;

      console.log("✅ Booking created:", booking.id);
      console.log("💳 Paystack reference:", paystackReference);

      // Transform booking to match confirmation page expectations
      const transformedBooking = {
        id: booking.id,
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        numberOfGuests: booking.number_of_guests,
        specialRequests: booking.special_requests,
        room: {
          title: room.title,
          priceNGN: room.priceNGN,
        },
        user: {
          firstName: guestName.split(" ")[0],
          lastName: guestName.split(" ").slice(1).join(" "),
          email: booking.guest_email,
        },
        payment: {
          amountNGN: booking.total_amount_ngn,
          paystackReference,
        },
      };

      console.log("🎬 Demo mode?", !isValidPaystackKey);

      if (!isValidPaystackKey) {
        // Demo mode - simulate successful payment
        console.log("🔄 Entering demo mode - simulating payment");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Store booking details in sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "lastBooking",
            JSON.stringify(transformedBooking),
          );
        }

        // Send confirmation email with booking details included
        const nights = Math.ceil(
          (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
            (1000 * 60 * 60 * 24),
        );

        console.log("📧 Sending confirmation email");
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

        console.log("✅ Demo booking complete - redirecting to confirmation");

        // Small delay to ensure sessionStorage is committed
        await new Promise((resolve) => setTimeout(resolve, 300));

        setProcessing(false);

        // Redirect to confirmation
        router.push(`/booking-confirmation?bookingId=${booking.id}`);
        return;
      }

      // Initialize Paystack with real key
      console.log("💳 Real Paystack mode - initializing payment");
      if (typeof window !== "undefined" && window.PaystackPop) {
        console.log("✅ PaystackPop loaded");
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: guestEmail,
          amount: totalPrice * 100, // Paystack expects amount in kobo
          ref: paystackReference,
          onClose: () => {
            console.log("🚫 Paystack modal closed by user");
            setProcessing(false);
          },
          onSuccess: async (response: any) => {
            console.log("💰 Payment successful from Paystack!");

            // Immediately set redirecting flag to prevent any re-renders from interrupting
            setIsRedirecting(true);

            // Show success modal
            setCurrentBookingId(booking.id);
            setCurrentAmount(totalPrice);
            setShowSuccessModal(true);
            setProcessing(false);

            // Store booking immediately
            if (typeof window !== "undefined") {
              sessionStorage.setItem(
                "lastBooking",
                JSON.stringify(transformedBooking),
              );
            }

            // Start background tasks
            const bookingId = booking.id;
            const confirmUrl = `/booking-confirmation?bookingId=${bookingId}`;

            // Do background work
            (async () => {
              try {
                // Verify payment
                await fetch(`/api/payments/verify/${paystackReference}`).catch(
                  () => {},
                );

                // Send email
                await fetch("/api/emails/send-confirmation", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookingId: bookingId,
                    email: guestEmail,
                    bookingDetails: {
                      id: bookingId,
                      checkInDate: checkInDate.toISOString(),
                      checkOutDate: checkOutDate.toISOString(),
                      roomTitle: room.title,
                      totalAmount: totalPrice,
                      numberOfGuests: 1,
                    },
                  }),
                }).catch(() => {});
              } catch (err) {
                console.error("Background task error:", err);
              }

              // Always redirect after 2 seconds
              setTimeout(() => {
                console.log("🔄 Redirecting to confirmation:", confirmUrl);
                router.push(confirmUrl);
              }, 2000);
            })();
          },
        });
        console.log("🎬 Opening Paystack iframe");
        handler.openIframe();
      } else {
        // Load Paystack script if not loaded
        console.log("📥 Loading Paystack script...");
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => {
          console.log("✅ Paystack script loaded");
          if (window.PaystackPop) {
            console.log("✅ PaystackPop available");
            const handler = window.PaystackPop.setup({
              key: paystackKey,
              email: guestEmail,
              amount: totalPrice * 100,
              ref: paystackReference,
              onClose: () => {
                console.log("🚫 User closed Paystack modal");
                setProcessing(false);
              },
              onSuccess: async (response: any) => {
                console.log("💰 Payment successful from Paystack!");

                // Immediately set redirecting flag
                setIsRedirecting(true);

                // Show success modal
                setCurrentBookingId(booking.id);
                setCurrentAmount(totalPrice);
                setShowSuccessModal(true);
                setProcessing(false);

                // Store booking immediately
                if (typeof window !== "undefined") {
                  sessionStorage.setItem(
                    "lastBooking",
                    JSON.stringify(transformedBooking),
                  );
                }

                // Background tasks and redirect
                const bookingId = booking.id;
                const confirmUrl = `/booking-confirmation?bookingId=${bookingId}`;

                (async () => {
                  try {
                    // Verify payment
                    await fetch(
                      `/api/payments/verify/${paystackReference}`,
                    ).catch(() => {});

                    // Send email
                    await fetch("/api/emails/send-confirmation", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        bookingId: bookingId,
                        email: guestEmail,
                        bookingDetails: {
                          id: bookingId,
                          checkInDate: checkInDate.toISOString(),
                          checkOutDate: checkOutDate.toISOString(),
                          roomTitle: room.title,
                          totalAmount: totalPrice,
                          numberOfGuests: 1,
                        },
                      }),
                    }).catch(() => {});
                  } catch (err) {
                    console.error("Background task error:", err);
                  }

                  // Always redirect after 2 seconds
                  setTimeout(() => {
                    console.log("🔄 Redirecting to confirmation:", confirmUrl);
                    router.push(confirmUrl);
                  }, 2000);
                })();
              },
            });
            console.log("🎬 Opening Paystack iframe from script load");
            handler.openIframe();
          } else {
            console.error("❌ PaystackPop not available after script load");
            setError("Payment system failed to load");
            setProcessing(false);
          }
        };
        script.onerror = () => {
          console.error("❌ Failed to load Paystack script");
          setError("Failed to load payment system");
          setProcessing(false);
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
              disabled={
                processing ||
                isRedirecting ||
                !guestName ||
                !guestEmail ||
                !guestPhone
              }
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base shadow-lg"
            >
              {isRedirecting
                ? "Redirecting..."
                : processing
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

        {/* Payment Success Modal */}
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          guestName={guestName}
          amount={currentAmount}
          bookingId={currentBookingId}
        />
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
