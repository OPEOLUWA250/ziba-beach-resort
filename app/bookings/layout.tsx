import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Rooms & Suites",
  description:
    "Overwater lofts and studios, terrace suites, family rooms and a two-bedroom apartment with its own pool at Ziba Beach Resort, Lagos.",
  path: "/bookings",
  image: "/ziba-rooms/grand-overwater-loft-room/grand-overwater-loft-room-hero.jpg",
  imageAlt: "The Grand Overwater Loft Room at Ziba",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
