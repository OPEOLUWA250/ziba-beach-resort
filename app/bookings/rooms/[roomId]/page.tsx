"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import AvailabilityModal from "@/components/availability-modal";

interface Room {
  id: string;
  number: string;
  name: string;
  size: string;
  capacity: string;
  price: string;
  description: string;
  bedding: string;
  features: string[];
  amenities: string[];
  images: string[];
}

const rooms: { [key: string]: Room } = {
  room01: {
    id: "room01",
    number: "01",
    name: "Beach Facing Room",
    size: "19m²",
    capacity: "Up to 3 guests: 2 adults or 2 adults and a child",
    price: "from ₦202,000 / night",
    description:
      "Experience the essence of beach luxury with stunning ocean views and direct access to our pristine shoreline. Perfect for couples or small families seeking an intimate getaway.",
    bedding: "1 King size bed",
    features: [
      "Balcony with partial pool view overlooking the beach",
      "Direct beach access",
      "Rainfall shower",
      "Air conditioning",
      "Smart TV with streaming",
      "Premium toiletries",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room02: {
    id: "room02",
    number: "02",
    name: "Beach Facing Family Room",
    size: "26m²",
    capacity: "Up to 6 guests: 4 adults or 2 adults and up to 4 children",
    price: "from ₦225,000 / night",
    description:
      "Partial View - Spacious family accommodation with flexible sleeping arrangements, perfect for creating unforgettable memories with loved ones.",
    bedding: "1 King size bed and 1 bunk bed with a pull-out bed",
    features: [
      "Balcony with partial pool view overlooking the beach",
      "Extra sleeping capacity",
      "Rainfall shower",
      "Air conditioning",
      "Dual climate zones",
      "Multiple power outlets",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room03: {
    id: "room03",
    number: "03",
    name: "Beach Facing Family Room",
    size: "26m²",
    capacity: "Up to 6 guests: 4 adults or 2 adults and up to 4 children",
    price: "from ₦247,500 / night",
    description:
      "Full View - Premium family space with expansive pool and ocean views, offering the perfect backdrop for quality family time.",
    bedding: "1 King size bed and 1 bunk bed with a pull-out bed",
    features: [
      "Balcony with full pool view overlooking the beach",
      "Panoramic ocean views",
      "Spacious layout",
      "Rainfall shower",
      "Air conditioning",
      "Multiple entertainment options",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room04: {
    id: "room04",
    number: "04",
    name: "Beach Facing Connecting Room",
    size: "32m²",
    capacity: "Up to 3 guests: 2 adults or 2 adults and a child",
    price: "from ₦202,500 / night",
    description:
      "Two interconnected rooms offering flexibility and privacy. Perfect for groups or families needing separate spaces with ease of access.",
    bedding:
      "1 King size bed or twin beds sold individually. Choose 2 units to get both rooms",
    features: [
      "Balcony with pool view overlooking the beach",
      "Connecting door between rooms",
      "Flexible sleeping options",
      "Dual rainfall showers",
      "Air conditioning",
      "Separate spaces for privacy",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room05: {
    id: "room05",
    number: "05",
    name: "Beach Facing Suite",
    size: "Living room",
    capacity: "Up to 3 guests",
    price: "from ₦231,750 / night",
    description:
      "Sophisticated luxury living with dedicated living room and sleeping quarters. An ideal choice for those seeking the ultimate in space and comfort.",
    bedding: "1 King size bed and 1 sofa bed",
    features: [
      "Balcony with full view overlooking the beach",
      "Separate living room area",
      "Rainfall shower and soaking tub",
      "Air conditioning throughout",
      "Premium entertainment system",
      "Work desk area",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room06: {
    id: "room06",
    number: "06",
    name: "Two Bedroom Apartment",
    size: "Open style Living Area",
    capacity: "Up to 6 guests",
    price: "from ₦450,000 / night",
    description:
      "The epitome of luxury and space. A full apartment experience with private pool, two bedrooms, and comprehensive amenities for the most discerning travelers.",
    bedding: "2 rooms with 2 King size beds and 1 sofa bed",
    features: [
      "Private pool",
      "Open-style living area",
      "Two separate bedrooms",
      "Multiple bathrooms",
      "Full kitchen facilities",
      "Dual rainfall showers",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room07: {
    id: "room07",
    number: "07",
    name: "Overwater Terrace Room",
    size: "24m²",
    capacity: "2 adults",
    price: "from ₦213,750 / night",
    description:
      "Suspended over crystal-clear waters, this intimate sanctuary offers the unique experience of waking to ocean views and direct water access from your private terrace.",
    bedding: "1 King size bed",
    features: [
      "Wooden deck with direct access to overwater pool",
      "Glass floor panels for marine viewing",
      "Private swimming area",
      "Outdoor shower",
      "Luxury rainfall shower indoors",
      "Romantic ambiance",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room08: {
    id: "room08",
    number: "08",
    name: "Overwater Terrace Suite",
    size: "32m²",
    capacity: "Up to 3 guests",
    price: "from ₦258,750 / night",
    description:
      "The ultimate water-based luxury. This expansive suite features a dedicated living room and bedroom suspended over the ocean, offering unparalleled views and experiences.",
    bedding: "1 King size bed",
    features: [
      "Wooden deck with direct access to overwater pool",
      "Spacious living room on water",
      "Glass floor viewing areas",
      "Private infinity pool edge",
      "Dual rainfall showers",
      "Outdoor entertainment space",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
  room09: {
    id: "room09",
    number: "09",
    name: "Ziba Black",
    size: "19m²",
    capacity: "Up to 3 guests: 2 adults or 2 adults and a child",
    price: "from ₦202,500 / night",
    description:
      "Elegantly designed with sophisticated aesthetics. This distinctive room combines modern luxury with beach accessibility, offering a unique retreat experience.",
    bedding: "1 King size bed",
    features: [
      "Balcony with pool view overlooking the beach",
      "Contemporary design elements",
      "Rainfall shower",
      "Air conditioning",
      "Smart lighting system",
      "Premium furnishings",
    ],
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
    images: ["/Ziba-hero.jpg"],
  },
};

export default function RoomDetail({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.roomId;
  const room = rooms[roomId];
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBooking = (checkInDate: Date, checkOutDate: Date) => {
    const checkInStr = checkInDate.toISOString().split("T")[0];
    const checkOutStr = checkOutDate.toISOString().split("T")[0];
    setIsModalOpen(false);
    // Redirect to payment page with room pre-selected and dates
    const roomName = encodeURIComponent(room?.name || roomId);
    router.push(
      `/booking/payment?roomId=${roomId}&roomName=${roomName}&checkIn=${checkInStr}&checkOut=${checkOutStr}`,
    );
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Room Not Found
          </h1>
          <Link
            href="/bookings"
            className="text-gray-600 hover:text-gray-900 font-light"
          >
            Back to Rooms →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* HERO IMAGE SECTION */}
        <section className="relative w-full h-screen bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/Ziba-hero.jpg"
              alt={`${room.name} - Hero Image`}
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
              <p className="text-2xl font-light text-gray-100">{room.price}</p>
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
              <ChevronLeft className="w-5 h-5" />
              Back to Rooms
            </Link>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-gray-100 to-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2
                className="text-4xl font-light text-blue-900 mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Room Gallery
              </h2>
              <div className="w-20 h-1 bg-gray-900"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Main Feature Image */}
              <div className="lg:col-span-2 lg:row-span-2 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div
                  className="relative h-full overflow-hidden bg-gray-300 aspect-video lg:aspect-auto"
                  style={{ minHeight: "500px" }}
                >
                  <img
                    src="/Ziba-hero.jpg"
                    alt={`${room.name} - Main View`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Side Images */}
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-64 bg-gray-300 overflow-hidden">
                    <img
                      src="/Ziba-hero.jpg"
                      alt={`${room.name} - View ${index}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                </div>
              ))}
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

              {/* Right: Sidebar */}
              <div>
                <div className="bg-linear-to-b from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8 sticky top-20 space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 font-light mb-2">
                      Starting from
                    </p>
                    <p className="text-4xl font-light text-gray-900">
                      {room.price}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex-1 bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition font-light"
                    >
                      Book Now
                    </button>
                    <button className="flex-1 border-2 border-gray-900 text-gray-900 py-4 rounded-lg hover:bg-gray-50 transition font-light">
                      Inquiry
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Quick Info
                    </h3>
                    <div className="space-y-2 text-sm font-light text-gray-700">
                      <p>✓ Breakfast Included</p>
                      <p>✓ Free WiFi</p>
                      <p>✓ Airport Transfers Available</p>
                      <p>✓ 24/7 Concierge</p>
                      <p>✓ Free Cancellation (7 days before)</p>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-amber-50 to-white border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-light text-gray-700 leading-relaxed">
                      <strong className="font-semibold">
                        Best Price Guarantee:
                      </strong>{" "}
                      Get the best rate when you book directly with us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Rooms CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-r from-gray-900 to-gray-800">
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
              <button className="border-2 border-white text-white px-10 py-4 rounded-lg font-light hover:bg-white hover:text-gray-900 transition-all duration-300">
                Contact Our Team
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Availability Check Modal */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomId={room.id}
        roomName={room.name}
        pricePerNight={parseInt(room.price.replace(/[^0-9]/g, ""))}
        onProceedToBooking={handleBooking}
      />
    </>
  );
}
