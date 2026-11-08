import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Restaurant & Drinks Menu",
  description:
    "Breakfast, mains, grills, cocktails and more at Ziba's beach bar and restaurant, with prices in naira.",
  path: "/menu",
  image: "/ziba-hero-images/menu-hero.jpg",
  imageAlt: "Breakfast at Ziba",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
