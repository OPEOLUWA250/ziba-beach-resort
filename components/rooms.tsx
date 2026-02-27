"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const rooms = [
  {
    id: 1,
    name: "Beach Facing Room",
    type: "Single",
    description:
      "Intimate overwater space with direct ocean access and floor-to-ceiling views.",
    icon: "🌊",
    features: ["Ocean Access", "Ceiling Windows", "Private Deck"],
  },
  {
    id: 2,
    name: "Beach Facing Family Room",
    type: "Family",
    description:
      "Spacious room perfect for families, featuring partial or full ocean views.",
    icon: "👨‍👩‍👧‍👦",
    features: ["Family Sized", "Ocean Views", "Spacious Layout"],
  },
  {
    id: 3,
    name: "Beach Facing Connecting Room",
    type: "Group",
    description:
      "Two adjoining rooms ideal for larger groups and extended families.",
    icon: "🚪",
    features: ["2 Adjoining Rooms", "Group Friendly", "Flexible Layout"],
  },
  {
    id: 4,
    name: "Overwater Terrace Room",
    type: "Premium",
    description:
      "Exclusive terrace experience with private deck and unobstructed ocean views.",
    icon: "🏝️",
    features: ["Private Terrace", "Unobstructed Views", "Premium Access"],
  },
  {
    id: 5,
    name: "Terrace Suite",
    type: "Luxury",
    description:
      "Ultimate overwater luxury with separate living area and premium amenities.",
    icon: "✨",
    features: ["Living Area", "Premium Amenities", "Luxury Experience"],
  },
  {
    id: 6,
    name: "Ziba Black",
    type: "Exclusive",
    description:
      "Our most exclusive suite featuring premium black design and maximum privacy.",
    icon: "🖤",
    features: ["Ultra Premium", "Privacy Focused", "Exclusive Design"],
  },
  {
    id: 7,
    name: "Two Bedroom Apartment",
    type: "Residence",
    description:
      "Spacious two-bedroom home perfect for extended stays and groups seeking comfort.",
    icon: "🏠",
    features: ["2 Bedrooms", "Full Kitchen", "Living Spaces"],
  },
];

export default function Rooms() {
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
      id="rooms"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-5xl font-light text-blue-900 mb-4 text-center"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Our Rooms & Suites
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-8 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto text-center">
            Choose from our carefully curated collection of rooms, each designed
            to provide the ultimate luxury beach resort experience
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, idx) => (
            <div
              key={room.id}
              className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 flex flex-col h-full ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: isVisible ? `${300 + idx * 100}ms` : "0ms",
              }}
            >
              {/* Image Container */}
              <div
                className="relative w-full h-64 bg-cover bg-center overflow-hidden"
                style={{
                  backgroundImage: "url(/Ziba-hero.jpg)",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Room Type Badge */}
                <div className="absolute top-4 right-4 z-10 transform group-hover:scale-110 transition-transform duration-500">
                  <span className="inline-block px-4 py-1 bg-blue-900 text-white text-xs font-light rounded-full shadow-lg">
                    {room.type}
                  </span>
                </div>

                {/* Icon */}
                <div className="absolute bottom-4 left-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <div className="text-5xl">{room.icon}</div>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <h3
                  className="text-2xl font-light text-gray-900 mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {room.name}
                </h3>

                <p className="text-gray-600 font-light text-sm mb-4 flex-grow">
                  {room.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {room.features.map((feature, featureIdx) => (
                    <li
                      key={featureIdx}
                      className={`flex items-center gap-2 text-sm text-gray-700 transition-all duration-500 ${
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-5"
                      }`}
                      style={{
                        transitionDelay: isVisible
                          ? `${400 + idx * 100 + featureIdx * 50}ms`
                          : "0ms",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-light transition-all duration-500 transform hover:scale-105 shadow-md hover:shadow-lg">
                  View & Book
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
