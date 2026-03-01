"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceNGN: number;
  isActive: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  timing: string;
  note: string;
  isActive: boolean;
  items: MenuItem[];
}

type MenuProps = {};

export default function Menu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/menus");
        if (!res.ok) throw new Error("Failed to fetch menus");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error loading menus:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "Included";
    return `${amount.toLocaleString()}`;
  };

  const MenuItem = ({
    name,
    price,
    description,
  }: {
    name: string;
    price: number;
    description: string;
  }) => (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-light text-gray-900 text-lg">{name}</h4>
        <span className="text-blue-900 font-semibold ml-4 whitespace-nowrap">
          {formatCurrency(price)}
        </span>
      </div>
      <p className="text-sm text-gray-600 font-light">{description}</p>
    </div>
  );

  const MenuSection = ({
    title,
    timing,
    note,
    children,
  }: {
    title: string;
    timing: string;
    note?: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-16" style={{ animation: "fadeInUp 0.6s ease-out" }}>
      <div>
        <h2
          className="text-4xl font-light text-blue-900 mb-2"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {title}
        </h2>
        <p className="text-gray-600 font-light text-sm">{timing}</p>
        {note && (
          <p className="text-amber-700 bg-amber-50 px-4 py-3 rounded-lg mt-3 font-light text-sm border border-amber-200">
            {note}
          </p>
        )}
      </div>
      <div className="bg-linear-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 mt-6">
        {children}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* HERO SECTION */}
        <section
          className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/ziba-hero-images/menu-hero.jpg')",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/50"></div>
          <div className="relative max-w-5xl mx-auto text-center px-4 z-10">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Our Culinary Menu
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 font-light">
              Experience exquisite dining with our carefully crafted menus
            </p>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-white text-center">
              <p className="text-sm font-light mb-2">Explore More</p>
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* MENU CONTENT */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-white">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading menu...</p>
                </div>
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <MenuSection
                  key={category.id}
                  title={category.name}
                  timing={category.timing || ""}
                  note={category.note}
                >
                  {category.items && category.items.length > 0 ? (
                    category.items.map((item) => (
                      <MenuItem
                        key={item.id}
                        name={item.name}
                        price={item.priceNGN}
                        description={item.description}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center italic py-8">
                      No items available in this category
                    </p>
                  )}
                </MenuSection>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No menu categories available</p>
              </div>
            )}
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready to Dine?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 font-light mb-10">
              Reserve your table or book your stay at Ziba Beach Resort
            </p>
            <Link href="/day-pass">
              <button className="bg-linear-to-br from-white to-blue-50 text-blue-900 px-10 py-4 rounded-lg font-light hover:shadow-lg transition-all duration-300 hover:from-blue-50 hover:to-white text-lgxt-lg cursor-pointer">
                Make a Reservation
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
