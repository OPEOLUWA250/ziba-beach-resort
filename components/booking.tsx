"use client";

import { useState } from "react";

export default function Booking() {
  const [availability, setAvailability] = useState({
    checkIn: "",
    checkOut: "",
    available: true,
  });

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-5xl font-light text-blue-900 mb-4"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          Check Availability
        </h2>
        <p className="text-gray-600 font-light mb-12 max-w-2xl">
          Real-time room availability. See exactly what's available before you
          book.
        </p>

        <div className="bg-linear-to-r from-blue-50 to-blue-100 p-12 rounded-lg border border-blue-200">
          <form className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">
                  Check In
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-light bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  onChange={(e) =>
                    setAvailability({
                      ...availability,
                      checkIn: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">
                  Check Out
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-light bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  onChange={(e) =>
                    setAvailability({
                      ...availability,
                      checkOut: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 mb-3">
                  Guests
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg font-light bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900">
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
              </div>
            </div>

            {availability.checkIn && availability.checkOut && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3">
                <div className="text-green-600">✓</div>
                <div className="font-light text-sm text-green-900">
                  Rooms available for your dates. Proceed to book now for the
                  best selection.
                </div>
              </div>
            )}

            <button
              type="button"
              className="bg-blue-900 text-white px-8 py-3 text-sm font-light tracking-wide hover:bg-blue-800 transition w-full md:w-auto"
            >
              Check Rooms
            </button>
          </form>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <div>
            <h3
              className="text-2xl font-light text-gray-900 mb-4"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Why Book Direct
            </h3>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="flex gap-3">
                <span className="text-blue-900">✓</span>
                <span>Best rates guaranteed when booking on our site</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-900">✓</span>
                <span>Real-time availability and instant confirmation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-900">✓</span>
                <span>Exclusive direct booking perks and upgrades</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-900">✓</span>
                <span>24/7 guest support and concierge service</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
            <h3
              className="text-2xl font-light text-gray-900 mb-6"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Offline Booking
            </h3>
            <p className="text-gray-600 font-light mb-6">
              Prefer to book in person? Call our reservations team for
              personalized assistance and custom packages.
            </p>
            <div>
              <p className="text-sm text-gray-600 font-light mb-2">Phone</p>
              <p className="text-lg text-blue-900 font-light mb-6">
                +234 XXX XXX XXXX
              </p>
              <p className="text-sm text-gray-600 font-light mb-2">Email</p>
              <p className="text-lg text-blue-900 font-light">
                reservations@zibabeach.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
