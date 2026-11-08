import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Call, email or WhatsApp Ziba Beach Resort, Ziba Beach Close, Okun Ajah, Lagos. Directions and answers to common questions.",
  path: "/contact",
  image: "/ziba-hero-images/contact-hero.jpg",
  imageAlt: "Ziba Beach Resort",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
