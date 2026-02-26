"use client";

import Link from "next/link";
import Image from "next/image";

export default function BookingCards() {
  return (
    <section
      id="booking-section"
      className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-light text-blue-900 mb-6"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Choose Your Experience
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Whether you're looking for a luxurious overnight escape or a day of
            exploration, we have the perfect option for you.
          </p>
        </div>

        {/* Booking Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Night Experience Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-96">
            {/* Background Image */}
            <Image
              src="/Ziba-hero.jpg"
              alt="Night Experience"
              fill
              className="object-cover"
              priority
            />

            {/* Overlay - Dark for night */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />

            {/* Content */}
            <div className="relative h-full p-10 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100/20 mb-6 backdrop-blur-sm border border-blue-100/30">
                <span className="text-2xl">🌙</span>
              </div>

              <div className="text-xs font-light text-blue-100 mb-3 tracking-widest">
                OVERNIGHT STAY
              </div>

              <h3
                className="text-3xl font-light text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Night Experience
              </h3>

              <p className="text-gray-100 font-light mb-8 leading-relaxed text-sm">
                Wake to ocean views, enjoy our world-class amenities, fine
                dining, spa services, and create lasting memories in your
                private floating sanctuary.
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {[
                  "Floating Rooms & Suites",
                  "Ocean Views",
                  "Fine Dining",
                  "Spa Access",
                  "24/7 Concierge",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-xs text-gray-100 font-light"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/stay">
                <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 font-light tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 rounded-lg">
                  Explore Night Experience
                </button>
              </Link>
            </div>
          </div>

          {/* Day Experience Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-96">
            {/* Background Image */}
            <Image
              src="/Ziba-hero.jpg"
              alt="Day Experience"
              fill
              className="object-cover"
              priority
            />

            {/* Overlay - Lighter for day */}
            <div className="absolute inset-0 bg-linear-to-t from-amber-900/70 via-amber-700/40 to-amber-600/20" />

            {/* Content */}
            <div className="relative h-full p-10 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100/20 mb-6 backdrop-blur-sm border border-amber-100/30">
                <span className="text-2xl">☀️</span>
              </div>

              <div className="text-xs font-light text-amber-100 mb-3 tracking-widest">
                DAY PASS
              </div>

              <h3
                className="text-3xl font-light text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Day Experience
              </h3>

              <p className="text-gray-100 font-light mb-8 leading-relaxed text-sm">
                Spend 8 hours (10am - 6pm) enjoying full access to all
                facilities, dining, activities, and our stunning beach views.
                Perfect for a luxurious day out.
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {[
                  "Pool & Beach Access",
                  "Restaurant & Bar",
                  "All Activities",
                  "Spa Treatments",
                  "8 Hours • 10am - 6pm",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-xs text-gray-100 font-light"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/product/day-pass/">
                <button className="w-full bg-linear-to-r from-amber-600 to-orange-600 text-white px-6 py-3 font-light tracking-wide hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 rounded-lg">
                  Explore Day Experience
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
