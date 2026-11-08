"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import SectionHeading from "@/components/section-heading";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Baby,
  BedDouble,
  CalendarX,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Receipt,
  Users,
} from "lucide-react";
import { getRoomHeroImage } from "@/lib/room-images";
import { getAllRooms } from "@/lib/services/rooms";
import { IPMS_BOOKING_URL } from "@/lib/booking-links";
import { track } from "@/lib/analytics";
import {
  ROOM_CATALOG,
  ROOM_IDS,
  formatPriceFrom,
} from "@/lib/room-catalog";

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
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {policies.map((policy) => {
        const open = expandedPolicy === policy.id;
        return (
          <div key={policy.id}>
            <button
              type="button"
              onClick={() => setExpandedPolicy(open ? null : policy.id)}
              aria-expanded={open}
              aria-controls={`policy-${policy.id}`}
              className="group flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <h3 className="text-base sm:text-lg font-medium text-slate-900 group-hover:text-blue-900">
                {policy.title}
              </h3>
              <ChevronDown
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div
                id={`policy-${policy.id}`}
                className="space-y-3 pb-6 pr-10 text-sm font-light leading-relaxed text-slate-600"
              >
                {policy.content.split(/\n(?=[A-Z])/g).map((paragraph, idx) => (
                  <p key={idx}>{paragraph.trim()}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** What every room has, from the room pages on zibabeachresort.com. */
const IN_EVERY_ROOM = [
  "Air conditioning",
  "En-suite bathroom with shower",
  "Water heater",
  "Bath amenities and bathrobes",
  "Hairdryer",
  "Pool towels",
  "Room service",
  "Non-smoking rooms",
];

/** Stay facts from the Resort Policies / House Rules below. */
const STAY_FACTS = [
  { icon: Clock, title: "Check-in 3pm · check-out 12pm", text: "Valid ID or passport needed at check-in. Ask the front desk by 10am for a later check-out." },
  { icon: Receipt, title: "Room-only rates", text: "Rates are for the room. Breakfast, experiences and extras are added at extra cost, plus 7.5% VAT and 5% consumption tax." },
  { icon: Baby, title: "Children", text: "Children under 12 can't stay in the Overwater Terrace rooms, and under-10s can't stay in the Grand Overwater rooms." },
  { icon: CalendarX, title: "Cancellations", text: "Full refund less a 5% fee up to 21 days before arrival. After that, bookings can be moved once within six months." },
];

const PLAN_MORE = [
  { title: "Spend the day", text: "Day passes from 10am to 6pm, with food, drinks and activities.", href: "/day-pass", cta: "See day passes", image: "/day-experience.jpg" },
  { title: "Celebrate", text: "Build a honeymoon or birthday package and send it to us on WhatsApp.", href: "/celebrations", cta: "Build a package", image: "/honeymoon/honeymoon-2.jpg" },
  { title: "Bring a group", text: "Weddings, team bonding and retreats for 15 guests or more.", href: "/events", cta: "Plan an event", image: "/team-bonding/team-bonding-2.jpg" },
];

export default function Stay() {
  // Room facts come from the shared catalogue; the rooms table (managed in
  // the admin) overrides the "from" price and marks rooms fully booked.
  const catalogRooms = ROOM_IDS.map((roomId) => {
    const room = ROOM_CATALOG[roomId];
    return {
      roomId,
      number: room.number,
      name: room.name,
      size: room.size,
      capacity: room.capacity,
      bedding: room.bedding,
      view: room.view,
      price: formatPriceFrom(room.priceFrom),
      isFullyBooked: false,
    };
  });

  const [allRooms, setAllRooms] = useState(catalogRooms);

  useEffect(() => {
    let cancelled = false;
    getAllRooms()
      .then((dbRooms) => {
        if (cancelled) return;
        const byId = new Map(
          ((dbRooms || []) as { id: string; pricengn?: number; status?: string }[]).map((r) => [r.id, r]),
        );
        setAllRooms((rooms) =>
          rooms.map((room) => {
            const dbRoom = byId.get(room.roomId);
            if (!dbRoom) return room;
            const price = Number(dbRoom.pricengn) || ROOM_CATALOG[room.roomId].priceFrom;
            return {
              ...room,
              price: formatPriceFrom(price),
              isFullyBooked: dbRoom.status === "fully-booked",
            };
          }),
        );
      })
      .catch((error) => console.error("Error fetching rooms:", error));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero
        eyebrow="Rooms & suites"
        title="Stay by the sea"
        subtitle="Overwater lofts and studios, terrace suites, family rooms and an apartment with its own pool."
        imageUrl="/ziba-hero-images/ziba-home/ziba-grand-overwater-loft-rooms-exterior.jpg"
        imageAlt="Grand Overwater Loft rooms opening onto the pool"
      >
        <a
          href={IPMS_BOOKING_URL}
          onClick={() => track("room_book_click", { context: "rooms_hero" })}
          className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
        >
          Check availability
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </PageHero>

      <main className="bg-white">
        {/* ALL ROOMS */}
        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow={`${ROOM_IDS.length} room types`} title="Find your room">
              Every room is a short walk from the beach and pools. Live rates
              and availability are on our booking engine.
            </SectionHeading>

            <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {allRooms.map((room) => (
                <Link key={room.roomId} href={`/bookings/rooms/${room.roomId}`} className="group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                    <Image
                      src={getRoomHeroImage(room.roomId)}
                      alt={room.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                    {room.isFullyBooked && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-700">
                        Fully booked
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-700">
                    Room {room.number}
                  </p>
                  <h3 className="mt-2 font-cormorant text-[1.75rem] font-medium leading-tight text-blue-950 group-hover:text-blue-800">
                    {room.name}
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm font-light text-slate-600">
                    <li className="flex gap-2.5">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
                      <span>{room.capacity}</span>
                    </li>
                    <li className="flex gap-2.5">
                      <BedDouble className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
                      <span>{room.bedding}</span>
                    </li>
                    <li className="flex gap-2.5">
                      <Eye className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
                      <span>{room.view}</span>
                    </li>
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-200 pt-4 mt-6">
                    <p className="text-sm text-slate-900">
                      {room.price} <span className="font-light text-slate-500">/ night</span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900">
                      Details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* GOOD TO KNOW */}
        <section className="bg-[#f7f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <SectionHeading align="left" eyebrow="Good to know" title="In every room">
                The essentials, whichever room you choose. Each room&apos;s page
                lists everything it has.
              </SectionHeading>
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {IN_EVERY_ROOM.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] font-light text-slate-700">
                    <Check className="h-4 w-4 shrink-0 text-blue-800" strokeWidth={2} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <dl className="grid gap-5 sm:grid-cols-2">
              {STAY_FACTS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-3xl bg-white p-7">
                  <Icon className="h-6 w-6 text-blue-800" strokeWidth={1.5} aria-hidden="true" />
                  <dt className="mt-4 font-medium text-slate-900">{title}</dt>
                  <dd className="mt-2 text-sm font-light leading-relaxed text-slate-600">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* PLAN MORE */}
        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <SectionHeading align="left" eyebrow="Make more of it" title="Not just a room" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PLAN_MORE.map((item) => (
                <Link key={item.href} href={item.href} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <h3 className="mt-5 font-cormorant text-3xl font-medium text-blue-950">{item.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-slate-600">{item.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* POLICIES & HOUSE RULES */}
        <section id="policies" className="scroll-mt-28 bg-white px-5 pb-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20">
            <SectionHeading align="left" eyebrow="Before you book" title="Policies & house rules">
              By staying at Ziba you agree to these policies, which may be
              updated from time to time.
            </SectionHeading>
            <PoliciesSection />
          </div>
        </section>

        {/* CLOSING */}
        <section className="bg-blue-950 px-5 py-20 text-center sm:px-8 sm:py-24">
          <SectionHeading tone="light" eyebrow="Ready when you are" title="Choose your dates">
            See live rates and availability for every room.
          </SectionHeading>
          <a
            href={IPMS_BOOKING_URL}
            onClick={() => track("room_book_click", { context: "rooms_footer" })}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
          >
            Check availability
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
