import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="mb-6">
              <Image
                src="/ZIBA-LOGO-WHITE.png"
                alt="Ziba Beach Resort"
                width={80}
                height={80}
                className="h-auto w-auto"
              />
            </div>
            <p className="text-sm font-light text-blue-100 leading-relaxed">
              Experience luxury redefined at Nigeria's premier beachfront
              destination, where world-class hospitality meets pristine natural
              beauty.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-6">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Our Rooms */}
          <div>
            <h4
              className="font-light text-lg mb-6 text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Our Rooms
            </h4>
            <ul className="space-y-3 text-sm font-light text-blue-100">
              <li>
                <a
                  href="/stay/rooms/room01"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Room
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room02"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Family Room
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room03"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Family Room (Full View)
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room04"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Connecting Room
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room05"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Beach Facing Suite
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room06"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Two Bedroom Apartment
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room07"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Overwater Terrace Room
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room08"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Overwater Terrace Suite
                </a>
              </li>
              <li>
                <a
                  href="/stay/rooms/room09"
                  className="hover:text-blue-200 transition-colors duration-300"
                >
                  Ziba Black
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
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
          <div>
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
        <div className="border-t border-gray-800 my-12" />

        {/* Bottom Footer */}
        <div className="flex justify-center text-sm font-light text-blue-100">
          <p>&copy; 2026 Ziba Beach Resort - Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
