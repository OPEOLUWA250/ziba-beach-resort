"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Check,
  ChevronRight,
  Eye,
  Images,
  Info,
  Maximize2,
  Users,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Lightbox from "@/components/lightbox";
import { getAllRoomImages, getRoomHeroImage } from "@/lib/room-images";
import { getRoomById } from "@/lib/services/rooms";
import {
  ROOM_CATALOG,
  ROOM_IDS,
  STAY_POLICY_HIGHLIGHTS,
  formatPriceFrom,
} from "@/lib/room-catalog";
import { IPMS_BOOKING_URL, whatsappLink } from "@/lib/booking-links";
import { track } from "@/lib/analytics";

export default function RoomDetail({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const room = ROOM_CATALOG[roomId];
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [fullyBooked, setFullyBooked] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);

  // The admin can override the "from" price and mark the room fully booked.
  useEffect(() => {
    let cancelled = false;
    getRoomById(roomId)
      .then((dbRoom) => {
        if (cancelled || !dbRoom) return;
        setLivePrice(Number(dbRoom.pricengn) || null);
        setFullyBooked(dbRoom.status === "fully-booked");
      })
      .catch((error) => console.error("Error fetching room data:", error));
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  if (!room) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center">
          <p className="font-cormorant text-4xl text-blue-950">We couldn&apos;t find that room</p>
          <Link href="/bookings" className="text-sm font-semibold text-blue-900 underline underline-offset-4">
            See all rooms
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const photos = getAllRoomImages(roomId).map((src, i) => ({
    src,
    alt: `${room.name}, photo ${i + 1}`,
  }));
  const priceLabel = formatPriceFrom(livePrice || room.priceFrom);
  const inquiryHref = whatsappLink(
    `Hello Ziba, I'm interested in the ${room.name} (${priceLabel} per night). Could you help me with availability for my dates?`,
  );
  const otherRooms = ROOM_IDS.filter((id) => id !== roomId)
    .sort((a, b) => {
      // Similar rooms first: same family (overwater / beach facing), then by number.
      const family = (id: string) => (ROOM_CATALOG[id].name.includes("Overwater") ? 1 : 0);
      const same = family(roomId);
      return Math.abs(family(a) - same) - Math.abs(family(b) - same) || a.localeCompare(b);
    })
    .slice(0, 3);

  const book = (context: string) => track("room_book_click", { context, room: room.name });

  const facts = [
    { icon: Maximize2, label: "Size", value: room.size },
    { icon: Users, label: "Guests", value: room.capacity },
    { icon: BedDouble, label: "Beds", value: room.bedding },
    { icon: Eye, label: "View", value: room.view },
  ];

  const bookingPanel = (
    <div className="space-y-6">
      <div>
        <p className="font-cormorant text-4xl font-medium text-blue-950">{priceLabel}</p>
        <p className="mt-1 text-sm font-light text-slate-500">
          per night · live rates on our booking engine
        </p>
      </div>
      {fullyBooked && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
          This room is fully booked right now. Message us for other dates or a
          similar room.
        </p>
      )}
      <div className="space-y-3">
        <a
          href={IPMS_BOOKING_URL}
          onClick={() => book("room-page")}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          Check availability
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={inquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { context: `room:${roomId}` })}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:border-blue-950"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-[#25D366]" />
          Ask about this room
        </a>
      </div>
      {room.notes?.map((note) => (
        <p key={note} className="flex gap-2.5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-light text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {note}
        </p>
      ))}
      <div className="border-t border-slate-200 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">Good to know</p>
        <ul className="mt-3 space-y-2 text-sm font-light text-slate-600">
          {STAY_POLICY_HIGHLIGHTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href="/bookings#policies" className="mt-3 inline-block text-sm font-medium text-blue-800 hover:underline">
          Full resort policies
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-24 lg:pb-0">
        {/* Title */}
        <div className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-32 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm font-light text-slate-500">
            <Link href="/bookings" className="hover:text-blue-900">
              Rooms
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-slate-800">{room.name}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-700">
                Room {room.number}
              </p>
              <h1 className="mt-2 font-cormorant text-4xl sm:text-6xl font-medium leading-[1.05] tracking-tight text-blue-950">
                {room.name}
              </h1>
            </div>
            <p className="text-sm font-light text-slate-600 sm:pb-2">
              {priceLabel} <span className="text-slate-400">/ night</span>
            </p>
          </div>
        </div>

        {/* Photo mosaic: tap any photo to open the full-screen gallery. */}
        <section className="mx-auto mt-8 max-w-7xl px-5 sm:px-8 lg:px-12" aria-label="Photos">
          <div className="relative grid h-[52svh] min-h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[60svh]">
            {photos.slice(0, 5).map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`Open photo ${i + 1} of ${photos.length}`}
                className={`group relative overflow-hidden bg-slate-100 ${
                  i === 0 ? "col-span-4 row-span-2 md:col-span-2" : "hidden md:block"
                }`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  priority={i === 0}
                  sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "25vw"}
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPhoto(0)}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-blue-950 shadow-lg transition hover:bg-white"
            >
              <Images className="h-4 w-4" aria-hidden="true" />
              All {photos.length} photos
            </button>
          </div>
        </section>

        {/* Details + booking */}
        <section className="mx-auto mt-14 grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_380px] lg:gap-20 lg:px-12">
          <div>
            <p className="text-lg sm:text-xl font-light leading-relaxed text-slate-700">{room.description}</p>

            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-y border-slate-200 py-8 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</dt>
                    <dd className="mt-1 text-[15px] text-slate-800">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <h2 className="font-cormorant text-3xl font-medium text-blue-950">What makes it special</h2>
              <ul className="mt-6 space-y-3">
                {room.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[15px] font-light text-slate-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-blue-800" strokeWidth={2} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12">
              <h2 className="font-cormorant text-3xl font-medium text-blue-950">Amenities & services</h2>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex gap-3 text-[15px] font-light text-slate-700">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-blue-800" aria-hidden="true" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-slate-200 p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
              {bookingPanel}
            </div>
          </aside>

          {/* Phones: the booking panel sits in the page, plus a bar that stays at the bottom. */}
          <div className="rounded-3xl border border-slate-200 p-6 lg:hidden">{bookingPanel}</div>
        </section>

        {/* Other rooms */}
        <section className="mx-auto mt-24 max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-cormorant text-3xl sm:text-4xl font-medium text-blue-950">You might also like</h2>
            <Link href="/bookings" className="hidden shrink-0 text-sm font-semibold text-blue-900 hover:underline sm:block">
              All rooms
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {otherRooms.map((id) => (
              <Link key={id} href={`/bookings/rooms/${id}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                  <Image
                    src={getRoomHeroImage(id)}
                    alt={ROOM_CATALOG[id].name}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="mt-4 font-cormorant text-2xl font-medium text-blue-950 group-hover:text-blue-800">
                  {ROOM_CATALOG[id].name}
                </h3>
                <p className="mt-1 text-sm font-light text-slate-600">
                  {formatPriceFrom(ROOM_CATALOG[id].priceFrom)} / night
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky booking bar on phones and tablets */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{priceLabel}</p>
          <p className="text-xs font-light text-slate-500">per night</p>
        </div>
        <a
          href={IPMS_BOOKING_URL}
          onClick={() => book("room-page-bar")}
          className="shrink-0 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Check availability
        </a>
      </div>

      {photo !== null && (
        <Lightbox
          images={photos}
          index={photo}
          onIndexChange={setPhoto}
          onClose={() => setPhoto(null)}
          title={room.name}
        />
      )}

      <Footer />
    </div>
  );
}
