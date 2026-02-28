"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import {
  ChevronDown,
  CheckCircle,
  Calendar,
  Users,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useState } from "react";

const honeymoonPackages = [
  {
    id: 1,
    name: "Beach Facing Escape",
    nights: "2-night",
    room: "Beach Facing Room",
    price: "₦900,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Complimentary minibar",
    ],
  },
  {
    id: 2,
    name: "Suite Romance",
    nights: "2-night",
    room: "Beach Facing Suite",
    price: "₦1,020,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Complimentary minibar",
    ],
  },
  {
    id: 3,
    name: "Overwater Paradise",
    nights: "2-night",
    room: "Overwater Terrace Room",
    price: "₦940,000",
    featured: true,
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 4,
    name: "Overwater Luxury",
    nights: "2-night",
    room: "Overwater Terrace Suite",
    price: "₦1,070,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 5,
    name: "Extended Beach Bliss",
    nights: "4-night",
    room: "Beach Facing Room",
    price: "₦1,500,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 6,
    name: "Extended Suite Escape",
    nights: "4-night",
    room: "Beach Facing Suite",
    price: "₦1,720,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 7,
    name: "Extended Overwater",
    nights: "4-night",
    room: "Overwater Room",
    price: "₦1,760,000",
    featured: true,
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 8,
    name: "Extended Overwater Suite",
    nights: "4-night",
    room: "Overwater Suite",
    price: "₦1,940,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 9,
    name: "Ultimate Beach Romance",
    nights: "6-night",
    room: "Beach Facing Room",
    price: "₦2,100,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "Flying dress or clear kayak photo shoot",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 10,
    name: "Ultimate Luxury Suite",
    nights: "6-night",
    room: "Beach Facing Suite",
    price: "₦2,450,000",
    featured: true,
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 11,
    name: "Extended Overwater Luxury",
    nights: "4-night",
    room: "Overwater Suite",
    price: "₦2,340,000",
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
  {
    id: 12,
    name: "Premium Overwater Escape",
    nights: "6-night",
    room: "Overwater Suite",
    price: "₦2,720,000",
    featured: true,
    features: [
      "Decorated room upon arrival",
      "3 meals daily",
      "Horse riding",
      "1-hr couple massage",
      "Sunset Picnic",
      "Romantic Dinner",
      "Paint and chill",
      "Floating Breakfast",
      "Hand casting",
      "Floating Movie",
      "Complimentary minibar",
    ],
  },
];

const eventSpaces = [
  {
    name: "Conference Hall",
    capacity: "Up to 85 People",
    icon: "🎤",
    features: [
      "Training sessions & workshops",
      "Comfortable chairs and A/C",
      "High-speed internet",
      "Flipchart/whiteboard",
      "Writing materials",
      "Bottled water & candy",
    ],
    image: "/Ziba-hero.jpg",
  },
  {
    name: "Games Room",
    capacity: "Multi-purpose Space",
    icon: "🎮",
    features: [
      "Variety of games for relaxation",
      "Team bonding activities",
      "Professional instructors",
      "Casual team atmosphere",
      "Air-conditioned comfort",
      "Flexible configurations",
    ],
    image: "/Ziba-hero.jpg",
  },
];

const teamBondingActivities = [
  {
    name: "Team Bonding Games",
    desc: "Professional instructor-led activities",
    icon: "🎯",
  },
  {
    name: "Outdoor Sports",
    desc: "Volleyball, football on sports field",
    icon: "⚽",
  },
  {
    name: "Horse Riding",
    desc: "Scenic beach horse riding experience",
    icon: "🐴",
  },
  { name: "Paint & Chill", desc: "Creative team art sessions", icon: "🎨" },
  { name: "Catering", desc: "Delicious food and drinks included", icon: "🍽️" },
  {
    name: "Massage Sessions",
    desc: "Relaxation for tired team members",
    icon: "💆",
  },
];

const shootTypes = [
  {
    type: "Maternity Shoots",
    desc: "Capture motherhood's beauty",
    icon: "👶",
  },
  {
    type: "Birthday Shoots",
    desc: "Celebrate special moments",
    icon: "🎂",
  },
  {
    type: "Music Video Shoots",
    desc: "Professional music video production",
    icon: "🎬",
  },
  {
    type: "Film Productions",
    desc: "Full-scale film production services",
    icon: "🎥",
  },
];

const faqItems = [];

export default function Celebrate() {
  const [activeTab, setActiveTab] = useState<
    "all" | "2night" | "4night" | "6night"
  >("all");

  const filteredPackages = honeymoonPackages.filter((pkg) => {
    if (activeTab === "all") return true;
    if (activeTab === "2night") return pkg.nights === "2-night";
    if (activeTab === "4night") return pkg.nights === "4-night";
    if (activeTab === "6night") return pkg.nights === "6-night";
    return true;
  });

  return (
    <>
      <Header />
      <PageHero
        title="Celebrate Life's Moments"
        subtitle="From honeymoons to team bonding events, create unforgettable memories at Ziba"
        imageUrl="/ziba-hero-images/experience-hero.jpg"
      />
      <main className="bg-white">
        {/* Trust Indicators Hero */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-linear-to-r from-blue-900 via-blue-800 to-blue-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-white text-center mb-12">
              <div>
                <p className="text-4xl font-light mb-2">500+</p>
                <p className="font-light text-blue-100">Events Hosted</p>
              </div>
              <div>
                <p className="text-4xl font-light mb-2">50K+</p>
                <p className="font-light text-blue-100">Happy Guests</p>
              </div>
              <div>
                <p className="text-4xl font-light mb-2">99%</p>
                <p className="font-light text-blue-100">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-4xl font-light mb-2">5+</p>
                <p className="font-light text-blue-100">Years Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Honeymoon Gallery/Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Your Perfect Honeymoon Awaits
            </h2>
            <div className="w-16 h-0.5 mx-auto mb-12 bg-linear-to-r from-transparent via-blue-400 to-transparent" />

            {/* Image Grid Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Large featured image */}
              <div className="lg:col-span-2 lg:row-span-2 overflow-hidden rounded-2xl shadow-2xl relative h-96 lg:h-auto">
                <img
                  src="/Ziba-hero.jpg"
                  alt="Couple on beach"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Image 2 */}
              <div className="overflow-hidden rounded-2xl shadow-lg relative h-64">
                <img
                  src="/Ziba-hero.jpg"
                  alt="Romantic sunset"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Image 3 */}
              <div className="overflow-hidden rounded-2xl shadow-lg relative h-64">
                <img
                  src="/Ziba-hero.jpg"
                  alt="Luxury resort"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Image 4 */}
              <div className="overflow-hidden rounded-2xl shadow-lg relative h-64">
                <img
                  src="/Ziba-hero.jpg"
                  alt="Couple dining"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Image 5 */}
              <div className="overflow-hidden rounded-2xl shadow-lg relative h-64">
                <img
                  src="/Ziba-hero.jpg"
                  alt="Beach paradise"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Image 6 */}
              <div className="overflow-hidden rounded-2xl shadow-lg relative h-64">
                <img
                  src="/Ziba-hero.jpg"
                  alt="Romantic moment"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Gallery Description */}
            <div className="text-center text-white">
              <p className="font-light text-lg text-blue-900 mb-6">
                Create timeless memories with your loved one at Nigeria's most
                romantic beachfront destination
              </p>
              <div className="flex gap-3 justify-center text-white font-light flex-wrap">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-pink-400" /> Overwater
                  Paradise
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-pink-400" /> Romantic
                  Experiences
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-pink-400" /> Unforgettable
                  Moments
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Honeymoon Packages Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Honeymoon Packages
            </h2>
            <p className="text-center text-gray-600 font-light mb-12 max-w-2xl mx-auto">
              Start your marriage with the ultimate romantic getaway. Choose
              from our carefully curated honeymoon packages, each designed to
              create unforgettable memories.
            </p>

            {/* Duration Filter Tabs */}
            <div className="flex gap-4 justify-center mb-12 flex-wrap">
              {[
                { label: "All Packages", value: "all" as const },
                { label: "2 Nights", value: "2night" as const },
                { label: "4 Nights", value: "4night" as const },
                { label: "6 Nights", value: "6night" as const },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 font-light ${
                    activeTab === tab.value
                      ? "bg-blue-900 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Honeymoon Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                    pkg.featured
                      ? "border-2 border-blue-900 shadow-2xl transform lg:scale-105"
                      : "border border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`p-6 text-white text-center ${
                      pkg.featured ? "bg-blue-900" : "bg-blue-100"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles
                        className={`w-5 h-5 ${pkg.featured ? "text-white" : "text-blue-900"}`}
                      />
                      <p
                        className="text-sm font-light"
                        style={{ color: pkg.featured ? "white" : "#1e3a8a" }}
                      >
                        {pkg.nights}
                      </p>
                    </div>
                    <h3
                      className={`text-2xl font-light mb-1 ${
                        pkg.featured ? "text-white" : "text-blue-900"
                      }`}
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {pkg.name}
                    </h3>
                    <p
                      className={`text-sm font-light ${
                        pkg.featured ? "text-blue-100" : "text-gray-600"
                      }`}
                    >
                      {pkg.room}
                    </p>
                  </div>

                  {/* Price */}
                  <div
                    className={`px-6 py-4 text-center border-b ${
                      pkg.featured
                        ? "border-blue-100 bg-white"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <span
                      className={`text-3xl font-light ${
                        pkg.featured ? "text-blue-900" : "text-gray-900"
                      }`}
                    >
                      {pkg.price}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex-1 p-6 space-y-3">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-900 mt-1 shrink-0" />
                        <p className="text-sm text-gray-700 font-light">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 pt-0">
                    <button
                      className={`w-full py-3 rounded-lg transition font-light flex items-center justify-center gap-2 ${
                        pkg.featured
                          ? "bg-blue-900 text-white hover:bg-blue-800"
                          : "border border-blue-900 text-blue-900 hover:bg-blue-50"
                      }`}
                    >
                      Book Now
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Honeymoon Experiences Include */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 via-pink-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Honeymoon Experiences Included
            </h2>
            <p className="text-center text-gray-600 font-light mb-16 max-w-2xl mx-auto">
              Every moment is designed to celebrate your love story with
              unforgettable experiences
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Floating Breakfast",
                  desc: "Start your day in paradise with breakfast served on your private overwater terrace as the sun rises",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Beach Side Picnic",
                  desc: "A curated feast on the sand as waves kiss the shore and palm trees sway above you",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Romantic Dinner",
                  desc: "Candlelit beachfront dining under the stars with the gentle sound of the ocean as your soundtrack",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Massages",
                  desc: "Rejuvenating couple spa treatments in your private sanctuary, melting away all tension",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Horse Riding",
                  desc: "Gallop along pristine beaches at sunset on horseback, a timeless romantic adventure",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Quad Bike",
                  desc: "Feel the adrenaline as you explore scenic beach landscapes and hidden coastal gems together",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Paint & Chill",
                  desc: "Create art masterpieces together in a relaxed creative setting while sipping champagne",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Flying Dress",
                  desc: "Capture magical moments in a stunning flowing dress against breathtaking beachfront backdrops",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Floating Movie",
                  desc: "Private cinema experience on the water under the stars with gourmet refreshments",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Hand Casting",
                  desc: "Create a permanent keepsake of your joined hands, a beautiful symbol of your love",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Kite Flying",
                  desc: "Feel the ocean breeze as you soar kites together against the golden sky at day's end",
                  image: "/Ziba-hero.jpg",
                },
              ].map((exp, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container with explicit height */}
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />

                  {/* Content - Positioned at bottom */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3
                      className="text-2xl font-light mb-2 group-hover:mb-3 transition-all duration-300"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {exp.title}
                    </h3>
                    <p className="text-sm font-light text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {exp.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Spaces for Conferences & Team Bonding */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Event Spaces & Team Bonding
            </h2>
            <p className="text-center text-gray-600 font-light mb-16 max-w-2xl mx-auto">
              Perfect venues for conferences, team building, and corporate
              retreats with state-of-the-art facilities.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {eventSpaces.map((space, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={space.image}
                      alt={space.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-4xl">{space.icon}</span>
                      <div>
                        <h3
                          className="text-2xl font-light text-gray-900"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          {space.name}
                        </h3>
                        <p className="text-blue-900 font-light flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {space.capacity}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {space.features.map((feature, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-900 mt-0.5 shrink-0" />
                          <p className="text-gray-600 font-light text-sm">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-light">
                      Inquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Bonding Activities */}
            <div>
              <h3
                className="text-3xl font-light text-blue-900 mb-12 text-center"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Team Bonding Activities
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamBondingActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Image Container with explicit height */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src="/Ziba-hero.jpg"
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <h4 className="text-2xl font-light text-center mb-2">
                        {activity.name}
                      </h4>
                      <p className="text-sm font-light text-center text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {activity.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Culinary Excellence */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Culinary Excellence
            </h2>
            <p className="text-center text-gray-600 font-light mb-16 max-w-2xl mx-auto">
              Indulge in world-class dining experiences crafted by our expert
              chefs. From beachfront feasts to intimate dinners, every meal is a
              celebration
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Multi-Cuisine Restaurant",
                  desc: "International and local flavors prepared with premium ingredients",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Beachfront Bar & Lounge",
                  desc: "Signature cocktails and refreshing beverages with ocean views",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Private Dining Experiences",
                  desc: "Bespoke menus and intimate settings tailored to your preferences",
                  image: "/Ziba-hero.jpg",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container with explicit height */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-35 group-hover:bg-opacity-45 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3
                      className="text-2xl font-light mb-2 group-hover:mb-3 transition-all duration-300"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm font-light text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wellness & Relaxation */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 via-purple-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Wellness & Relaxation
            </h2>
            <p className="text-center text-gray-600 font-light mb-16 max-w-2xl mx-auto">
              Renew your mind, body, and spirit with our comprehensive wellness
              programs and spa facilities
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Full-Service Spa",
                  desc: "Luxurious treatments using natural and organic products",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Yoga & Meditation",
                  desc: "Guided sessions overlooking the ocean for inner peace",
                  image: "/Ziba-hero.jpg",
                },
                {
                  title: "Wellness Packages",
                  desc: "Holistic programs designed for healing and rejuvenation",
                  image: "/Ziba-hero.jpg",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container with explicit height */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-35 group-hover:bg-opacity-45 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3
                      className="text-2xl font-light mb-2 group-hover:mb-3 transition-all duration-300"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm font-light text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wedding Celebrations */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-12 text-center">
              <h2
                className="text-5xl font-light text-white mb-6"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Wedding Celebrations & Receptions
              </h2>
              <p className="text-blue-100 font-light mb-8 max-w-2xl mx-auto text-lg">
                Celebrate your special day with beachfront ceremonies, elegant
                receptions, and personalized touches. Our expert team handles
                every detail from venue setup to catering.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/blog/how-to-plan-beach-wedding-lagos"
                  className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-light"
                >
                  View Wedding Guide
                </a>
                <a
                  href="tel:+2347047300013"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition font-light"
                >
                  Plan Your Wedding
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Shoots Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-5xl font-light text-blue-900 mb-4 text-center"
              style={{ fontFamily: "Cormorant Garamond" }}
            >
              Professional Shoots & Content Creation
            </h2>
            <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            <p className="text-center text-gray-600 font-light mb-16 max-w-2xl mx-auto">
              Give your audience a thrill with premium content creation at our
              stunning beachfront location without leaving Nigeria.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {shootTypes.map((shoot, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-8 border border-gray-200 text-center hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                >
                  <div className="text-6xl mb-4">{shoot.icon}</div>
                  <h3 className="text-lg font-light text-gray-900 mb-2">
                    {shoot.type}
                  </h3>
                  <p className="text-gray-600 font-light text-sm">
                    {shoot.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-2">
                <div className="relative h-96">
                  <img
                    src="/Ziba-hero.jpg"
                    alt="Professional Shoots"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-12 flex flex-col justify-center">
                  <h3
                    className="text-3xl font-light text-blue-900 mb-6"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    World-Class Production Facilities
                  </h3>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Stunning beachfront and overwater locations",
                      "Professional lighting and equipment areas",
                      "On-site catering and accommodation",
                      "Flexible day rates for shoot schedules",
                      "Backup indoor spaces and gazebos",
                      "Full coordination with your production team",
                    ].map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-gray-700 font-light"
                      >
                        <CheckCircle className="w-5 h-5 text-blue-900 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:bookings@zibabeachresort.com"
                    className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-light w-fit"
                  >
                    Book Your Shoot
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-5xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready to Celebrate?
            </h2>
            <p className="text-blue-100 font-light text-lg mb-8 max-w-2xl mx-auto">
              Whether it's a honeymoon, corporate event, wedding, or
              professional shoot, our team is ready to make it unforgettable.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="tel:+2347047300013"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-light text-lg"
              >
                Call: +234 704 730 0013
              </a>
              <a
                href="mailto:bookings@zibabeachresort.com"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-900 transition font-light text-lg"
              >
                Email: bookings@zibabeachresort.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
