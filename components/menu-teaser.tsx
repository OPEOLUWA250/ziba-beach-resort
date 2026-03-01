"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChefHat, Wine, Utensils } from "lucide-react";

export default function MenuTeaser() {
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

  const features = [
    {
      icon: ChefHat,
      title: "Culinary Excellence",
      description: "Award-winning chefs crafting exquisite dishes",
    },
    {
      icon: Wine,
      title: "Premium Selection",
      description: "Curated wines and beverages from around the world",
    },
    {
      icon: Utensils,
      title: "Fine Dining",
      description: "Elegant dining experiences with ocean views",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 py-28 bg-linear-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-5xl md:text-6xl font-light text-blue-900 mb-6"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            Culinary Delights
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Discover our exceptional menu featuring fresh seafood, international
            cuisine, and locally-inspired creations prepared by our talented
            culinary team.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <Image
                src="/ziba-hero-images/menu-hero.jpg"
                alt="Culinary Experience"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                quality={95}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent" />
            </div>
          </div>

          {/* Right - Features */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
          >
            {/* Features List */}
            <div className="space-y-8 mb-12">
              {features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`flex gap-4 transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-5"
                    }`}
                    style={{
                      transitionDelay: isVisible
                        ? `${400 + idx * 100}ms`
                        : "0ms",
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-blue-900 to-blue-800 flex items-center justify-center">
                      <IconComponent
                        size={24}
                        className="text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-blue-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <Link href="/menu">
              <button
                className={`inline-flex items-center justify-center gap-3 px-10 py-4 bg-linear-to-r from-blue-900 to-blue-800 text-white font-light tracking-wide rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl transition-all ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{
                  transitionDelay: isVisible ? "700ms" : "0ms",
                }}
              >
                Explore Our Menu
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
