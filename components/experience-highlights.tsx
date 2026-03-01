"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Users, Briefcase, Camera } from "lucide-react";

const highlights = [
  {
    id: 1,
    title: "Honeymoon Experience",
    description:
      "Create unforgettable romantic moments with our specially curated honeymoon packages. From sunset picnics to floating breakfasts and couple massages.",
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    lightGradient: "from-rose-50 to-pink-50",
  },
  {
    id: 2,
    title: "Team Bonding",
    description:
      "Strengthen relationships and boost team morale with our exclusive team bonding activities and experiences designed for corporate groups.",
    icon: Users,
    gradient: "from-blue-500 to-cyan-600",
    lightGradient: "from-blue-50 to-cyan-50",
  },
  {
    id: 3,
    title: "Conference Hall",
    description:
      "Host your corporate events, seminars, and conferences in our world-class conference facilities with full amenities and support services.",
    icon: Briefcase,
    gradient: "from-purple-500 to-indigo-600",
    lightGradient: "from-purple-50 to-indigo-50",
  },
  {
    id: 4,
    title: "Professional Photoshoot",
    description:
      "Capture your precious moments with our professional photography services. Perfect for special occasions, events, and creating lasting memories at Ziba.",
    icon: Camera,
    gradient: "from-indigo-500 to-purple-600",
    lightGradient: "from-indigo-50 to-purple-50",
  },
];

export default function ExperienceHighlights() {
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
      className="py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="h2 text-blue-900 mb-6">Celebrate Life's Moments</h2>
          <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            From romantic getaways to corporate events, Ziba offers tailored
            experiences for every occasion.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link href="/experience" key={item.id}>
                <div
                  className={`group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-gray-400 shadow-md hover:shadow-xl transition-all duration-700 transform hover:-translate-y-3 cursor-pointer h-full ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${300 + idx * 100}ms` : "0ms",
                  }}
                >
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${item.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Icon background circle */}
                  <div
                    className={`absolute top-4 right-4 w-16 h-16 rounded-full bg-linear-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative p-6 sm:p-7 h-full flex flex-col">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg bg-linear-to-br ${item.gradient} flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-light text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 font-light leading-relaxed flex-grow">
                      {item.description}
                    </p>

                    {/* Learn More Arrow */}
                    <div className="mt-4 flex items-center gap-2 text-blue-600 font-light text-sm group-hover:gap-3 transition-all">
                      Explore
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            transitionDelay: isVisible ? "600ms" : "0ms",
          }}
        >
          <Link href="/experience">
            <button className="px-10 py-4 bg-linear-to-r from-blue-900 to-blue-800 text-white font-light tracking-wide rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Explore All Experiences
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
