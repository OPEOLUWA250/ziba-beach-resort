"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Bookings", href: "/bookings" },
  { label: "Our Story", href: "/our-story" },
  { label: "Menu", href: "/menu" },
  { label: "Experience", href: "/experience" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
      // Check if near footer (within 500px of bottom)
      setIsNearFooter(
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500,
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[98%] max-w-7xl z-50 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl sm:rounded-3xl transition-all duration-300 ring-1 ring-white/10 shadow-2xl"
      style={{
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.25),
          inset 0 2px 2px 0 rgba(255, 255, 255, 0.3),
          inset 0 -2px 2px 0 rgba(0, 0, 0, 0.02)
        `,
        backdropFilter: "blur(40px) saturate(180%)",
      }}
    >
      <div className="px-6 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-80 w-24 sm:w-24 md:w-28"
        >
          <Image
            src="/ZIBA-LOGO-WHITE.png"
            alt="ZIBA Beach Resort Logo"
            width={80}
            height={50}
            className="h-auto w-full transition-all duration-300"
            style={{
              filter: isNearFooter
                ? "brightness(1) saturate(100%)"
                : isScrolled
                  ? "brightness(0) saturate(100%) invert(15%) sepia(90%) saturate(3000%) hue-rotate(192deg)"
                  : "brightness(1) saturate(100%)",
            }}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 text-sm font-medium tracking-normal items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 transition-colors duration-200 relative group ${
                  isActive
                    ? isScrolled
                      ? "text-blue-900"
                      : "text-white"
                    : isScrolled
                      ? "text-gray-900 hover:text-gray-700"
                      : "text-white hover:text-white/70"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                    isActive
                      ? isScrolled
                        ? "w-full bg-blue-900"
                        : "w-full bg-white"
                      : `w-0 group-hover:w-full ${
                          isScrolled ? "bg-gray-900" : "bg-white"
                        }`
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <button
          onClick={scrollToBooking}
          className="hidden md:inline-block px-7 py-2.5 bg-linear-to-r from-blue-900 to-blue-800 text-white text-sm font-medium tracking-normal rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-200 hover:shadow-md"
        >
          Book Now
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden transition-colors duration-300 ${
            isNearFooter
              ? "text-white"
              : isScrolled
                ? "text-gray-900 hover:text-blue-900"
                : "text-white"
          }`}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl rounded-b-2xl">
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block font-medium text-lg transition py-2 ${
                    isActive
                      ? "text-blue-900"
                      : "text-gray-900 hover:text-blue-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Book Now Button */}
            <button
              onClick={scrollToBooking}
              className="w-full bg-linear-to-r from-blue-900 to-blue-800 text-white px-6 py-3 font-light tracking-wide hover:from-blue-800 hover:to-blue-700 transition mt-4 rounded-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
