import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import { pageMetadata } from "@/lib/page-metadata";
import CelebrationBuilder from "./celebration-builder";

export const metadata = pageMetadata({
  title: "Build Your Celebration",
  description:
    "Plan a honeymoon, anniversary, birthday or proposal at Ziba Beach Resort: choose a package or room, add floating breakfast, a beach dinner and more, and send it to us on WhatsApp.",
  path: "/celebrations",
  image: "/honeymoon/honeymoon-1.jpg",
  imageAlt: "A celebration at Ziba Beach Resort",
});

export default function CelebrationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero
        eyebrow="Honeymoons & celebrations"
        title="Build your celebration"
        subtitle="Choose a package or a room, add the moments you'd love, see an estimated total and send it straight to our team on WhatsApp."
        imageUrl="/honeymoon/honeymoon-1.jpg"
        imageAlt="A celebration at Ziba Beach Resort"
      />
      <main className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <CelebrationBuilder />
        </div>
      </main>
      <Footer />
    </div>
  );
}
