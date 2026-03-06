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

  const getListItemClass = (index: number) => {
    const baseDelay = 100;
    const delay = baseDelay + index * 30;
    return {
      transition: isVisible
        ? `all 0.6s ease-out ${delay}ms`
        : "all 0.6s ease-out 0ms",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(10px)",
    };
  };

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
              <a href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/ZIBA-LOGO-WHITE.png"
                  alt="Ziba Beach Resort"
                  width={80}
                  height={80}
                  className="h-auto w-auto hover:scale-110 transition-transform duration-500"
                  style={{
                    animation: isVisible ? "none" : "none",
                  }}
                />
              </a>
            </div>
            <p className="text-sm font-light text-blue-100 leading-relaxed">
              Experience luxury redefined at Nigeria's premier beachfront
              destination, where world-class hospitality meets pristine natural
              beauty.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-6 justify-center md:justify-start">
              {[
                { Icon: Facebook, delay: 0 },
                { Icon: Instagram, delay: 50 },
                { Icon: Twitter, delay: 100 },
              ].map(({ Icon, delay }, index) => (
                <a
                  key={index}
                  href="#"
                  className="relative group text-blue-200 hover:text-white transition-all duration-300 transform hover:scale-125"
                  style={{
                    animation: isVisible
                      ? `slideInUp 0.6s ease-out ${delay}ms forwards`
                      : "none",
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  <Icon size={20} />
                  <span className="absolute inset-0 rounded-full bg-blue-300 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 -z-10 scale-0 group-hover:scale-100" />
                </a>
              ))}
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
              {[
                { href: "/bookings/rooms/room01", label: "Beach Facing Room" },
                {
                  href: "/bookings/rooms/room02",
                  label: "Beach Facing Family Room",
                },
                {
                  href: "/bookings/rooms/room03",
                  label: "Beach Facing Family Room (Full View)",
                },
                {
                  href: "/bookings/rooms/room04",
                  label: "Beach Facing Connecting Room",
                },
                {
                  href: "/bookings/rooms/room05",
                  label: "Beach Facing Suite",
                },
                {
                  href: "/bookings/rooms/room06",
                  label: "Two Bedroom Apartment",
                },
                {
                  href: "/bookings/rooms/room07",
                  label: "Overwater Terrace Room",
                },
                {
                  href: "/bookings/rooms/room08",
                  label: "Overwater Terrace Suite",
                },
                { href: "/bookings/rooms/room09", label: "Ziba Black" },
              ].map((room, index) => (
                <li
                  key={index}
                  style={getListItemClass(index)}
                  className="group inline-block w-full"
                >
                  <a
                    href={room.href}
                    className="relative pb-1 inline-block text-blue-100 group-hover:text-blue-200 transition-colors duration-300"
                  >
                    {room.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-500 ease-out" />
                  </a>
                </li>
              ))}
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
              {[
                { href: "/day-pass", label: "Day Pass" },
                { href: "/stay", label: "Overnight Stay" },
                { href: "/booking", label: "Rooms" },
                { href: "/menu", label: "Menu" },
                { href: "/our-story", label: "Our Story" },
                { href: "/experience", label: "Experience" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((link, index) => (
                <li
                  key={index}
                  style={getListItemClass(index)}
                  className="group inline-block w-full"
                >
                  <a
                    href={link.href}
                    className="relative pb-1 inline-block text-blue-100 group-hover:text-blue-200 transition-colors duration-300"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-500 ease-out" />
                  </a>
                </li>
              ))}
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
              <div
                style={getListItemClass(0)}
                className="pb-4 border-b border-gray-800"
              >
                <p className="text-blue-50 font-light mb-1 transition-colors duration-300 group-hover:text-blue-200">
                  Location
                </p>
                <p>Ziba Beach Close, Okun Ajah</p>
                <p>Lagos, Nigeria</p>
              </div>
              <div
                style={getListItemClass(1)}
                className="pb-4 border-b border-gray-800"
              >
                <p className="text-blue-50 font-light mb-2">Phone</p>
                <p className="group mb-2">
                  <a
                    href="tel:+2347047300013"
                    className="relative pb-1 inline-block text-blue-100 group-hover:text-blue-200 transition-colors duration-300 hover:text-blue-300"
                  >
                    +234 704 730 0013
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-500 ease-out" />
                  </a>
                </p>
                <p className="group">
                  <a
                    href="tel:+2348187444447"
                    className="relative pb-1 inline-block text-blue-100 group-hover:text-blue-200 transition-colors duration-300 hover:text-blue-300"
                  >
                    +234 818 744 4447
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-500 ease-out" />
                  </a>
                </p>
              </div>
              <div style={getListItemClass(2)}>
                <p className="text-blue-50 font-light mb-1">Email</p>
                <p className="group">
                  <a
                    href="mailto:bookings@zibabeachresort.com"
                    className="relative pb-1 inline-block text-blue-100 group-hover:text-blue-200 transition-colors duration-300 hover:text-blue-300"
                  >
                    bookings@zibabeachresort.com
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-300 to-blue-200 group-hover:w-full transition-all duration-500 ease-out" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`border-t border-gray-800 my-8 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{ transformOrigin: "left", transitionDelay: isVisible ? "400ms" : "0ms" }}
        />

        {/* Bottom Footer */}
        <div
          className={`flex justify-center text-sm font-light text-blue-100 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}
        >
          <p>&copy; 2026 Ziba Beach Resort - Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
