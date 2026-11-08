import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Our Story",
  description:
    "The story of Ziba Beach Resort, Nigeria's first overwater resort, on the beach at Okun Ajah, Lagos, with a map of the resort.",
  path: "/our-story",
  image: "/ziba-hero-images/ziba-home/ziba-aerial-view-phase-2-grand-overwater-villa.jpg",
  imageAlt: "Ziba Beach Resort from the air",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
