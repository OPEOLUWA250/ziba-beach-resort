import { ROOM_CATALOG, ROOM_IDS } from "@/lib/room-catalog";
import { getAllRoomImages } from "@/lib/room-images";

export type GalleryCategory = "Resort" | "Rooms" | "Experiences" | "Celebrations";

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: GalleryCategory;
}

const resort: GalleryPhoto[] = [
  { src: "/ziba-hero-images/ziba-home/ziba-grand-overwater-villa.jpg", alt: "The Grand Overwater Villa from the air" },
  { src: "/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-villa.jpg", alt: "The Grand Overwater Villa beside the ocean" },
  { src: "/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-pool.jpg", alt: "The Grand Overwater pool" },
  { src: "/ziba-hero-images/ziba-home/ziba-aerial-view-phase-2-grand-overwater-villa.jpg", alt: "Ziba Beach Resort from the air" },
  { src: "/ziba-hero-images/ziba-home/ziba-grand-overwater-loft-rooms-exterior.jpg", alt: "Grand Overwater Loft rooms opening onto the pool" },
  { src: "/experience-ziba/lagoon-pool.jpg", alt: "The lagoon pool" },
  { src: "/experience-ziba/adult-kids-pool.jpg", alt: "The adult and kids' pool" },
  { src: "/experience-ziba/restaurant&bar.jpg", alt: "The restaurant and bar" },
  { src: "/experience-ziba/firepit.jpg", alt: "The firepit" },
  { src: "/experience-ziba/spa.jpg", alt: "The spa" },
  { src: "/experience-ziba/cinema.jpg", alt: "The cinema" },
  { src: "/experience-ziba/indoor-games.jpg", alt: "The games room" },
  { src: "/experience-ziba/ziba-kids-club.jpg", alt: "Ziba Kids' Club" },
  { src: "/experience-ziba/kids-outdoor-playground.jpg", alt: "The kids' playground" },
  { src: "/experience-ziba/gym.jpg", alt: "The gym" },
  { src: "/experience-ziba/conference-room.jpg", alt: "The conference room" },
  { src: "/day-experience.jpg", alt: "The beach at Ziba" },
].map((p) => ({ ...p, category: "Resort" as const }));

// Each room's main photo plus its first two gallery photos.
const rooms: GalleryPhoto[] = ROOM_IDS.flatMap((id) =>
  getAllRoomImages(id)
    .slice(0, 3)
    .map((src, i) => ({
      src,
      alt: i === 0 ? ROOM_CATALOG[id].name : `${ROOM_CATALOG[id].name}, another view`,
      category: "Rooms" as const,
    })),
);

const experiences: GalleryPhoto[] = [
  { src: "/experience-ziba/floating-breakfast.jpg", alt: "A floating breakfast" },
  { src: "/experience-ziba/beach-side-picnic.jpg", alt: "A picnic on the beach" },
  { src: "/experience-ziba/romantic-dinner.jpg", alt: "A romantic dinner by the sea" },
  { src: "/experience-ziba/family-beach-dining.jpg", alt: "A family dinner on the beach" },
  { src: "/experience-ziba/horse-riding.jpg", alt: "Horse riding on the beach" },
  { src: "/experience-ziba/quad-bike.jpg", alt: "Quad biking" },
  { src: "/experience-ziba/paint-and-chill.jpg", alt: "Paint 'n' chill" },
  { src: "/experience-ziba/paint-and-chill-pool.jpg", alt: "Paint 'n' chill in the pool" },
  { src: "/experience-ziba/floating-movie.jpg", alt: "A floating movie" },
  { src: "/experience-ziba/flying-dress.jpg", alt: "A flying dress photo shoot" },
  { src: "/experience-ziba/handcasting.jpg", alt: "Hand casting" },
  { src: "/experience-ziba/kite-flying.jpg", alt: "Kite flying" },
  { src: "/experience-ziba/massages.jpg", alt: "A massage at the spa" },
].map((p) => ({ ...p, category: "Experiences" as const }));

const celebrations: GalleryPhoto[] = [
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ src: `/honeymoon/honeymoon-${n}.jpg`, alt: "A celebration at Ziba" })),
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ src: `/team-bonding/team-bonding-${n}.jpg`, alt: "Team bonding at Ziba" })),
].map((p) => ({ ...p, category: "Celebrations" as const }));

export const GALLERY_CATEGORIES: GalleryCategory[] = ["Resort", "Rooms", "Experiences", "Celebrations"];

/** Mixed so the "All" view doesn't start with a block of one kind. */
export const GALLERY_PHOTOS: GalleryPhoto[] = (() => {
  const lists = [resort, rooms, experiences, celebrations].map((l) => [...l]);
  const mixed: GalleryPhoto[] = [];
  while (lists.some((l) => l.length)) {
    for (const l of lists) {
      const next = l.shift();
      if (next) mixed.push(next);
    }
  }
  return mixed;
})();
