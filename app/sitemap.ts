import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://zibabeachresort.com";
  const now = new Date();

  const publicRoutes = [
    "",
    "/booking",
    "/bookings",
    "/day-pass",
    "/experience",
    "/menu",
    "/our-story",
    "/blog",
    "/contact",
    "/view-booking",
    "/honeymoon",
    "/popups",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
