import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import { pageMetadata } from "@/lib/page-metadata";
import GiftForm from "./gift-form";

export const metadata = pageMetadata({
  title: "Gift a Day Pass",
  description:
    "Give someone a day at Ziba Beach Resort, Lagos: day-pass gift vouchers with a personal message, sent by email or ready to collect.",
  path: "/gift",
  image: "/day-experience.jpg",
  imageAlt: "The beach at Ziba Beach Resort",
});

export default function GiftPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero
        eyebrow="Gift vouchers"
        title="Give a day by the sea"
        subtitle="A Ziba day pass for someone special, with your own message. Perfect for birthdays, thank-yous and just because."
        imageUrl="/day-experience.jpg"
        imageAlt="The beach at Ziba Beach Resort"
      />
      <main className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <GiftForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
