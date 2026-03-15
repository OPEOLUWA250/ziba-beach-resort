"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, MoonStar, Sun } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/bookings" },
  { label: "Day Pass", href: "/day-pass" },
  { label: "Our Story", href: "/our-story" },
  { label: "Experience", href: "/experience" },
  { label: "Menu", href: "/menu" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showBookingChoiceModal, setShowBookingChoiceModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== "undefined") {
        const savedCart = localStorage.getItem("dayPassCart");
        if (savedCart) {
          try {
            const cart = JSON.parse(savedCart);
            const total = cart.items.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0,
            );
            setCartCount(total);
          } catch (err) {
            setCartCount(0);
          }
        }
      }
    };

    updateCartCount();
    // Listen for cart updates
    window.addEventListener("storage", updateCartCount);
    // Also listen for custom cart-update events
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const handleBookNow = () => {
    setShowBookingChoiceModal(true);
    setMobileMenuOpen(false);
  };

  const handleBookingChoice = (type: "night" | "day") => {
    setShowBookingChoiceModal(false);
    if (type === "night") {
      window.location.href = "https://live.ipms247.com/booking/book-rooms-zibaresort";
      return;
    }
    router.push("/day-pass");
  };

  return (
    <header
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[98%] max-w-7xl z-50 bg-white/72 backdrop-blur-3xl border border-white/55 rounded-2xl sm:rounded-3xl transition-all duration-300 ring-1 ring-slate-900/5 shadow-2xl"
      style={{
        boxShadow: `
          0 8px 24px 0 rgba(15, 23, 42, 0.16),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)
        `,
        backdropFilter: "blur(40px) saturate(180%)",
      }}
    >
      <div className="px-6 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-80 w-28 sm:w-24 md:w-28 shrink-0"
        >
          <Image
            src="/ZIBA-LOGO-WHITE.png"
            alt="ZIBA Beach Resort Logo"
            width={90}
            height={56}
            className="h-auto w-full transition-all duration-300"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(20%) sepia(85%) saturate(3500%) hue-rotate(195deg) drop-shadow(0 2px 6px rgba(30,58,138,0.28))",
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
                    ? "text-gray-900"
                    : "text-gray-900 hover:text-blue-900"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                    isActive
                      ? "w-full bg-gray-900"
                      : "w-0 group-hover:w-full bg-gray-900"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/day-pass/cart"
            className="relative p-2.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ShoppingCart
              size={20}
              className="text-gray-900 hover:text-blue-900 transition-colors"
            />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={handleBookNow}
            className="px-7 py-2.5 bg-linear-to-r from-blue-900 to-blue-800 text-white text-sm font-medium tracking-normal rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-200 hover:shadow-md"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Cart Icon and Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/day-pass/cart"
            className="relative p-2.5 rounded-lg hover:bg-slate-900/5 transition-colors"
          >
            <ShoppingCart
              size={22}
              className="text-gray-900 hover:text-blue-900 transition-colors"
            />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center drop-shadow-md">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="transition-colors duration-300 p-2 text-gray-900 hover:text-blue-900"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl rounded-b-2xl animate-slideDown">
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block font-medium text-lg transition-all py-2 hover:translate-x-2 duration-300 ${
                    isActive
                      ? "text-blue-900"
                      : "text-gray-900 hover:text-blue-900"
                  }`}
                  style={{
                    animation: `fadeInLeft 0.3s ease-out ${index * 50}ms both`,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Book Now Button */}
            <button
              onClick={handleBookNow}
              className="w-full bg-linear-to-r from-blue-900 to-blue-800 text-white px-6 py-3 font-light tracking-wide hover:from-blue-800 hover:to-blue-700 transition mt-4 rounded-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      {showBookingChoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 mt-24 sm:mt-20 lg:mt-12">
            <div className="px-6 py-5 bg-linear-to-r from-blue-900 to-blue-800 text-white">
              <h3 className="text-2xl font-light">Choose Your Experience</h3>
              <p className="text-blue-100 text-sm mt-1">
                Select the booking type you want to continue with.
              </p>
            </div>

            <div className="p-6 grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleBookingChoice("night")}
                className="group border-2 border-blue-200 rounded-xl p-5 text-center flex flex-col items-center hover:border-blue-900 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mb-3 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                  <MoonStar size={18} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Night Experience
                </h4>
                <p className="text-sm text-gray-600 font-light">
                  Rooms and overnight stays
                </p>
              </button>

              <button
                onClick={() => handleBookingChoice("day")}
                className="group border-2 border-blue-200 rounded-xl p-5 text-center flex flex-col items-center hover:border-blue-900 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mb-3 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                  <Sun size={18} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Day Experience
                </h4>
                <p className="text-sm text-gray-600 font-light">
                  Day pass and activities
                </p>
              </button>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setShowBookingChoiceModal(false)}
                className="w-full py-3 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
