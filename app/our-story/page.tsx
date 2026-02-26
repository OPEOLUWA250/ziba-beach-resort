"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function OurStory() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  const brands = [
    { name: "Luxury Hospitality", emoji: "🏨" },
    { name: "Premium Dining", emoji: "🍽️" },
    { name: "Spa & Wellness", emoji: "🧖" },
    { name: "Adventure Tours", emoji: "🚤" },
    { name: "Event Planning", emoji: "🎉" },
    { name: "Marina Services", emoji: "⛵" },
    { name: "Photography", emoji: "📸" },
    { name: "Concierge Services", emoji: "🎩" },
  ];

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(brands.length / itemsPerSlide);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleBrands = brands.slice(
    carouselIndex * itemsPerSlide,
    carouselIndex * itemsPerSlide + itemsPerSlide,
  );

  return (
    <>
      <Header />
      <PageHero
        title="Our Story"
        subtitle="Where nature's beauty meets pristine luxury"
      />
      <main className="bg-white">
        {/* The Resort Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 via-white to-pink-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                THE
              </h2>
              <p
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                RESORT
              </p>
              <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
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
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                WARM
              </h2>
              <p
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                EXPERIENCES
              </p>
              <div className="w-24 h-1 bg-gray-900 mx-auto mt-6"></div>
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
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3
                className="text-5xl font-light text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Featured Room Types
              </h3>
              <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                "Beach Facing Connecting Room",
                "Overwater Terrace Suite",
                "Beach Facing Family Room",
                "Beach Facing Suite",
                "Overwater Terrace Room",
                "Beachfront Deluxe Suite",
              ].map((room, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-56 sm:h-64 md:h-72"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src="/Ziba-hero.jpg"
                      alt={room}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-75 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3
                      className="text-2xl font-light text-white group-hover:text-pink-300 transition-colors duration-300"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {room}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                World-Class Facilities
              </h2>
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
                Everything you need for a perfect getaway
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: "🌊",
                  title: "Ocean Facing Rooms",
                  desc: "Wake up to breathtaking views of the ocean.",
                },
                {
                  icon: "🎮",
                  title: "Games Room",
                  desc: "Play and unwind in our dedicated games room.",
                },
                {
                  icon: "🎬",
                  title: "Cinema",
                  desc: "Indulge in cinematic experiences with comfort and style.",
                },
                {
                  icon: "🏊",
                  title: "Adult Pool",
                  desc: "Luxury poolside lounging with cocktails and more.",
                },
                {
                  icon: "👶",
                  title: "Children Pool",
                  desc: "Family fun with your kids swimming and more.",
                },
                {
                  icon: "🎪",
                  title: "Children Playground",
                  desc: "Safe, whimsical place for your children to have fun.",
                },
                {
                  icon: "👶",
                  title: "Childminding",
                  desc: "Professional care for your little ones.",
                },
                {
                  icon: "📶",
                  title: "High-speed Wi-Fi",
                  desc: "Seamless high-speed internet throughout your stay.",
                },
                {
                  icon: "🍽️",
                  title: "Restaurant & Bar",
                  desc: "Savor delectable cuisine and crafted cocktails.",
                },
                {
                  icon: "🧗",
                  title: "Outdoor Jungle Gym",
                  desc: "Nature-inspired fun at our outdoor jungle gym.",
                },
                {
                  icon: "🔥",
                  title: "Fire Pit",
                  desc: "Gather around the fire pit for cozy evenings.",
                },
              ].map((facility, i) => (
                <div
                  key={i}
                  className="bg-linear-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {facility.icon}
                  </div>
                  <h3
                    className="text-xl font-light text-gray-900 mb-3 group-hover:text-blue-900 transition-colors duration-300"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 font-light">{facility.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events & Culinary Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-blue-50 via-white to-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/Ziba-hero.jpg"
                    alt="Events"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3
                    className="text-3xl font-light text-gray-900 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    World-Class Events
                  </h3>
                  <p className="text-gray-700 font-light leading-relaxed mb-6">
                    Host your next meeting or event at Ziba's versatile hall,
                    comfortably accommodating up to 85 guests. The space is
                    fully equipped with projector, speakers, Wi-Fi, and beverage
                    service.
                  </p>
                  <button className="bg-linear-to-r from-blue-900 to-blue-800 text-white px-6 py-2 rounded-lg font-light hover:shadow-lg transition-all duration-300">
                    Book Event Space
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/Ziba-hero.jpg"
                    alt="Dining"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3
                    className="text-3xl font-light text-gray-900 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Culinary Delight
                  </h3>
                  <p className="text-gray-700 font-light leading-relaxed mb-6">
                    With convenient breakfast downstairs, we offer a wide
                    variety of coffees, teas, and breakfast treats. From bagels
                    and croissants to eggs and fresh hot waffles, we have the
                    fuel to start your day right.
                  </p>
                  <button className="bg-linear-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-lg font-light hover:shadow-lg transition-all duration-300">
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Partners Carousel */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Our Brand Partners
              </h2>
              <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
                Collaborating with world-class brands to deliver exceptional
                experiences
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {visibleBrands.map((partner, i) => (
                  <div
                    key={i}
                    className="bg-linear-to-br from-blue-50 to-pink-50 border-2 border-blue-100 rounded-2xl p-8 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {partner.emoji}
                    </div>
                    <h3
                      className="text-xl font-light text-gray-900 group-hover:text-blue-900 transition-colors duration-300"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {partner.name}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-8 mt-12">
                <button
                  onClick={prevSlide}
                  className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={
                        i === carouselIndex
                          ? "h-3 bg-blue-900 w-8 rounded-full transition-all duration-300"
                          : "h-3 bg-gray-300 w-3 rounded-full hover:bg-gray-400 transition-all duration-300"
                      }
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-600 font-light text-lg mb-8">
                Interested in partnering with Ziba Beach Resort?
              </p>
              <button className="bg-linear-to-r from-blue-900 to-blue-800 text-white px-8 py-3 rounded-lg font-light hover:shadow-lg hover:scale-105 transition-all duration-300">
                Explore Partnership Opportunities
              </button>
            </div>
          </div>
        </section>

        {/* Policies Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-gray-900 mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Policies & House Rules
              </h2>
              <p className="text-gray-600 font-light text-base max-w-3xl mx-auto leading-relaxed">
                We are committed to delivering an exceptionally wholesome,
                secure, and welcoming beach resort experience for our valued
                guests. By registering at our resort, you acknowledge your
                consent to adhere to all Resort Policies and House Rules.
              </p>
            </div>

            <div className="space-y-3">
              {[
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
              ].map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300"
                >
                  <button
                    onClick={() =>
                      setExpandedPolicy(
                        expandedPolicy === policy.id ? null : policy.id,
                      )
                    }
                    className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors duration-300 flex justify-between items-center group"
                  >
                    <h3
                      className="text-lg font-light text-gray-900 group-hover:text-blue-900 transition-colors duration-300"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
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
                      {policy.content
                        .split(/\n(?=[A-Z])/g)
                        .map((paragraph, idx) => (
                          <p key={idx}>{paragraph.trim()}</p>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

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

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-linear-to-r from-blue-900 via-blue-800 to-blue-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-5xl font-light text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ready for Your Dream Getaway?
            </h2>
            <p className="text-xl text-blue-100 font-light mb-10">
              Experience the luxury and beauty of Ziba Beach Resort. Create
              memories that will last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-light hover:bg-blue-50 transition-all duration-300 hover:shadow-lg">
                Book Your Stay
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-light hover:bg-white hover:text-blue-900 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
