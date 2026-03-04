"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import PageHero from "../../components/page-hero";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRoomHeroImage } from "../../lib/room-images";

export default function OurStory() {
  const headingFont = { fontFamily: "Cormorant Garamond, serif" };

  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(
    "overview",
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number | null>(null);

  const brandPartners = [
    {
      name: "Certification Edge",
      image: "/brands/imgi_12_certification-edge-76.png",
    },
    {
      name: "First Bank",
      image: "/brands/imgi_13_first-bank-of-nigeria-logo-finance-png.jpg",
    },
    { name: "Lingawa", image: "/brands/imgi_14_Lingawa-Logo-pdf.jpg" },
    { name: "Loft and Keys", image: "/brands/imgi_15_Loft-and-Keys-1.png" },
    { name: "Partner", image: "/brands/imgi_16_Logo.jpg" },
    {
      name: "Management Sciences",
      image: "/brands/imgi_17_Management-Sciences-for-Health-logo.png",
    },
    { name: "Mara Cruiz", image: "/brands/imgi_18_Mara-Cruiz-logo.jpg" },
    { name: "Media Crush", image: "/brands/imgi_19_media-crush-logo-1.2.png" },
    {
      name: "Nestle",
      image: "/brands/imgi_20_nestle-logo-black-and-white.png",
    },
    { name: "Nutri Milk", image: "/brands/imgi_21_Nutri-Milk-logo.jpg" },
    {
      name: "Patrick Stephens",
      image: "/brands/imgi_22_Patrick-stephens-foundation-for-widows-logo.jpg",
    },
    { name: "Seplat Energy", image: "/brands/imgi_23_seplat-energy-2.png" },
    { name: "Sharpstone", image: "/brands/imgi_24_Sharpstone-Jewelry-3.png" },
    {
      name: "TotalEnergies",
      image: "/brands/imgi_25_TotalEnergies_logo.svg.png",
    },
    {
      name: "Partner 1",
      image:
        "/brands/imgi_26_WhatsApp-Image-2025-06-24-at-11.51.40_ff1651cd.jpg",
    },
    {
      name: "Partner 2",
      image:
        "/brands/imgi_27_WhatsApp-Image-2025-06-24-at-11.52.51_aed8f25a.jpg",
    },
    {
      name: "Partner 3",
      image:
        "/brands/imgi_28_WhatsApp-Image-2025-06-24-at-11.52.51_cdaf4aaf.jpg",
    },
    {
      name: "Partner 4",
      image:
        "/brands/imgi_29_WhatsApp-Image-2025-06-24-at-11.52.52_83708f63.jpg",
    },
    {
      name: "Partner 5",
      image:
        "/brands/imgi_30_WhatsApp-Image-2025-06-24-at-11.52.52_90630137.jpg",
    },
    {
      name: "Partner 6",
      image:
        "/brands/imgi_3_WhatsApp-Image-2025-06-24-at-11.52.52_91870331.jpg",
    },
    {
      name: "Partner 7",
      image:
        "/brands/imgi_4_WhatsApp-Image-2025-06-24-at-11.52.53_8e792da5.jpg",
    },
    {
      name: "Partner 8",
      image:
        "/brands/imgi_5_WhatsApp-Image-2025-06-24-at-11.52.53_8488f83e.jpg",
    },
    { name: "Partner 9", image: "/brands/imgi_6_2025-07-01_12-59-07.jpg" },
    { name: "Partner 10", image: "/brands/imgi_7_2025-07-01_12-59-29.jpg" },
    { name: "Access Bank", image: "/brands/imgi_8_Access-bank-logo-1.png" },
    { name: "Caring Africa", image: "/brands/imgi_9_Caring-Africa-logo.jpg" },
  ];

  // Duplicate partners for seamless infinite scroll
  const scrollPartners = [...brandPartners, ...brandPartners];

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  // Auto-scroll effect with seamless loop
  useEffect(() => {
    const animate = () => {
      if (!scrollRef.current || isHovering) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const oneSetWidth = scrollWidth / 2;

      scrollRef.current.scrollLeft += 1.5;

      if (scrollRef.current.scrollLeft >= oneSetWidth - 10) {
        scrollRef.current.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering]);

  return (
    <>
      <Header />
      <PageHero
        title="Our Story"
        subtitle="Where nature's beauty meets pristine luxury."
        imageUrl="/ziba-hero-images/our-story-hero.jpg"
      />
      <main className="bg-white">
        {/* The Resort Section */}
        <section
          className="px-4 sm:px-6 lg:px-8 py-28 bg-linear-to-br from-blue-50 via-white to-pink-50 overflow-hidden"
          style={{ animation: "fadeInUp 0.8s ease-out" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                style={headingFont}
                className="h2 font-light text-blue-900 mb-4 text-center"
              >
                The Resort
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            </div>

            <div className="space-y-8 text-center text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
              <p>
                Welcome to Ziba Beach Resort, where nature's beauty is
                represented in pristine luxury with your relaxation needs in
                mind!
              </p>
              <p>
                You and your loved ones can now enjoy a stellar getaway
                experience without breaking the bank to leave the shores of
                Nigeria/Africa
              </p>
              <p>
                Situated in Okun-Mopo, Lagos Nigeria, Ziba Beach Resort is an
                all-inclusive resort entertaining adults and children likewise
                and we pride ourselves in providing exceptional services that
                will leave an unforgettable impact on the memories you seek to
                create with yourself and loved ones.
              </p>
            </div>
          </div>
        </section>

        {/* Warm Experiences Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                style={headingFont}
                className="h2 font-light text-blue-900 mb-4 text-center"
              >
                Warm Experiences
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            </div>

            <div className="space-y-8 text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
              <p>
                Our resort offers unparalleled amenities, including spacious
                guest rooms, top-notch dining options, and a wide range of
                activities to suit every taste; personal vacations, staycations,
                family vacations, baecations, brocations, siscations, retreats,
                or conferences.
              </p>
              <p>
                At Ziba Beach Resort, you are spoilt for choice as you can
                either relax and rejuvenate in our full-service spa, or take a
                dip in one of our architectural pools while taking in the
                stunning ocean view.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Room Types */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-900 via-blue-800 to-blue-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                style={headingFont}
                className="h2 font-light text-white mb-4 text-center"
              >
                Featured Room Types
              </h2>
              <div className="w-16 h-0.5 mx-auto bg-linear-to-r from-transparent via-blue-300 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { id: "room04", name: "Beach Facing Connecting Room" },
                { id: "room08", name: "Overwater Terrace Suite" },
                { id: "room03", name: "Beach Facing Family Room" },
                { id: "room05", name: "Beach Facing Suite" },
                { id: "room07", name: "Overwater Terrace Room" },
                { id: "room06", name: "Two-Bedroom Apartment" },
              ].map((room, i) => (
                <Link
                  key={i}
                  href={`/bookings/rooms/${room.id}`}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-56 sm:h-64 md:h-72 block"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={getRoomHeroImage(room.id)}
                      alt={room.name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-75 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="h6 text-white group-hover:text-pink-300 transition-colors duration-300">
                      {room.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section - With Experience Cards & Amenities Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                style={headingFont}
                className="h2 font-light text-blue-900 mb-4 text-center"
              >
                World-Class Facilities
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
                Everything you need for a perfect getaway
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  name: "Restaurant & Bar",
                  image: "/experience-ziba/restaurant&bar.jpg",
                },
                {
                  name: "FirePit",
                  image: "/experience-ziba/firepit.jpg",
                },
                {
                  name: "SPA",
                  image: "/experience-ziba/spa.jpg",
                },
                {
                  name: "Gym",
                  image: "/experience-ziba/gym.jpg",
                },
                {
                  name: "Conference Room",
                  image: "/experience-ziba/conference-room.jpg",
                },
                {
                  name: "Kids Outdoor Playground",
                  image: "/experience-ziba/kids-outdoor-playground.jpg",
                },
                {
                  name: "Cinema",
                  image: "/experience-ziba/cinema.jpg",
                },
                {
                  name: "Lagoon Pool",
                  image: "/experience-ziba/lagoon-pool.jpg",
                },
              ].map((amenity, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 h-56 flex flex-col cursor-pointer border border-gray-100 hover:border-blue-900"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-full overflow-hidden bg-gray-200">
                    <Image
                      src={amenity.image}
                      alt={amenity.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      quality={90}
                    />
                  </div>

                  {/* Name Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <h3 className="text-lg font-light text-white text-center w-full">
                      {amenity.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Bonding Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                style={headingFont}
                className="h2 text-5xl font-light text-blue-900 mb-4 text-center"
              >
                Team Bonding Experiences
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
                Create unforgettable memories with your team in elegant settings
              </p>
            </div>

            {/* Team Bonding Grid - Masonry Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {/* Large featured image - spans 2 rows */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer lg:row-span-2 h-96 md:h-full">
                <Image
                  src="/team-bonding/team-bonding-1.jpg"
                  alt="Team Bonding"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="h6 text-white">Outdoor Team Activities</h3>
                </div>
              </div>

              {/* Medium images */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72">
                <Image
                  src="/team-bonding/team-bonding-2.jpg"
                  alt="Team Bonding"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="h6 text-white">Game Activities</h3>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-72">
                <Image
                  src="/team-bonding/team-bonding-3.jpg"
                  alt="Team Bonding"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="h6 text-white">Quality food</h3>
                </div>
              </div>

              {/* Small images */}
              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-56">
                <Image
                  src="/team-bonding/team-bonding-4.jpg"
                  alt="Team Bonding"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="h6 text-white">Social Gatherings</h3>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-56">
                <Image
                  src="/team-bonding/team-bonding-5.jpg"
                  alt="Team Bonding"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="h6 text-white">Networking Events</h3>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-56">
                <Image
                  src="/team-bonding/team-bonding-6.jpg"
                  alt="Team Bonding"
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="h6 text-white">Celebrations</h3>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 font-light text-lg mb-8">
                Plan your perfect team experience with us
              </p>
              <a href="mailto:bookings@zibabeachresort.com?subject=Team%20Bonding%20Inquiry">
                <button className="bg-linear-to-r from-blue-900 to-blue-800 text-white px-8 py-3 rounded-lg font-light hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Inquire About Team Bonding
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Events & Culinary Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 via-white to-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <Image
                    src="/experience-ziba/conference-room.jpg"
                    alt="Events"
                    width={600}
                    height={300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="h4 text-blue-900 mb-4">World-Class Events</h3>
                  <p className="text-gray-700 font-light leading-relaxed mb-6">
                    Host your next meeting or event at Ziba's versatile hall,
                    comfortably accommodating up to 85 guests. The space is
                    fully equipped with projector, speakers, Wi-Fi, and beverage
                    service.
                  </p>
                  <a href="mailto:bookings@zibabeachresort.com?subject=Event%20Space%20Booking">
                    <button className="bg-linear-to-r from-blue-900 to-blue-800 text-white px-6 py-2 rounded-lg font-light hover:shadow-lg transition-all duration-300">
                      Book Event Space
                    </button>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <Image
                    src="/ziba-hero-images/menu-hero.jpg"
                    alt="Dining"
                    width={600}
                    height={300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="h4 text-blue-900 mb-4">Culinary Delight</h3>
                  <p className="text-gray-700 font-light leading-relaxed mb-6">
                    With convenient breakfast downstairs, we offer a wide
                    variety of coffees, teas, and breakfast treats. From bagels
                    and croissants to eggs and fresh hot waffles, we have the
                    fuel to start your day right.
                  </p>
                  <Link href="/menu">
                    <button className="bg-linear-to-br from-blue-900 to-blue-800 text-white px-6 py-2 rounded-lg font-light hover:shadow-lg transition-all duration-300 hover:from-blue-800 hover:to-blue-700">
                      View Menu
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Partners Carousel */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                style={headingFont}
                className="h2 text-5xl font-light text-blue-900 mb-4 text-center"
              >
                Our Brand Partners
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
                Collaborating with world-class brands to deliver exceptional
                experiences
              </p>
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Carousel Container */}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth"
                style={{
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {scrollPartners.map((partner, index) => (
                  <div
                    key={`${partner.name}-${index}`}
                    className="shrink-0 w-full sm:w-1/2 lg:w-1/3"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 h-64 flex flex-col cursor-pointer relative border border-gray-100 hover:border-blue-200">
                      {/* Logo Container */}
                      <div className="relative w-full h-full bg-linear-to-br from-gray-50 to-white flex items-center justify-center p-6 overflow-hidden">
                        <Image
                          src={partner.image}
                          alt={partner.name}
                          width={280}
                          height={200}
                          className="object-contain hover:scale-110 transition-transform duration-500 max-h-48 max-w-full"
                          quality={90}
                        />
                      </div>

                      {/* Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
                        <h3 className="text-sm font-light text-white text-center">
                          {partner.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left Arrow */}
              <button
                onClick={() => scroll("left")}
                className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition-all"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scroll("right")}
                className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 z-10 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-900 text-white hover:bg-blue-800 transition-all"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-600 font-light text-lg mb-8">
                Interested in partnering with Ziba Beach Resort?
              </p>
              <a href="mailto:bookings@zibabeachresort.com?subject=Partnership%20Inquiry">
                <button className="bg-linear-to-r from-blue-900 to-blue-800 text-white px-8 py-3 rounded-lg font-light hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Explore Partnership Opportunities
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-r from-blue-900 via-blue-800 to-blue-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              style={headingFont}
              className="h2 text-5xl font-light text-white mb-6 text-center"
            >
              Ready for Your Dream Getaway?
            </h2>
            <p className="text-xl text-blue-100 font-light mb-10">
              Experience the luxury and beauty of Ziba Beach Resort. Create
              memories that will last a lifetime.
            </p>
            <Link
              href="/bookings"
              className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-light hover:bg-blue-50 transition-all duration-300 hover:shadow-lg"
            >
              Book Your Stay
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
