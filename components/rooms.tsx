"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import { useReveal, revealClass } from "@/hooks/use-reveal";
import { getRoomHeroImage } from "@/lib/room-images";
import { ROOM_CATALOG, ROOM_IDS, formatPriceFrom } from "@/lib/room-catalog";

/** The rooms the home page leads with; the rest are one click away. */
const SIGNATURE_ROOMS = ["room10", "room11", "room08", "room06"] as const;

function roomLabel(name: string) {
  if (name.includes("Overwater")) return "Overwater";
  if (name.includes("Apartment")) return "Private pool";
  if (name.includes("Family")) return "Family";
  if (name.includes("Suite")) return "Suite";
  return "Beach facing";
}

export default function Rooms() {
  const { ref, visible } = useReveal<HTMLElement>();
  const [roomStatuses, setRoomStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/rooms")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !Array.isArray(data?.rooms)) return;
        const map: Record<string, string> = {};
        for (const room of data.rooms as { id?: string; status?: string }[]) {
          if (room?.id) map[room.id] = String(room.status || "available").toLowerCase();
        }
        setRoomStatuses(map);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section ref={ref} id="rooms" className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading align="left" eyebrow="Rooms & suites" title="Signature stays">
            Overwater lofts and studios, terrace suites and a two-bedroom
            apartment with its own pool.
          </SectionHeading>
          <Link
            href="/bookings"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-900 hover:text-blue-700"
          >
            View all {ROOM_IDS.length} rooms
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNATURE_ROOMS.map((id, i) => {
            const room = ROOM_CATALOG[id];
            const booked = roomStatuses[id] === "fully-booked";
            const guests = /^up to/i.test(room.capacity) ? room.capacity : null;
            return (
              <Link
                key={id}
                href={`/bookings/rooms/${id}`}
                className={`group block ${revealClass(visible)}`}
                style={{ transitionDelay: visible ? `${i * 90}ms` : "0ms" }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">
                  <Image
                    src={getRoomHeroImage(id)}
                    alt={room.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                  {booked && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-700">
                      Fully booked
                    </span>
                  )}
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-700">
                  {roomLabel(room.name)}
                  {guests && <span className="text-slate-400"> · {guests}</span>}
                </p>
                <h3 className="mt-2 font-cormorant text-2xl font-medium leading-snug text-blue-950 group-hover:text-blue-800">
                  {room.name}
                </h3>
                <p className="mt-2 text-sm font-light text-slate-600">
                  {formatPriceFrom(room.priceFrom)}{" "}
                  <span className="text-slate-400">/ night</span>
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
