"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white overflow-hidden">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div
            className={`space-y-4 text-center md:text-left transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="mb-6 flex justify-center md:justify-start">
              <Image
                src="/ZIBA-LOGO-WHITE.png"
                alt="Ziba Beach Resort"
                width={80}
                height={80}
                className="h-auto w-auto hover:scale-110 transition-transform duration-500"
              />
            </div>
            <p className="text-sm font-light text-blue-100 leading-relaxed">
              Experience luxury redefined at Nigeria's premier beachfront
              destination, where world-class hospitality meets pristine natural
              beauty.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-6 justify-center md:justify-start">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-125"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-125"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-125"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Our Rooms */}
          <div
            className={`text-center md:text-left transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
          >
            <h4
              className="font-light text-lg mb-6 text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Our Rooms
            </h4>
            <ul className="space-y-3 text-sm font-light text-blue-100">
              <li>
                <a
                  href="/bookings/rooms/room01"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Room
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room02"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Family Room
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room03"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Family Room (Full View)
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room04"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Connecting Room
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room05"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Suite
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room06"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Two Bedroom Apartment
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room07"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Overwater Terrace Room
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room08"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Overwater Terrace Suite
                </a>
              </li>
              <li>
                <a
                  href="/bookings/rooms/room09"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Ziba Black
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div
            className={`text-center md:text-left transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            <h4
              className="font-light text-lg mb-6 text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm font-light text-blue-100">
              <li>
                <a
                  href="/day-pass"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Day Pass
                </a>
              </li>
              <li>
                <a
                  href="/stay"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Overnight Stay
                </a>
              </li>
              <li>
                <a
                  href="/stay"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Rooms
                </a>
              </li>
              <li>
                <a
                  href="/experiences"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="/our-story"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/celebrate"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Experience
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div
            className={`text-center md:text-left transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
          >
            <h4
              className="font-light text-lg mb-6 text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Contact Us
            </h4>
            <div className="space-y-4 text-sm font-light text-blue-100">
              <div>
                <p className="text-blue-50 font-light mb-1">Location</p>
                <p>Ziba Beach Close, Okun Ajah</p>
                <p>Lagos, Nigeria</p>
              </div>
              <div>
                <p className="text-blue-50 font-light mb-2">Phone</p>
                <p>
                  <a
                    href="tel:+2347047300013"
                    className="hover:text-blue-200 transition-colors"
                  >
                    +234 704 730 0013
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+2348187444447"
                    className="hover:text-blue-200 transition-colors"
                  >
                    +234 818 744 4447
                  </a>
                </p>
              </div>
              <div>
                <p className="text-blue-50 font-light mb-1">Email</p>
                <p>
                  <a
                    href="mailto:bookings@zibabeachresort.com"
                    className="hover:text-blue-200 transition-colors"
                  >
                    bookings@zibabeachresort.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom Footer */}
        <div className="flex justify-center text-sm font-light text-blue-100">
          <p>&copy; 2026 Ziba Beach Resort - Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
