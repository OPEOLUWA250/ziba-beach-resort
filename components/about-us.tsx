"use client";

import Link from "next/link";
import { Award, MapPin, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-light text-gray-900 mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Your Gateway to Luxury
          </h2>
          <div className="w-16 h-0.5 mx-auto bg-linear-to-r from-transparent via-blue-400 to-transparent" />
        </div>

        {/* Content Paragraphs */}
        <div className="mb-16 max-w-4xl mx-auto">
          {/* First Paragraph */}
          <p className="text-lg text-gray-700 font-light leading-relaxed mb-8">
            At Ziba Beach Resort, every moment is crafted to exceed your
            expectations. From overwater rooms to day visits to bespoke
            experiences, we offer the beauty, service, and joy of a world-class
            getaway without the visa stress or long flights.
          </p>

          {/* Second Paragraph */}
          <p className="text-lg text-gray-700 font-light leading-relaxed mb-8">
            From romantic getaways to family escapes and special celebrations,
            every detail at Ziba is crafted to create memories worth keeping.
          </p>

          {/* Third Paragraph */}
          <p className="text-lg text-gray-700 font-light leading-relaxed mb-12">
            We've redefined what it means to experience true luxury in West
            Africa.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 - Award-Winning Service */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Award size={32} className="text-blue-900" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Award-Winning Service
            </h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Recognized for excellence in hospitality and guest satisfaction
            </p>
          </div>

          {/* Feature 2 - Prime Location */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <MapPin size={32} className="text-blue-900" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Prime Location
            </h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Located on Nigeria's most beautiful stretch of coastline
            </p>
          </div>

          {/* Feature 3 - Personal Concierge */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Users size={32} className="text-blue-900" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Personal Concierge
            </h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Dedicated staff to curate your perfect getaway
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/our-story">
            <button className="px-10 py-3.5 bg-blue-900 text-white font-light text-lg tracking-wide rounded-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Discover Our Story
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
