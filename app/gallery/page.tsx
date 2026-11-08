import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import { pageMetadata } from "@/lib/page-metadata";
import GalleryGrid from "./gallery-grid";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Photos of Ziba Beach Resort, Lagos: the Grand Overwater Villa, rooms and suites, pools, the beach, experiences and celebrations.",
  path: "/gallery",
  image: "/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-villa.jpg",
  imageAlt: "The Grand Overwater Villa beside the ocean",
});

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero
        eyebrow="Gallery"
        title="See Ziba"
        subtitle="The resort, our rooms, the experiences and the moments guests celebrate with us."
        imageUrl="/ziba-hero-images/ziba-home/ziba-aerial-view-grand-overwater-villa.jpg"
        imageAlt="The Grand Overwater Villa beside the ocean"
      />
      <main className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <GalleryGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
