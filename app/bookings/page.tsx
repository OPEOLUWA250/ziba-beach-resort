"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRoomHeroImage } from "@/lib/room-images";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllRooms } from "@/lib/services/rooms";

function PoliciesSection() {
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(
    "overview",
  );

  const policies = [
    {
      id: "overview",
      title: "Resort Policy Overview",
      content:
        "The following set of Policies/House Rules has been established in accordance with industry norms, our management and operational protocols, as well as our extensive experience in owning and running Ziba Beach Resort since August 2023. These Resort Policies/House Rules form an integral part of our agreement with you as a guest at our resort. These guidelines ensure the safety and serenity of our guests and establish clear mutual expectations between Ziba Beach Resort and our visitors. Our Policies may be subject to occasional updates, so we encourage you to revisit them regularly.",
    },
    {
      id: "checkIn",
      title: "Check-in & Check-out Procedures",
      content:
        "CHECK-IN: Check-in is from 3pm. Please present your ID card, Passport or Temporary Residence Card upon check-in. By Law, visitors must present personal documents for resort records. These documents will be returned. DEPARTURE: Check-out time is 12pm. Please inform reception on or before 10am if you wish to retain your room beyond this time. Late checkout fees apply from 1pm, and you will be charged the full room rate if you are still in your room after 4pm, depending on availability. CHECK-OUT PROCEDURE: Please check-out with Front Desk so housekeeping may begin cleaning your room. If you require later check-out, contact Front Desk prior to departure. A charge may apply for late check-out.",
    },
    {
      id: "rooms",
      title: "Room Rates & Room Policies",
      content:
        "ROOM RATES: The room rate is for the room only, except for all-inclusive bookings that cover meals and drinks. All room rates are exclusive of government taxes (7.5% VAT and 5% Consumption Tax). Additional services are available at extra cost. ROOM DESIGN: Ziba Beach Resort reserves the right to modify, upgrade, or alter the interior design, furnishings, or layout of any room at its discretion. However, all listed amenities and features marketed for each room category will be maintained. ROOM OCCUPANCY: Each room has an identified maximum number of occupants. We reserve the right to refuse entry where room occupancy is exceeded. CHILDREN: Children below the age of 12 years are not allowed to stay in overwater terrace rooms and suites. Parents/guardians are personally and legally responsible for supervising children at all times.",
    },
    {
      id: "belongings",
      title: "Guest Belongings & Valuables",
      content:
        "Guests are kindly advised to take full responsibility for safekeeping their personal belongings and valuables during their stay. The Management will not be held liable for any loss, theft, or damage to personal items whether in guest rooms, public areas, or any other part of the resort regardless of cause. We encourage guests to take necessary precautions and avoid leaving valuables unattended. LOST AND FOUND: Upon check-out, properly check your environs to ensure no personal items are left behind. If you discover you've left something of value, contact Front Desk immediately. Guests are responsible for pickup. Items remaining unclaimed within 2 weeks will be donated or destroyed. Perishable items, underwear, and miscellaneous toiletries are discarded.",
    },
    {
      id: "prohibited",
      title: "Prohibited Items & Hazardous Goods",
      content:
        "Bringing articles of a combustible or hazardous nature, prohibited goods, or objectionable items is strictly prohibited. Prohibited items include: gambling, contraband, prostitution, weapons, explosives, flammable objects, poisons, drugs, animals, and pungent food. The Guest shall be solely liable and responsible to the management for all loss, financial or otherwise, and damage caused by such articles. Ziba reserves the right to refuse entry to any guest found to be in possession of hazardous or prohibited goods. PETS: Ziba Beach Resort maintains a strict no-pet policy.",
    },
    {
      id: "conduct",
      title: "Smoking, Cooking & Conduct Policies",
      content:
        "SMOKING FREE: Ziba Beach Resort has been smoke-free since August 2023. Smoking is only permitted at the beachfront outside our gates. Prohibited smoking items include tobacco, marijuana, e-cigarettes, vape pens, cartridges containing nicotine, hookahs, incense, cigars, and diffusing of strong-smelling oils. There is a N100,000 fee for thorough cleaning charged to guests who smoke in bedrooms or within resort premises. Marijuana is prohibited at all times. NO-COOKING: Preparation of food in guest rooms by any cooking appliances is prohibited. Prohibited items include hot plates, toaster ovens, water heaters, rice cookers, combustible items, open flames, barbecue grills, burners, or any other cooking appliances. A minimum fee of N200,000 will be charged for cooking in a room. QUIET HOURS: Our quiet hours are 11pm to 8am. Televisions, voices, and media devices must be kept at respectful low levels. If you become aware of a disruptive guest, please contact Reception immediately.",
    },
    {
      id: "property",
      title: "Damage to Property & Liability",
      content:
        "DAMAGE TO PROPERTY: Guests will be held responsible for any loss or damage to hotel property caused by themselves, their guests, or any person for whom they are responsible. Damage to rooms, fixtures, furnishings, and equipment, including removal of electronic equipment, towels, artwork, etc., will be charged at 120% of full and new replacement value plus shipping and handling charges. DAMAGE TO MATTRESSES AND BEDDING: Damage to mattresses and linen, including towels, mattress pads, sheets, bedspreads, and blankets resulting from body oils, make-up, shoe-polish, etc., will result in a N50,000 charge for special cleaning, repair or replacement. In extreme cases, criminal charges will be pursued.",
    },
    {
      id: "safety",
      title: "Fire Safety & Emergency Procedures",
      content:
        "We have implemented a comprehensive fire prevention program that includes regular inspections, maintenance, and staff training in accordance with law. The resort is fully equipped with smoke detectors and fire alarms that are tested regularly. Fire safety information, including emergency evacuation plans, are clearly communicated and updated. If a guest's actions, intentional or accidental, result in fire due to negligence, liability will fall on the guest for starting a fire on resort premises.",
    },
    {
      id: "privacy",
      title: "Privacy, Security & Access to Rooms",
      content:
        "CCTV FOOTAGE: CCTV systems operate in the resort's communal areas for guests' and staff's personal security and to ensure high service standards. DO-NOT DISTURB: Our Housekeeping Staff will honor the 'IN' door hanger once during a twelve-hour period. At subsequent times, housekeeping must enter to clean, check for safety, and verify room condition. Management reserves the right to enter rooms for emergencies, housekeeping, maintenance, safety inspections, or to prevent policy violations. RIGHT OF ENTRY: Management reserves the right to enter rooms when necessary, including emergencies, maintenance, safety inspections, or damage assessment. Multiple staff members will be assigned as internal checks, and video recording will document the room state. All entries are conducted professionally with prior notice when possible.",
    },
    {
      id: "photography",
      title: "Photography, Videos & Guest Requests",
      content:
        "PHOTOGRAPHY AND VIDEOS: Using photographs and videos taken in the resort for commercial or public purposes is illegal. Those who do so will be subject to prosecution. REQUEST: All requests entered or sent at the time of booking are subject to availability. Ziba will try to fulfill requests but bears no responsibility. THIRD PARTY BOOKINGS: For cancellations or modifications to reservations made through sources other than directly with Ziba Beach Resort, we recommend guests contact their booking source first before approaching resort staff.",
    },
    {
      id: "cancellation",
      title: "Cancellation & Rescheduling Policies",
      content:
        "CANCELLATION: Cancellations made at least 21 days before arrival receive a full refund minus a 5% administrative fee. Cancellations less than 21 days before arrival are non-refundable but can be rescheduled. Refunds are processed within 10 working days. RESCHEDULING: With notice, bookings can be rescheduled once at no additional cost to a date within six calendar months. Day Passes require 48 hours notice; Individual Bookings require 14 days; Group Bookings require 4 weeks. If preferred dates exceed 6 months, 15% additional charge applies. If rescheduling doesn't occur within 4 months and no payment for future date, booking is forfeited. NO-SHOW: Failure to check-in on scheduled arrival for a guaranteed reservation results in a No-Show fee equal to the entire booking cost.",
    },
    {
      id: "experiences",
      title: "Experience & Activity Bookings",
      content:
        "EXPERIENCE CANCELLATION: Due to limited availability and daily quotas, we are unable to accommodate cancellations. Once booked, slots are reserved exclusively. Should unforeseen circumstances arise, we are happy to reschedule within your stay, subject to availability. Cancellations are NOT eligible for refund. We encourage careful planning to fully enjoy our unique offerings. Rescheduling must occur within your stay duration.",
    },
    {
      id: "groups",
      title: "Group Reservations & Special Bookings",
      content:
        "GROUP RESERVATIONS – OVERNIGHT: Large group/block reservations must be cancelled six (6) weeks prior to arrival. Cancellations after that date incur one (1) full night charge plus tax per room, with remaining reservations refunded. Cancellations less than four (4) weeks prior are charged full payment. GROUP RESERVATIONS – DAY VISIT: If fewer guests arrive than booked, funds can be utilized for experiences or food. Unused tickets are valid for up to three (3) months from arrival. No refunds issued. Buffet payments are final once booked; no refunds or exchanges if attendee numbers differ unless communicated before arrival. Buffet payments are non-transferable and non-refundable.",
    },
    {
      id: "peak",
      title: "Peak Season & Special Services",
      content:
        "PEAK SEASON: We operate a no cancellation/rescheduling policy during peak seasons (December 5th – January 10th, Valentine's Day, Easter, Ramadan, Summer, and all public holidays). SERVICE BOOKINGS: We operate a no-refund policy for service bookings (shoots and events). Rescheduling communicated not less than 2 weeks before the intended date is allowed. After this timeframe, payment is forfeited. Bookings can be rescheduled to a future date within six calendar months of original scheduled date.",
    },
    {
      id: "misc",
      title: "Miscellaneous Policies",
      content:
        "ADDITIONAL BEDDING: A limited number of beds and baby cribs are available upon request on a first-come, first-served basis. Maximum capacity is one (1) crib per room. For safety, pillows are not provided for cribs. RIGHT TO REFUSE SERVICE: Ziba Beach Resort is privately operated and reserves the right to refuse service to anyone for any reason(s) that do not violate Nigeria's laws. We maintain a zero-tolerance policy and will refuse admission, service, or accommodation to anyone who refuses to abide by reasonable standards and policies. Persons may be removed without refund. CHANGES TO POLICIES: Ziba Beach Resort reserves the right to amend, modify, change, cancel, vary, or add to these Resort Policies at any time without prior notice. Current policies are available on our website and from Front Desk staff upon request.",
    },
  ];

  return (
    <div className="space-y-3">
      {policies.map((policy) => (
        <div
          key={policy.id}
          className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300"
        >
          <button
            onClick={() =>
              setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)
            }
            className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors duration-300 flex justify-between items-center group"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
              {policy.title}
            </h3>
            <span
              className={`transform transition-transform duration-300 text-gray-600 ${
                expandedPolicy === policy.id ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
          {expandedPolicy === policy.id && (
            <div className="px-6 py-5 border-t border-gray-200 bg-linear-to-br from-blue-50/30 to-white text-gray-700 font-light text-sm leading-relaxed space-y-3">
              {policy.content.split(/\n(?=[A-Z])/g).map((paragraph, idx) => (
                <p key={idx}>{paragraph.trim()}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Stay() {
  // Static room configuration data
  const roomConfig = {
    room01: {
      number: "01",
      name: "Beach Facing Room",
      size: "19m²",
      capacity: "Up to 3 guests",
      bedding: "1 King size bed",
      view: "Balcony with partial pool view",
    },
    room02: {
      number: "02",
      name: "Beach Facing Family Room",
      size: "26m²",
      capacity: "Up to 6 guests",
      bedding: "1 King + 1 Bunk with pull-out",
      view: "Partial pool view",
    },
    room03: {
      number: "03",
      name: "Beach Facing Family Room",
      size: "26m²",
      capacity: "Up to 6 guests",
      bedding: "1 King + 1 Bunk with pull-out",
      view: "Full pool view",
    },
    room04: {
      number: "04",
      name: "Beach Facing Connecting Room",
      size: "32m²",
      capacity: "Up to 3 guests",
      bedding: "1 King or Twin (2 units)",
      view: "Pool view overlooking beach",
    },
    room05: {
      number: "05",
      name: "Beach Facing Suite",
      size: "Living room",
      capacity: "Up to 3 guests",
      bedding: "1 King + 1 Sofa bed",
      view: "Full view overlooking beach",
    },
    room06: {
      number: "06",
      name: "Two Bedroom Apartment",
      size: "Open Living Area",
      capacity: "Up to 6 guests",
      bedding: "2 King + 1 Sofa bed",
      view: "Private pool & ocean view",
    },
    room07: {
      number: "07",
      name: "Overwater Terrace Room",
      size: "24m²",
      capacity: "2 adults",
      bedding: "1 King size bed",
      view: "Direct water access",
    },
    room08: {
      number: "08",
      name: "Overwater Terrace Suite",
      size: "32m²",
      capacity: "Up to 3 guests",
      bedding: "1 King size bed",
      view: "Wooden deck with pool access",
    },
    room09: {
      number: "09",
      name: "Ziba Black",
      size: "19m²",
      capacity: "Up to 3 guests",
      bedding: "1 King size bed",
      view: "Pool view overlooking beach",
    },
  };

  // State for live data
  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("📍 Starting to fetch rooms from Supabase...");
        const rooms = await getAllRooms();
        console.log("📍 Fetched rooms:", rooms);

        if (!rooms || rooms.length === 0) {
          console.warn("⚠️ No rooms returned from Supabase, using fallback");
          setAllRooms([
            {
              ...roomConfig.room01,
              roomId: "room01",
              price: "from ₦202,000",
              status: "available",
            },
            {
              ...roomConfig.room02,
              roomId: "room02",
              price: "from ₦225,000",
              status: "available",
            },
            {
              ...roomConfig.room03,
              roomId: "room03",
              price: "from ₦247,500",
              status: "available",
            },
            {
              ...roomConfig.room04,
              roomId: "room04",
              price: "from ₦202,500",
              status: "available",
            },
            {
              ...roomConfig.room05,
              roomId: "room05",
              price: "from ₦231,750",
              status: "available",
            },
            {
              ...roomConfig.room06,
              roomId: "room06",
              price: "from ₦450,000",
              status: "available",
            },
            {
              ...roomConfig.room07,
              roomId: "room07",
              price: "from ₦213,750",
              status: "available",
            },
            {
              ...roomConfig.room08,
              roomId: "room08",
              price: "from ₦258,750",
              status: "available",
            },
            {
              ...roomConfig.room09,
              roomId: "room09",
              price: "from ₦202,500",
              status: "available",
            },
          ]);
          setLoading(false);
          return;
        }

        const allRoomsData = [];

        // Map Supabase data with room config
        rooms.forEach((dbRoom: any) => {
          const roomId = dbRoom.id;
          const config = roomConfig[roomId as keyof typeof roomConfig];
          console.log(`Processing room ${roomId}:`, {
            config: !!config,
            status: dbRoom.status,
            price: dbRoom.pricengan,
          });

          if (config) {
            const room = {
              roomId,
              ...config,
              price: `from ₦${(dbRoom.pricengn || 0).toLocaleString()}`,
              status: dbRoom.status,
              originalPrice: dbRoom.pricengn || 0,
              isFullyBooked: dbRoom.status === "fully-booked",
            };

            allRoomsData.push(room);
            console.log(`✓ Added room: ${roomId} (status: ${dbRoom.status})`);
          } else {
            console.warn(`⚠️ No config found for room ${roomId}`);
          }
        });

        console.log(`📊 Total rooms: ${allRoomsData.length}`);
        setAllRooms(allRoomsData);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        // Fallback to static prices if fetch fails
        const fallbackRooms = [
          { ...roomConfig.room01, roomId: "room01", price: "from ₦202,000" },
          { ...roomConfig.room02, roomId: "room02", price: "from ₦225,000" },
          { ...roomConfig.room03, roomId: "room03", price: "from ₦247,500" },
          { ...roomConfig.room04, roomId: "room04", price: "from ₦202,500" },
          { ...roomConfig.room05, roomId: "room05", price: "from ₦231,750" },
          { ...roomConfig.room06, roomId: "room06", price: "from ₦450,000" },
          { ...roomConfig.room07, roomId: "room07", price: "from ₦213,750" },
          { ...roomConfig.room08, roomId: "room08", price: "from ₦258,750" },
          { ...roomConfig.room09, roomId: "room09", price: "from ₦202,500" },
        ];
        console.log("Using fallback rooms (error occured)");
        setAllRooms(
          fallbackRooms.map((r) => ({
            ...r,
            status: "available",
            isFullyBooked: false,
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const specialPackagesMessage = `Hi Ziba Beach Resort,

I'm interested in learning more about your special packages including:
- Romantic Getaway packages
- Family Vacation packages
- Corporate Retreat packages
- Honeymoon Experience packages

Please provide details on availability, pricing, and customization options.

Thank you!`;

  return (
    <>
      <Header />
      <PageHero
        title="Your Perfect Stay Awaits"
        subtitle="World-class accommodations with premium day & night services, curated activities, and unforgettable experiences"
        imageUrl="/ziba-hero-images/bookings-hero.jpg"
      />
      <main className="bg-white">
        {/* ALL ROOMS SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-5xl font-light text-blue-900 mb-4 text-center"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Room Types & Accommodations
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Choose from our carefully curated collection of 9 premium rooms
                and suites, each designed for ultimate comfort
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">Loading rooms...</p>
                </div>
              ) : allRooms.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">
                    No rooms available at the moment.
                  </p>
                </div>
              ) : (
                allRooms.map((room) => (
                  <div
                    key={room.roomId}
                    className="group bg-white border-2 border-gray-200 rounded-2xl overflow-visible hover:border-blue-300 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={getRoomHeroImage(room.roomId)}
                        alt={room.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

                      {/* Room Number Badge */}
                      <div className="absolute top-4 left-4 bg-blue-900 text-white px-4 py-2 rounded-full font-light text-sm z-10">
                        {room.number}
                      </div>

                      {/* Fully Booked Badge */}
                      {room.isFullyBooked && (
                        <div className="absolute top-4 right-4 bg-red-600/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg z-10">
                          Fully Booked
                        </div>
                      )}
                    </div>

                    {/* Content Section - Grows to fill available space */}
                    <div className="p-6 flex flex-col flex-grow gap-4">
                      {/* Room Title */}
                      <div>
                        <h3
                          className="text-xl sm:text-2xl font-light text-gray-900 mb-2 group-hover:text-blue-900 transition-colors"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          {room.name}
                        </h3>

                        {/* Size & Capacity Tags */}
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-light border border-blue-200">
                            📐 {room.size}
                          </span>
                          <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-light border border-blue-200">
                            👥 {room.capacity}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-gradient-to-r from-blue-300 to-transparent"></div>

                      {/* Room Details */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <span className="text-gray-900 font-light text-lg">
                            🛏️
                          </span>
                          <p className="text-sm text-gray-700 font-light">
                            <span className="font-semibold text-gray-900">
                              Bed:
                            </span>{" "}
                            {room.bedding}
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-gray-900 font-light text-lg">
                            🏝️
                          </span>
                          <p className="text-sm text-gray-700 font-light">
                            <span className="font-semibold text-gray-900">
                              View:
                            </span>{" "}
                            {room.view}
                          </p>
                        </div>
                      </div>

                      {/* Spacer to push button to bottom */}
                      <div className="flex-grow"></div>

                      {/* View Room Details Button - PROMINENT CTA */}
                      <Link
                        href={`/bookings/rooms/${room.roomId}`}
                        className="w-full mt-4 py-4 px-6 rounded-lg font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg bg-blue-900 text-white hover:bg-blue-800 hover:-translate-y-1 active:translate-y-0"
                      >
                        <span className="text-base font-semibold">
                          View Room Details
                        </span>
                        <ArrowRight
                          size={20}
                          className="transition-transform duration-300"
                        />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* WHAT'S INCLUDED SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 via-white to-pink-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-5xl font-light text-blue-900 mb-4 text-center"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                What's Included In Your Stay
              </h2>
              <div className="w-16 h-0.5 mx-auto bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8">
                <h3
                  className="text-2xl font-light text-gray-900 mb-6"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Room Features
                </h3>
                <ul className="space-y-4">
                  {[
                    "Premium bedding & luxury linens",
                    "Climate control & air conditioning",
                    "Modern en-suite bathrooms",
                    "Luxury toiletries & amenities",
                    "Smart TV with streaming services",
                    "High-speed Wi-Fi throughout",
                    "24/7 Room service & concierge",
                    "Beach access & towel service",
                    "Daily housekeeping",
                    "Safe deposit box",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 font-light"
                    >
                      <span className="text-gray-900 font-semibold mt-1">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-linear-to-br from-pink-50 to-white border-2 border-pink-200 rounded-2xl p-8">
                <h3
                  className="text-2xl font-light text-gray-900 mb-6"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Complimentary Services
                </h3>
                <ul className="space-y-4">
                  {[
                    "Daily breakfast buffet included",
                    "Access to all pools & beach",
                    "Fitness center & yoga classes",
                    "WiFi & phone calls",
                    "Beach activities & water sports",
                    "Guided resort tours",
                    "Movie lounge & library access",
                    "Parking & valet service",
                    "Evening entertainment",
                    "Welcome beverage",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 font-light"
                    >
                      <span className="text-gray-900 font-semibold mt-1">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DAY PASS OPTIONS */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-amber-50 via-white to-orange-50">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-blue-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Experience Ziba Without Spending the Night
              </h2>
              <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto mb-6">
                Escape to paradise with our exclusive day pass and enjoy a full
                day of sun, sand, and serenity. Whether it's a splash in the
                pool, a stroll on the beach, picturesque pictures, ocean views
                or just the magic of time away in an absolutely serene
                environment, Ziba Beach Resort has it all. It's time to escape
                to paradise.
              </p>
              <div className="flex justify-center mb-8">
                <Link
                  href="/day-pass"
                  className="inline-block bg-linear-to-br from-blue-900 to-blue-800 text-white px-10 py-3 rounded-lg font-light hover:from-blue-800 hover:to-blue-700 transition-all duration-300 hover:shadow-lg"
                >
                  View Full Day Pass Rates →
                </Link>
              </div>
              <div className="w-24 h-1 bg-blue-900 mx-auto mt-6"></div>
            </div>

            {/* DAY PASS RATES */}
            <div className="mb-20">
              <h2
                className="text-5xl font-light text-blue-900 mb-4 text-center"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Day Pass Rates
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Ticket Only */}
                <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                  <h4
                    className="text-3xl font-light text-blue-900 mb-3"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Ticket Only
                  </h4>
                  <p className="text-gray-600 font-light mb-8">
                    Access to all our general facilities.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Adults (18+)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦20,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Teens (13–17)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦15,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Kids (3–12)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦10,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-light text-gray-900">Infant</span>
                      <span className="text-2xl font-light text-gray-900">
                        Free
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-linear-to-br from-blue-900 to-blue-800 text-white py-4 rounded-lg hover:from-blue-800 hover:to-blue-700 transition font-light"
                    onClick={() =>
                      (window.location.href = "/day-pass#regular-tickets")
                    }
                  >
                    Purchase Ticket Only
                  </button>
                </div>

                {/* Ticket Plus+ */}
                <div className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-300 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 relative">
                  <div className="absolute top-0 right-0 bg-blue-900 text-white px-4 py-2 rounded-bl-xl font-light text-sm">
                    POPULAR
                  </div>
                  <h4
                    className="text-3xl font-light text-blue-900 mb-3"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Ticket Plus+
                  </h4>
                  <p className="text-gray-600 font-light mb-8">
                    Includes one meal and a drink.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Adults (18+)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦35,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Teens (13–17)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦30,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="font-light text-gray-900">
                        Kids (3–12)
                      </span>
                      <span className="text-2xl font-light text-gray-900">
                        ₦25,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4">
                      <span className="font-light text-gray-900">Infant</span>
                      <span className="text-2xl font-light text-gray-900">
                        Free
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-light italic pt-2">
                      *Drink can be a cocktail, mocktail, soft drink, or beer.
                    </p>
                  </div>

                  <button
                    className="w-full bg-linear-to-br from-blue-900 to-blue-800 text-white py-4 rounded-lg hover:from-blue-800 hover:to-blue-700 transition font-light"
                    onClick={() =>
                      (window.location.href = "/day-pass#premium-tickets")
                    }
                  >
                    Purchase Ticket Plus+
                  </button>
                </div>
              </div>
            </div>

            {/* GROUP BOOKINGS */}
            <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-2xl p-8 sm:p-10 md:p-12 text-center">
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-4 cormorant"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Group Bookings & Celebrations
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 font-light mb-6 sm:mb-8 max-w-2xl mx-auto">
                Planning a birthday or a get-together for 15 or more guests?
                Contact us for special arrangements and exclusive group rates.
              </p>
              <a
                href="mailto:bookings@zibabeachresort.com"
                className="inline-block bg-white text-blue-900 px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-light hover:bg-blue-50 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              >
                Email Us For Group Inquiries
              </a>
            </div>
          </div>
        </section>

        {/* SPECIAL PACKAGES */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-gray-100 to-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-5xl font-light text-blue-900 mb-4 text-center"
                style={{ fontFamily: "Cormorant Garamond" }}
              >
                Special Packages
              </h2>
              <div className="w-16 h-0.5 mx-auto bg-linear-to-r from-transparent via-blue-400 to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  name: "Romantic Getaway",
                  nights: "2-3 nights",
                  price: "₦850,000",
                  includes: [
                    "Overwater Suite",
                    "Couples Spa Treatment",
                    "Romantic Dinner",
                    "Champagne & Roses",
                    "Beach Breakfast",
                    "Port Transfers",
                  ],
                },
                {
                  name: "Family Vacation",
                  nights: "3-4 nights",
                  price: "₦1,200,000",
                  includes: [
                    "Beach Facing Connecting Room",
                    "Kids Activities",
                    "Family Meals",
                    "Childminding Service",
                    "Adventure Tours",
                    "Water Sports",
                  ],
                },
                {
                  name: "Corporate Retreat",
                  nights: "2 nights",
                  price: "₦2,500,000",
                  includes: [
                    "14 Rooms",
                    "Conference Hall",
                    "Team Activities",
                    "Meals & Beverages",
                    "Entertainment",
                    "Transportation",
                  ],
                },
                {
                  name: "Honeymoon Bliss",
                  nights: "3-5 nights",
                  price: "₦1,500,000",
                  includes: [
                    "Premium Overwater Suite",
                    "Private Beach Dinner",
                    "Couples Treatments",
                    "Sunset Cruise",
                    "Photography Session",
                    "Champagne Service",
                  ],
                },
              ].map((pkg, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-gray-300 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3
                        className="text-2xl font-light text-gray-900"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-light">
                        {pkg.nights}
                      </p>
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                      {pkg.price}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm text-gray-700 font-light flex items-center gap-2"
                      >
                        <span className="text-gray-900">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-700 font-light mb-6 max-w-2xl mx-auto">
                Interested in any of these packages? Contact us on WhatsApp to
                customize your perfect getaway and discuss pricing, dates, and
                special requirements.
              </p>
              <a
                href={`https://wa.me/+2347047300013?text=${encodeURIComponent(specialPackagesMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-light hover:bg-blue-800 transition-all duration-300 hover:shadow-lg"
              >
                Inquire About Packages on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* POLICIES & HOUSE RULES SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-28 bg-linear-to-br from-blue-50 via-white to-pink-50 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                style={{ fontFamily: "Cormorant Garamond, serif" }}
                className="text-5xl font-light text-blue-900 mb-4 text-center"
              >
                Policies & House Rules
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
              <p className="text-gray-600 font-light text-base max-w-3xl mx-auto leading-relaxed">
                We are committed to delivering an exceptionally wholesome,
                secure, and welcoming beach resort experience for our valued
                guests. By registering at our resort, you acknowledge your
                consent to adhere to all Resort Policies and House Rules.
              </p>
            </div>

            <PoliciesSection />

            <div className="mt-12 bg-linear-to-br from-blue-50 to-pink-50 border-2 border-blue-200 rounded-2xl p-8">
              <p className="text-gray-700 font-light text-center leading-relaxed max-w-3xl mx-auto">
                <strong className="font-semibold">Important Notice:</strong>{" "}
                These Resort Policies/House Rules may be subject to occasional
                updates. By booking and staying at Ziba Beach Resort, you
                acknowledge your complete understanding and consent to adhere to
                all Resort Policies and House Rules, terms, conditions, and
                procedures outlined above.
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-linear-to-r from-blue-900 to-blue-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6 cormorant"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready to Plan Your Escape?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 font-light mb-8 sm:mb-10">
              Your perfect beach retreat awaits. Book now and create
              unforgettable memories at Ziba Beach Resort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/bookings"
                className="inline-block bg-white text-blue-900 px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-light hover:bg-blue-50 transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              >
                Reserve Your Room
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
