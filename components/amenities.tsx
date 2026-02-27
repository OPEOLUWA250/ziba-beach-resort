"use client";

import { useEffect, useRef, useState } from "react";

const amenities = [
  {
    icon: "🌊",
    name: "Ocean Facing Rooms",
    desc: "Wake to breathtaking ocean views",
  },
  { icon: "🎮", name: "Games Room", desc: "Play and unwind with family" },
  { icon: "🎬", name: "Cinema", desc: "Cinematic experiences with comfort" },
  { icon: "🏊", name: "Adult Pool", desc: "Luxury poolside lounging" },
  { icon: "👶", name: "Kids Pool", desc: "Safe family fun environment" },
  { icon: "🎪", name: "Playground", desc: "Whimsical space for children" },
  { icon: "👶‍🦱", name: "Childminding", desc: "Professional care services" },
  { icon: "💆", name: "Beachside Spa", desc: "Relaxation and wellness" },
  { icon: "🍽️", name: "Restaurant & Bar", desc: "Culinary experiences" },
  { icon: "🏃", name: "Jungle Gym", desc: "Nature-inspired activities" },
  { icon: "🔥", name: "Fire Pit", desc: "Cozy evening gatherings" },
  { icon: "📡", name: "High-Speed WiFi", desc: "Seamless connectivity" },
];

export default function Amenities() {
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
      id="amenities"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-16 text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-5xl font-light text-blue-900 mb-4 text-center"
            style={{ fontFamily: "Cormorant Garamond" }}
          >
            World-Class Amenities
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto text-center">
            Everything you need for an unforgettable stay, from premium
            facilities to thoughtful services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-lg border border-gray-100 hover:border-blue-900 hover:shadow-lg hover:scale-105 transition-all duration-500 transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: isVisible ? `${300 + idx * 75}ms` : "0ms",
              }}
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-500 inline-block hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-light text-gray-900 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
