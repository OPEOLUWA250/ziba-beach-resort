import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { ROOM_CATALOG, formatPriceFrom } from "@/lib/room-catalog";
import { getRoomHeroImage } from "@/lib/room-images";

/** Each room shares with its own name, price and photo. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;
  const room = ROOM_CATALOG[roomId];
  if (!room) {
    return pageMetadata({
      title: "Room not found",
      description: "Rooms and suites at Ziba Beach Resort, Lagos.",
      path: "/bookings",
      noIndex: true,
    });
  }
  return pageMetadata({
    title: room.name,
    description: `${room.description} ${formatPriceFrom(room.priceFrom)} per night.`,
    path: `/bookings/rooms/${roomId}`,
    image: getRoomHeroImage(roomId),
    imageAlt: `The ${room.name} at Ziba Beach Resort`,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
