"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Cormorant_Garamond } from "next/font/google";
import { getRoomHeroImage } from "@/lib/room-images";
import { ROOM_CATALOG, ROOM_IDS } from "@/lib/room-catalog";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

function roomType(id: string, name: string) {
  if (name.includes("Overwater")) return "Overwater";
  if (name.includes("Apartment")) return "Apartment";
  if (name.includes("Family")) return "Family";
  if (name.includes("Suite")) return "Suite";
  return id === "room09" ? "Signature" : "Beach Facing";
}

const TYPE_ICONS: Record<string, string> = {
  Overwater: "🌊",
  Apartment: "🏡",
  Family: "👨‍👩‍👧‍👦",
  Suite: "✨",
  Signature: "🖤",
  "Beach Facing": "🏖️",
};

// Card content is derived from the shared room catalogue (facts from the
// resort's own room pages).
const rooms = ROOM_IDS.map((id) => {
  const room = ROOM_CATALOG[id];
  const type = roomType(id, room.name);
  return {
    id,
    name: room.name,
    type,
    description: room.description,
    icon: TYPE_ICONS[type],
    features: room.features.slice(0, 3),
  };
});

export default function Rooms() {
  const [isVisible, setIsVisible] = useState(false);
  const [roomStatuses, setRoomStatuses] = useState<Record<string, string>>({});
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

  useEffect(() => {
    const fetchRoomStatuses = async () => {
      try {
        const response = await fetch("/api/rooms");
        if (!response.ok) return;

        const data = await response.json();
        const statusMap: Record<string, string> = {};

        if (data?.rooms && Array.isArray(data.rooms)) {
          data.rooms.forEach((room: any) => {
            if (room?.id) {
              statusMap[room.id] = String(
                room.status || "available",
              ).toLowerCase();
            }
          });
        }

        setRoomStatuses(statusMap);
      } catch (error) {
        console.error("Failed to load room statuses:", error);
      }
    };

    fetchRoomStatuses();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="rooms"
      className="py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className={`${cormorant.className} h2 text-blue-900 mb-4 text-center`}
          >
            Our Rooms And Suites
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
              className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-opacity transition-transform duration-500 ease-out transform hover:-translate-y-2 flex flex-col h-full ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: isVisible ? `${300 + idx * 100}ms` : "0ms",
              }}
            >
              {/* Image Container - Enhanced with smooth zoom */}
              <div className="relative w-full h-64 overflow-hidden bg-slate-100">
                <Image
                  src={getRoomHeroImage(room.id)}
                  alt={`${room.name} - Hero Image`}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={85}
                />
                {/* Overlay with subtle brightness on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent group-hover:from-black/50 transition-all duration-500" />

                {roomStatuses[room.id] === "fully-booked" && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block px-3 py-1.5 bg-red-600 text-white text-xs font-semibold uppercase tracking-wide rounded-full shadow-lg border border-red-500">
                      Fully Booked
                    </span>
                  </div>
                )}

                {/* Room Type Badge - Smooth scale and glow */}
                <div className="absolute top-4 right-4 z-10 transition-all duration-500 ease-out group-hover:scale-105">
                  <span className="inline-block px-4 py-1 bg-blue-900 text-white text-xs font-light rounded-full shadow-lg group-hover:shadow-xl group-hover:bg-blue-800 transition-all duration-500">
                    {room.type}
                  </span>
                </div>

                {/* Icon - Playful rotation and bounce */}
                <div className="absolute bottom-4 left-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
                  <div className="text-5xl filter drop-shadow-lg">
                    {room.icon}
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col grow">
                <h5 className={`${cormorant.className} h5 text-gray-900 mb-2`}>
                  {room.name}
                </h5>

                <p className="text-gray-600 font-light text-sm mb-4 grow">
                  {room.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {room.features.map((feature, featureIdx) => (
                    <li
                      key={featureIdx}
                      className={`flex items-center gap-2 text-sm text-gray-700 transition-opacity transition-transform duration-500 ${
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

                {/* CTA Button - Prominent Action */}
                <Link
                  href={`/bookings/rooms/${room.id}`}
                  className="block w-full mt-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 text-center"
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <span>View Room Details</span>
                    <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
