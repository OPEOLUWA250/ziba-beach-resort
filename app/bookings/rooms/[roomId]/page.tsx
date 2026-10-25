"use client";

import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import RoomGalleryCarousel from "@/components/room-gallery-carousel";
import { getRoomImages } from "@/lib/room-images";
import { getRoomById } from "@/lib/services/rooms";
import {
  ROOM_CATALOG,
  STAY_POLICY_HIGHLIGHTS,
  formatPriceFrom,
} from "@/lib/room-catalog";
import { IPMS_BOOKING_URL, whatsappLink } from "@/lib/booking-links";
import { track } from "@/lib/analytics";

export default function RoomDetail({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.roomId;
  const staticRoom = ROOM_CATALOG[roomId];
  const [showFullyBookedMessage, setShowFullyBookedMessage] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [, setRoomStatus] = useState<string>("available");
  const [, setLoading] = useState(true);

  // Fetch live price from Supabase
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const dbRoom = await getRoomById(roomId);
        if (dbRoom) {
          setLivePrice(dbRoom.pricengn || null);
          setRoomStatus(dbRoom.status || "available");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const room = staticRoom;
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Room not found</p>
          <Link href="/bookings" className="text-blue-600 hover:underline">
            Back to rooms
          </Link>
        </div>
      </div>
    );
  }

  // Room stays are booked on the resort's IPMS booking engine.
  const handleBookNow = () => {
    track("room_book_click", { context: "room-page", room: room.name });
    window.location.href = IPMS_BOOKING_URL;
  };

  const priceLabel = formatPriceFrom(livePrice || room.priceFrom);
  const inquiryHref = whatsappLink(
    `Hello Ziba Beach Resort, I'm interested in the ${room.name}. Please share availability and rates for my dates.`,
  );

  // Shared by the mobile card and the desktop sidebar. Everything listed here
  // comes from the room page or the Resort Policies — no marketing promises.
  const bookingPanel = (
    <>
      <div>
        <p className="text-3xl font-light text-gray-900">{priceLabel}</p>
        <p className="text-sm text-gray-600 font-light">
          per night · live rates and availability on our booking engine
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleBookNow}
          className="flex-1 py-4 rounded-lg transition font-light flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white hover:shadow-lg"
        >
          Book Now
          <span>→</span>
        </button>
        <a
          href={inquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border-2 border-gray-900 text-gray-900 py-4 rounded-lg hover:bg-gray-50 transition font-light text-center"
        >
          Inquiry
        </a>
      </div>

      {room.notes && room.notes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
          {room.notes.map((note) => (
            <p key={note} className="text-sm font-light text-gray-800">
              {note}
            </p>
          ))}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Good to Know
        </h3>
        <div className="space-y-2 text-sm font-light text-gray-700">
          {STAY_POLICY_HIGHLIGHTS.map((item) => (
            <p key={item}>• {item}</p>
          ))}
        </div>
        <Link
          href="/bookings#policies"
          className="inline-block text-sm text-blue-700 hover:underline"
        >
          Read the full resort policies
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Fully Booked Modal */}
      {showFullyBookedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-8">
              <div className="flex justify-between items-start mb-3">
                <FontAwesomeIcon icon={faLock} className="w-10 h-10 text-white" />
                <button
                  onClick={() => setShowFullyBookedMessage(false)}
                  className="text-white hover:bg-white/20 p-1 rounded transition"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-3xl font-bold text-white">Fully Booked</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 font-light text-center">
                This wonderful room is currently fully booked. We&apos;re sure you&apos;ll
                love it! Please check back soon or contact our team.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-light">
                  <strong className="font-semibold text-gray-900">
                    Other Options:
                  </strong>
                  <br />
                  Browse our other beautiful rooms and accommodations.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFullyBookedMessage(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-light"
                >
                  Close
                </button>
                <Link
                  href="/bookings"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-light text-center"
                >
                  View All Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="bg-white">
        {/* HERO IMAGE SECTION */}
        <section className="relative w-full h-screen bg-gray-900 overflow-hidden">
          {/* Back Button */}
          <Link
            href="/bookings"
            className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
            <span className="font-light">Back</span>
          </Link>
          <div className="absolute inset-0">
            <Image
              src={getRoomImages(room.id).hero}
              alt={`${room.name} - Hero Image`}
              fill
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl mx-auto px-6">
              <span className="text-lg font-light text-gray-200 uppercase tracking-widest">
                Room {room.number}
              </span>
              <h1
                className="text-7xl font-light text-white mt-4 mb-6"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {room.name}
              </h1>
              <p className="text-2xl font-light text-gray-100">
                Experience Luxury at Ziba Beach Resort
              </p>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-white text-center">
              <p className="text-sm font-light mb-2">Explore More</p>
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-light transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
              Back to Rooms
            </Link>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-gray-100 to-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2
                className="text-4xl font-light text-blue-900 mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Room Gallery
              </h2>
              <div className="w-20 h-1 bg-blue-900"></div>
            </div>

            <RoomGalleryCarousel
              images={getRoomImages(room.id).carousel}
              roomName={room.name}
            />
          </div>
        </section>

        {/* Booking Card - Mobile Only */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 md:hidden">
          <div className="max-w-6xl mx-auto">
            <div className="bg-linear-to-b from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8 space-y-6">
              {bookingPanel}
            </div>
          </div>
        </section>

        {/* Room Details */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Left: Details */}
              <div className="md:col-span-2 space-y-10">
                <div>
                  <span className="text-sm text-gray-600 font-light uppercase tracking-widest">
                    Room {room.number}
                  </span>
                  <h1
                    className="text-5xl font-light text-gray-900 mt-2 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {room.name}
                  </h1>
                  <p className="text-lg text-gray-700 font-light leading-relaxed">
                    {room.description}
                  </p>
                </div>

                <div>
                  <h2
                    className="text-2xl font-light text-gray-900 mb-6"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Room Specifications
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200">
                      <p className="text-sm text-gray-600 font-light mb-1">
                        Size
                      </p>
                      <p className="text-2xl font-light text-gray-900">
                        {room.size}
                      </p>
                    </div>
                    <div className="bg-linear-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-200">
                      <p className="text-sm text-gray-600 font-light mb-1">
                        Capacity
                      </p>
                      <p className="text-lg font-light text-gray-900">
                        {room.capacity}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2
                    className="text-2xl font-light text-gray-900 mb-6"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Bedding & Layout
                  </h2>
                  <p className="text-lg text-gray-700 font-light leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-200">
                    {room.bedding}
                    <span className="block text-base text-gray-600 mt-2">
                      {room.view}
                    </span>
                  </p>
                </div>

                <div>
                  <h2
                    className="text-2xl font-light text-gray-900 mb-6"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Room Features
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {room.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-900 font-semibold mt-1">
                          ✓
                        </span>
                        <span className="text-gray-700 font-light">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2
                    className="text-2xl font-light text-gray-900 mb-6"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Amenities & Services
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {room.amenities.map((amenity, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 bg-linear-to-br from-blue-50 to-white rounded-lg border border-blue-100"
                      >
                        <span className="text-blue-900 text-lg">•</span>
                        <span className="text-gray-700 font-light text-sm">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Sidebar - Desktop Only */}
              <div className="hidden md:block">
                <div className="bg-linear-to-b from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8 sticky top-20 space-y-6">
                  {bookingPanel}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Rooms CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-r from-blue-900 to-blue-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-5xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Explore Our Other Rooms
            </h2>
            <p className="text-lg text-gray-200 font-light mb-10">
              Discover more accommodation options tailored to your preferences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/bookings"
                className="bg-white text-gray-900 px-10 py-4 rounded-lg font-light hover:bg-gray-100 transition-all duration-300 inline-block"
              >
                View All Rooms
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-10 py-4 rounded-lg font-light hover:bg-white hover:text-gray-900 transition-all duration-300 inline-block"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
