import type { MetadataRoute } from "next";
import { ROOM_IDS } from "@/lib/room-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://zibabeachresort.com";
  const now = new Date();

  const publicRoutes = [
    "",
    "/bookings",
    "/day-pass",
    "/experience",
    "/menu",
    "/our-story",
    "/blog",
    "/contact",
    "/view-booking",
    ...ROOM_IDS.map((id) => `/bookings/rooms/${id}`),
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
