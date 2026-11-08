import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Blog & Stories",
  description:
    "Ideas for proposals, beach weddings, family days out and more from Ziba Beach Resort, Lagos.",
  path: "/blog",
  image: "/ziba-hero-images/blog-hero.jpg",
  imageAlt: "Ziba Beach Resort",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
