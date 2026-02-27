"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import Link from "next/link";

export default function Stay() {
  const rooms = [
    {
      number: "01",
      name: "Beach Facing Room",
      size: "19m²",
      capacity: "Up to 3 guests",
      bedding: "1 King size bed",
      view: "Balcony with partial pool view",
      price: "from ₦202,000",
      roomId: "room01",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "02",
      name: "Beach Facing Family Room",
      size: "26m²",
      capacity: "Up to 6 guests",
      bedding: "1 King + 1 Bunk with pull-out",
      view: "Partial pool view",
      price: "from ₦225,000",
      roomId: "room02",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "03",
      name: "Beach Facing Family Room",
      size: "26m²",
      capacity: "Up to 6 guests",
      bedding: "1 King + 1 Bunk with pull-out",
      view: "Full pool view",
      price: "from ₦247,500",
      roomId: "room03",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "04",
      name: "Beach Facing Connecting Room",
      size: "32m²",
      capacity: "Up to 3 guests",
      bedding: "1 King or Twin (2 units)",
      view: "Pool view overlooking beach",
      price: "from ₦202,500",
      roomId: "room04",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "05",
      name: "Beach Facing Suite",
      size: "Living room",
      capacity: "Up to 3 guests",
      bedding: "1 King + 1 Sofa bed",
      view: "Full view overlooking beach",
      price: "from ₦231,750",
      roomId: "room05",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "06",
      name: "Two Bedroom Apartment",
      size: "Open Living Area",
      capacity: "Up to 6 guests",
      bedding: "2 King + 1 Sofa bed",
      view: "Private pool & ocean view",
      price: "from ₦450,000",
      roomId: "room06",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "07",
      name: "Overwater Terrace Room",
      size: "24m²",
      capacity: "2 adults",
      bedding: "1 King size bed",
      view: "Direct water access",
      price: "from ₦213,750",
      roomId: "room07",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "08",
      name: "Overwater Terrace Suite",
      size: "32m²",
      capacity: "Up to 3 guests",
      bedding: "1 King size bed",
      view: "Wooden deck with pool access",
      price: "from ₦258,750",
      roomId: "room08",
      image: "/Ziba-hero.jpg",
    },
    {
      number: "09",
      name: "Ziba Black",
      size: "19m²",
      capacity: "Up to 3 guests",
      bedding: "1 King size bed",
      view: "Pool view overlooking beach",
      price: "from ₦202,500",
      roomId: "room09",
      image: "/Ziba-hero.jpg",
    },
  ];

  return (
    <>
      <Header />
      <PageHero
        title="Your Perfect Stay Awaits"
        subtitle="World-class accommodations with premium day & night services, curated activities, and unforgettable experiences"
      />
      <main className="bg-white">
        {/* ALL ROOMS SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Room Types & Accommodations
              </h2>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Choose from our carefully curated collection of 9 premium rooms
                and suites, each designed for ultimate comfort
              </p>
              <div className="w-24 h-1 bg-blue-900 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {rooms.map((room) => (
                <Link
                  key={room.roomId}
                  href={`/bookings/rooms/${room.roomId}`}
                  className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gray-200">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-blue-900 text-white px-4 py-2 rounded-full font-light">
                      {room.number}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3
                        className="text-2xl font-light text-gray-900 mb-2 group-hover:text-gray-700 transition-colors"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {room.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-light">
                          {room.size}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-light">
                          {room.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 font-light">
                        <span className="font-semibold text-gray-900">
                          Bed:
                        </span>{" "}
                        {room.bedding}
                      </p>
                      <p className="text-sm text-gray-600 font-light">
                        <span className="font-semibold text-gray-900">
                          View:
                        </span>{" "}
                        {room.view}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-2xl font-light text-gray-900">
                        {room.price}
                      </span>
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors font-light">
                        ⟶
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 via-white to-pink-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                What's Included In Your Stay
              </h2>
              <div className="w-24 h-1 bg-blue-900 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8">
                <h3
                  className="text-2xl font-light text-gray-900 mb-6"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Room Features
                </h3>
                <ul className="space-y-4">
                  {[
                    "Premium bedding & luxury linens",
                    "Climate control & air conditioning",
                    "Modern en-suite bathrooms",
                    "Luxury toiletries & amenities",
                    "Smart TV with streaming services",
                    "High-speed Wi-Fi throughout",
                    "24/7 Room service & concierge",
                    "Beach access & towel service",
                    "Daily housekeeping",
                    "Safe deposit box",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 font-light"
                    >
                      <span className="text-gray-900 font-semibold mt-1">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-linear-to-br from-pink-50 to-white border-2 border-pink-200 rounded-2xl p-8">
                <h3
                  className="text-2xl font-light text-gray-900 mb-6"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Complimentary Services
                </h3>
                <ul className="space-y-4">
                  {[
                    "Daily breakfast buffet included",
                    "Access to all pools & beach",
                    "Fitness center & yoga classes",
                    "WiFi & phone calls",
                    "Beach activities & water sports",
                    "Guided resort tours",
                    "Movie lounge & library access",
                    "Parking & valet service",
                    "Evening entertainment",
                    "Welcome beverage",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 font-light"
                    >
                      <span className="text-gray-900 font-semibold mt-1">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DAY PASS OPTIONS */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-amber-50 via-white to-orange-50">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Experience Ziba Without Spending the Night
              </h2>
              <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto mb-6">
                Escape to paradise with our exclusive day pass and enjoy a full
                day of sun, sand, and serenity. Whether it's a splash in the
                pool, a stroll on the beach, picturesque pictures, ocean views
                or just the magic of time away in an absolutely serene
                environment, Ziba Beach Resort has it all. It's time to escape
                to paradise.
              </p>
              <div className="flex justify-center mb-8">
                <Link
                  href="/day-pass"
                  className="inline-block bg-gradient-to-br from-blue-900 to-blue-800 text-white px-10 py-3 rounded-lg font-light hover:from-blue-800 hover:to-blue-700 transition-all duration-300 hover:shadow-lg"
                >
                  View Full Day Pass Rates →
                </Link>
              </div>
              <div className="w-24 h-1 bg-blue-900 mx-auto mt-6"></div>
            </div>

            {/* DAY PASS RATES */}
            <div className="mb-20">
              <h3
                className="text-4xl font-light text-gray-900 mb-12 text-center"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Day Pass Rates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Ticket Only */}
                <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                  <h4
                    className="text-3xl font-light text-gray-900 mb-3"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Ticket Only
                  </h4>
                  <p className="text-gray-600 font-light mb-8">
                    Access to all our general facilities.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Adults (18+)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦20,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Teens (13–17)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦15,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Kids (3–12)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦10,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-light text-gray-900">Infant</span>
                      <span className="text-2xl font-light text-gray-900">
                        Free
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-br from-blue-900 to-blue-800 text-white py-4 rounded-lg hover:from-blue-800 hover:to-blue-700 transition font-light">
                    Purchase Ticket Only
                  </button>
                </div>

                {/* Ticket Plus+ */}
                <div className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-300 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 right-0 bg-blue-900 text-white px-4 py-2 rounded-bl-xl font-light text-sm">
                    POPULAR
                  </div>
                  <h4
                    className="text-3xl font-light text-gray-900 mb-3"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Ticket Plus+
                  </h4>
                  <p className="text-gray-600 font-light mb-8">
                    Includes one meal and a drink.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Adults (18+)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦35,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Teens (13–17)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦30,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Kids (3–12)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦25,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4">
                      <span className="font-light text-gray-900">Infant</span>
                      <span className="text-2xl font-light text-gray-900">
                        Free
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-light italic pt-2">
                      *Drink can be a cocktail, mocktail, soft drink, or beer.
                    </p>
                  </div>

                  <button className="w-full bg-gradient-to-br from-blue-900 to-blue-800 text-white py-4 rounded-lg hover:from-blue-800 hover:to-blue-700 transition font-light">
                    Purchase Ticket Plus+
                  </button>
                </div>
              </div>
            </div>

            {/* WHAT'S COVERED */}
            <div className="mb-20">
              <h3
                className="text-4xl font-light text-gray-900 mb-12 text-center"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                What Your Day Pass Covers
              </h3>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {[
                    { icon: "🚪", name: "Entrance" },
                    { icon: "🎬", name: "3pm Movie in Cinema" },
                    { icon: "🏊", name: "Swimming Pool" },
                    { icon: "🎪", name: "Children's Playground" },
                    { icon: "🔥", name: "Fire Pit" },
                    { icon: "🎮", name: "Games Room" },
                    { icon: "☀️", name: "Pool Cabanas" },
                    { icon: "🏖️", name: "Beachfront Access" },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-5xl mb-3">{item.icon}</div>
                      <p className="font-light text-gray-900">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* POLICIES */}
            <div className="mb-20">
              <h3
                className="text-4xl font-light text-gray-900 mb-12 text-center"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Important Policies & Guidelines
              </h3>

              <div className="bg-linear-to-br from-gray-50 to-white border-2 border-gray-300 rounded-2xl p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 font-semibold text-xl">
                        ✓
                      </span>
                      <div>
                        <p className="font-light text-gray-900">
                          No outside food & beverage allowed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 font-semibold text-xl">
                        ✓
                      </span>
                      <div>
                        <p className="font-light text-gray-900">
                          One pass required per guest
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 font-semibold text-xl">
                        ✓
                      </span>
                      <div>
                        <p className="font-light text-gray-900">
                          No pets allowed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 font-semibold text-xl">
                        ✓
                      </span>
                      <div>
                        <p className="font-light text-gray-900">
                          Only general pool access included. Overwater pool
                          excluded
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 font-semibold text-xl">
                        ✓
                      </span>
                      <div>
                        <p className="font-light text-gray-900">
                          Time Access: 10am - 6:00pm strictly. Exit by 6:30pm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 font-semibold text-xl">
                        ✓
                      </span>
                      <div>
                        <p className="font-light text-gray-900">
                          Subject to availability & blackout dates may apply
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GROUP BOOKINGS */}
            <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-2xl p-8 sm:p-10 md:p-12 text-center">
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-4 cormorant"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Group Bookings & Celebrations
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 font-light mb-6 sm:mb-8 max-w-2xl mx-auto">
                Planning a birthday or a get-together for 15 or more guests?
                Contact us for special arrangements and exclusive group rates.
              </p>
              <button className="bg-white text-blue-900 px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-light hover:bg-blue-50 transition-all duration-300 hover:shadow-lg text-sm sm:text-base">
                Email Us For Group Inquiries
              </button>
            </div>
          </div>
        </section>

        {/* SPECIAL PACKAGES */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-gray-100 to-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Special Packages
              </h2>
              <div className="w-24 h-1 bg-blue-900 mx-auto mt-6"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: "Romantic Getaway",
                  nights: "2-3 nights",
                  price: "₦850,000",
                  includes: [
                    "Overwater Suite",
                    "Couples Spa Treatment",
                    "Romantic Dinner",
                    "Champagne & Roses",
                    "Beach Breakfast",
                    "Port Transfers",
                  ],
                },
                {
                  name: "Family Vacation",
                  nights: "3-4 nights",
                  price: "₦1,200,000",
                  includes: [
                    "Beach Facing Connecting Room",
                    "Kids Activities",
                    "Family Meals",
                    "Childminding Service",
                    "Adventure Tours",
                    "Water Sports",
                  ],
                },
                {
                  name: "Corporate Retreat",
                  nights: "2 nights",
                  price: "₦2,500,000",
                  includes: [
                    "14 Rooms",
                    "Conference Hall",
                    "Team Activities",
                    "Meals & Beverages",
                    "Entertainment",
                    "Transportation",
                  ],
                },
                {
                  name: "Honeymoon Bliss",
                  nights: "3-5 nights",
                  price: "₦1,500,000",
                  includes: [
                    "Premium Overwater Suite",
                    "Private Beach Dinner",
                    "Couples Treatments",
                    "Sunset Cruise",
                    "Photography Session",
                    "Champagne Service",
                  ],
                },
              ].map((pkg, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-gray-300 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3
                        className="text-2xl font-light text-gray-900"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-light">
                        {pkg.nights}
                      </p>
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                      {pkg.price}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-8">
                    {pkg.includes.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm text-gray-700 font-light flex items-center gap-2"
                      >
                        <span className="text-gray-900">•</span> {item}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-gradient-to-br from-blue-900 to-blue-800 text-white py-3 rounded-lg hover:from-blue-800 hover:to-blue-700 transition font-light">
                    Book Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-linear-to-r from-blue-900 to-blue-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6 cormorant"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready to Plan Your Escape?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 font-light mb-8 sm:mb-10">
              Your perfect beach retreat awaits. Book now and create
              unforgettable memories at Ziba Beach Resort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/bookings/rooms"
                className="inline-block bg-white text-blue-900 px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-light hover:bg-blue-50 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              >
                Reserve Your Room
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
