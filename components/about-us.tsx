"use client";

import Link from "next/link";
import { Award, MapPin, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-5xl md:text-6xl font-light text-blue-900 mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Your Gateway to Luxury
          </h2>
          <div className="w-16 h-0.5 mx-auto bg-linear-to-r from-transparent via-blue-400 to-transparent" />
        </div>

        {/* Content Paragraphs */}
        <div className="mb-16 max-w-4xl mx-auto">
          {/* First Paragraph */}
          <p
            className={`text-lg text-gray-700 font-light leading-relaxed mb-8 transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            At Ziba Beach Resort, every moment is crafted to exceed your
            expectations. From overwater rooms to day visits to bespoke
            experiences, we offer the beauty, service, and joy of a world-class
            getaway without the visa stress or long flights.
          </p>

          {/* Second Paragraph */}
          <p
            className={`text-lg text-gray-700 font-light leading-relaxed mb-8 transition-all duration-1000 ease-out delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            From romantic getaways to family escapes and special celebrations,
            every detail at Ziba is crafted to create memories worth keeping.
          </p>

          {/* Third Paragraph */}
          <p
            className={`text-lg text-gray-700 font-light leading-relaxed mb-12 transition-all duration-1000 ease-out delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            We've redefined what it means to experience true luxury in West
            Africa.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 - Award-Winning Service */}
          <div
            className={`text-center transition-all duration-1000 ease-out hover:scale-105 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-all duration-500 hover:shadow-lg">
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
          <div
            className={`text-center transition-all duration-1000 ease-out hover:scale-105 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-all duration-500 hover:shadow-lg">
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
          <div
            className={`text-center transition-all duration-1000 ease-out hover:scale-105 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "700ms" : "0ms" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-all duration-500 hover:shadow-lg">
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
