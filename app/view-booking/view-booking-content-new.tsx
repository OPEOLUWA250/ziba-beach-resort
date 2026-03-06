"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Calendar,
  Users,
  DollarSign,
  Search,
  Receipt,
  Loader2,
  X,
  Printer,
  Download,
  Mail,
  CreditCard,
  MapPin,
} from "lucide-react";

interface RoomBooking {
  id: string;
  bookingReferenceCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  roomPriceNgn: number;
  numberOfNights: number;
  totalAmountNgn: number;
  paymentStatus: string;
  paymentType?: string;
  paystackReference?: string;
  dateOfBooking?: string;
  createdAt: string;
  paidAt?: string;
}

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
  paymentType?: string;
  paystackReference?: string;
  dateOfBooking?: string;
  createdAt: string;
}

export function ViewBookingContentNew() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramRef = searchParams.get("ref");
  const paramEmail = searchParams.get("email");

  const [searchRef, setSearchRef] = useState(paramRef || "");
  const [searchEmail, setSearchEmail] = useState(paramEmail || "");
  const [booking, setBooking] = useState<RoomBooking | DayPassBooking | null>(
    null,
  );
  const [bookingType, setBookingType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Auto-search if URL has parameters
  useEffect(() => {
    if (paramRef) {
      console.log("[Lookup Component] Auto-searching with URL param:", paramRef);
      handleSearch(paramRef, paramEmail || undefined);
    }
  }, [paramRef, paramEmail]);

  const handleSearch = async (refValue?: string, emailValue?: string) => {
    const ref = (refValue || searchRef).toUpperCase().trim();
    const emailParam = emailValue || searchEmail;

    if (!ref) {
      setError("Please enter a reference number");
      return;
    }

    setSearching(true);
    setLoading(true);
    setError(null);
    setBooking(null);

    try {
      const url = emailParam
        ? `/api/receipt/lookup?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(emailParam)}`
        : `/api/receipt/lookup?ref=${encodeURIComponent(ref)}`;

      console.log("[Lookup Component] Fetching from:", url);

      const response = await fetch(url);

      console.log("[Lookup Component] Response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error("[Lookup Component] Error response:", data);
        throw new Error(data.error || `Booking not found (${response.status})`);
      }

      const data = await response.json();
      console.log("[Lookup Component] Success! Booking type:", data.bookingType, "Booking:", data.booking);
      
      setBooking(data.booking);
      setBookingType(data.bookingType);

      // Update URL with search params
      router.push(
        `/view-booking?ref=${encodeURIComponent(ref)}${emailParam ? `&email=${encodeURIComponent(emailParam)}` : ""}`,
        { scroll: false },
      );
    } catch (err) {
      console.error("[Lookup Component] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch booking");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    RESERVED: "bg-blue-100 text-blue-800 border-blue-200",
    CONFIRMED: "bg-green-100 text-green-800 border-green-200",
    PAID: "bg-green-100 text-green-800 border-green-200",
    ACTIVATED: "bg-green-100 text-green-800 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <AlertCircle className="w-5 h-5" />,
    RESERVED: <CheckCircle className="w-5 h-5" />,
    CONFIRMED: <CheckCircle className="w-5 h-5" />,
    PAID: <CheckCircle className="w-5 h-5" />,
    ACTIVATED: <CheckCircle className="w-5 h-5" />,
    COMPLETED: <CheckCircle className="w-5 h-5" />,
    CANCELLED: <X className="w-5 h-5" />,
  };

  // Render search form
  const renderSearchForm = () => (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 animate-fadeIn">
        {/* Icon Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg">
            <Receipt className="w-7 h-7 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-light text-gray-900 mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Find Your Booking
          </h1>
          <p className="text-gray-600 text-base font-light">
            Enter your reference number to view your receipt
          </p>
        </div>

        {/* Search Form */}
        <div className="space-y-4">
          {/* Reference Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number *
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchRef}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setSearchRef(val);
                  setError(null); // Clear previous errors while typing
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSearch();
                  }
                }}
                placeholder="ZB-2026-12345 or Paystack reference"
                className="w-full px-4 py-3 pr-11 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base font-mono"
                disabled={loading}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Format: <span className="font-mono font-semibold">ZB-XXXX-XXXXX</span> (room) or <span className="font-mono font-semibold">ZB-DP-XXXXXXXXX</span> (day pass)
            </p>
          </div>

          {/* Email Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional for verification)
            </label>
            <div className="relative">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSearch();
                  }
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-3 pr-11 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                disabled={loading}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slideIn">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={loading || !searchRef.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Receipt
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="bg-blue-50 rounded-xl p-3 mb-3">
            <p className="text-sm text-blue-900 font-medium mb-2">📝 Need help?</p>
            <p className="text-xs text-blue-800 mb-2">
              Your booking reference starts with <span className="font-mono font-semibold">ZB-</span> and was sent in your confirmation email.
            </p>
            <p className="text-xs text-blue-800">
              You can also search by your Paystack payment reference.
            </p>
          </div>
          <p className="text-center text-sm text-gray-600">
            Lost your reference? Contact us at{" "}
            <a
              href="mailto:bookings@zibabeachresort.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              bookings@zibabeachresort.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  // Render room booking receipt
  const renderRoomReceipt = (roomBooking: RoomBooking) => {
    const checkInDate = new Date(roomBooking.checkInDate);
    const checkOutDate = new Date(roomBooking.checkOutDate);

    return (
      <div className="max-w-5xl mx-auto animate-fadeIn">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-4">
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 shadow-lg animate-bounce-once">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h1
              className="text-3xl sm:text-4xl font-light text-gray-900 mb-2"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Booking Confirmed
            </h1>
            <p className="text-gray-600 text-base font-light">
              Your reservation is confirmed and ready
            </p>
          </div>

          {/* Reference Box */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-5 text-center mb-5 shadow-lg">
            <p className="text-blue-100 text-sm mb-2 uppercase tracking-wide">
              Booking Reference
            </p>
            <p className="text-white text-2xl sm:text-3xl font-bold font-mono tracking-wide mb-1">
              {roomBooking.bookingReferenceCode}
            </p>
            <p className="text-blue-100 text-xs">
              Please save this for check-in
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs border-2 ${statusColors[roomBooking.paymentStatus]}`}
            >
              {statusIcons[roomBooking.paymentStatus]}
              {roomBooking.paymentStatus}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-4">
          <h2
            className="text-2xl sm:text-3xl font-light text-gray-900 mb-5"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Booking Details
          </h2>

          {/* Guest Info */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Guest Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-900 font-medium">
                  {roomBooking.guestName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">
                  {roomBooking.guestEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900 font-medium">
                  {roomBooking.guestPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of Guests</p>
                <p className="text-gray-900 font-medium">
                  {roomBooking.numberOfGuests}
                </p>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Stay Details
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Check-In</p>
                <p className="text-lg font-bold text-blue-900">
                  {format(checkInDate, "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-gray-600">
                  {format(checkInDate, "EEEE")}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Check-Out</p>
                <p className="text-lg font-bold text-blue-900">
                  {format(checkOutDate, "MMM dd, yyyy")}
                </p>
                <p className="text-sm text-gray-600">
                  {format(checkOutDate, "EEEE")}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Nights</p>
                <p className="text-2xl font-bold text-blue-900">
                  {roomBooking.numberOfNights}
                </p>
                <p className="text-sm text-gray-600">nights</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Payment Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Room Price per Night</span>
                <span className="font-semibold">
                  ₦{roomBooking.roomPriceNgn.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Number of Nights</span>
                <span className="font-semibold">
                  × {roomBooking.numberOfNights}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-blue-900">
                  ₦{roomBooking.totalAmountNgn.toLocaleString()}
                </span>
              </div>
              {roomBooking.paymentType && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Method</span>
                  <span className="capitalize">{roomBooking.paymentType}</span>
                </div>
              )}
              {roomBooking.paystackReference && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Reference</span>
                  <span className="font-mono text-xs">
                    {roomBooking.paystackReference}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          {roomBooking.specialRequests && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Special Requests
              </h3>
              <p className="text-gray-700">{roomBooking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-4 print:hidden">
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => setBooking(null)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all text-sm font-medium"
            >
              <Search className="w-4 h-4" />
              New Search
            </button>
            <a
              href="mailto:bookings@zibabeachresort.com"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Render day-pass receipt
  const renderDayPassReceipt = (dayPassBooking: DayPassBooking) => {
    const visitDate = new Date(dayPassBooking.visitDate);

    return (
      <div className="max-w-5xl mx-auto animate-fadeIn">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-4">
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 shadow-lg animate-bounce-once">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h1
              className="text-3xl sm:text-4xl font-light text-gray-900 mb-2"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Day Pass Confirmed
            </h1>
            <p className="text-gray-600 text-base font-light">
              Your day experience is all set!
            </p>
          </div>

          {/* Reference Box */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-5 text-center mb-5 shadow-lg">
            <p className="text-blue-100 text-sm mb-2 uppercase tracking-wide">
              Reference Code
            </p>
            <p className="text-white text-xl sm:text-2xl font-bold font-mono tracking-wide mb-1 break-all">
              {dayPassBooking.referenceCode}
            </p>
            <p className="text-blue-100 text-xs">Present this at reception</p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs border-2 ${statusColors[dayPassBooking.paymentStatus]}`}
            >
              {statusIcons[dayPassBooking.paymentStatus]}
              {dayPassBooking.paymentStatus}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-4">
          <h2
            className="text-2xl sm:text-3xl font-light text-gray-900 mb-5"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Booking Details
          </h2>

          {/* Guest Info */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Guest Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-900 font-medium">
                  {dayPassBooking.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">
                  {dayPassBooking.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900 font-medium">
                  {dayPassBooking.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Visit Details
            </h3>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Visit Date</p>
              <p className="text-2xl font-bold text-blue-900">
                {format(visitDate, "MMM dd, yyyy")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {format(visitDate, "EEEE")}
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="mb-5 pb-5 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Items Purchased
            </h3>
            <div className="space-y-2">
              {dayPassBooking.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-blue-900">
                  ₦{dayPassBooking.totalAmount.toLocaleString()}
                </span>
              </div>
              {dayPassBooking.paymentType && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Method</span>
                  <span className="capitalize">
                    {dayPassBooking.paymentType}
                  </span>
                </div>
              )}
              {dayPassBooking.paystackReference && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Reference</span>
                  <span className="font-mono text-xs">
                    {dayPassBooking.paystackReference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-4 print:hidden">
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => setBooking(null)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all text-sm font-medium"
            >
              <Search className="w-4 h-4" />
              New Search
            </button>
            <a
              href="mailto:bookings@zibabeachresort.com"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl transition-all text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-6 sm:py-8 px-4">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading your booking...</p>
            </div>
          </div>
        ) : booking && bookingType ? (
          bookingType === "room" ? (
            renderRoomReceipt(booking as RoomBooking)
          ) : (
            renderDayPassReceipt(booking as DayPassBooking)
          )
        ) : (
          renderSearchForm()
        )}
      </div>
      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-once {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 1s ease-in-out;
        }

        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
