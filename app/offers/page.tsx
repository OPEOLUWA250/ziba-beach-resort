import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarHeart, Gift, Users } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import SectionHeading from "@/components/section-heading";
import { pageMetadata } from "@/lib/page-metadata";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = pageMetadata({
  title: "Offers & Packages",
  description:
    "Seasonal offers, holiday packages and honeymoon packages at Ziba Beach Resort, Lagos.",
  path: "/offers",
  image: "/honeymoon/honeymoon-4.jpg",
  imageAlt: "A celebration setting at Ziba Beach Resort",
});

// Offers are managed as popups in the admin; refresh every few minutes.
export const revalidate = 300;

interface Offer {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
}

async function activeOffers(): Promise<Offer[]> {
  const { data, error } = await supabaseServer
    .from("popups")
    .select("id, title, slug, excerpt, featured_image")
    .eq("status", "ACTIVE")
    .order("createdat", { ascending: false });
  if (error) {
    console.error("[offers]", error.message);
    return [];
  }
  return (data || []) as Offer[];
}

const ALWAYS = [
  { icon: CalendarHeart, title: "Honeymoon packages", text: "Twelve packages from two to six nights, with experiences included.", href: "/celebrations", cta: "Build your package" },
  { icon: Gift, title: "Gift a day pass", text: "A day at the beach for someone you love, with your own message.", href: "/gift", cta: "Send a gift" },
  { icon: Users, title: "Groups of 15 or more", text: "Birthdays, retreats and team days with special group arrangements.", href: "/events", cta: "Plan an event" },
];

export default async function OffersPage() {
  const offers = await activeOffers();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero
        eyebrow="Offers"
        title="Offers & packages"
        subtitle="Seasonal offers and packages to make your stay even more special."
        imageUrl="/honeymoon/honeymoon-4.jpg"
        imageAlt="A celebration setting at Ziba Beach Resort"
      />

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading align="left" eyebrow="Right now" title="Current offers">
            {offers.length ? "Limited-time offers from the resort." : "There are no seasonal offers running at the moment. Our packages below are available all year."}
          </SectionHeading>

          {offers.length > 0 && (
            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <li key={offer.id}>
                  <Link href={`/popups/${offer.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                      {offer.featured_image ? (
                        // Offer images are uploaded in the admin and may live on Supabase Storage.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={offer.featured_image}
                          alt={offer.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                        />
                      ) : (
                        <Image src="/honeymoon/honeymoon-2.jpg" alt="" fill sizes="33vw" className="object-cover" />
                      )}
                    </div>
                    <h3 className="mt-5 font-cormorant text-3xl font-medium leading-tight text-blue-950 group-hover:text-blue-800">
                      {offer.title}
                    </h3>
                    {offer.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm font-light leading-relaxed text-slate-600">{offer.excerpt.trim()}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900">
                      See the offer
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-[#f7f4ee] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading align="left" eyebrow="All year" title="Always available" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {ALWAYS.map(({ icon: Icon, title, text, href, cta }) => (
              <li key={href}>
                <Link href={href} className="group flex h-full flex-col rounded-3xl bg-white p-8 transition hover:shadow-lg">
                  <Icon className="h-7 w-7 text-blue-800" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-5 font-cormorant text-3xl font-medium text-blue-950">{title}</h3>
                  <p className="mt-2 grow text-sm font-light leading-relaxed text-slate-600">{text}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900">
                    {cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}
