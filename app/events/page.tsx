import Image from "next/image";
import { Briefcase, Camera, Heart, Users } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import SectionHeading from "@/components/section-heading";
import { pageMetadata } from "@/lib/page-metadata";
import EventsForm from "./events-form";

export const metadata = pageMetadata({
  title: "Weddings, Events & Team Bonding",
  description:
    "Plan a beach wedding, team bonding day, corporate retreat or conference at Ziba Beach Resort, Lagos. Send us your date and headcount and we'll put a plan together.",
  path: "/events",
  image: "/team-bonding/team-bonding-1.jpg",
  imageAlt: "A team bonding event at Ziba Beach Resort",
});

const KINDS = [
  { icon: Heart, title: "Weddings", text: "Beachside ceremonies and receptions with the ocean behind you." },
  { icon: Users, title: "Team bonding", text: "Games, activities and good food to bring a team together." },
  { icon: Briefcase, title: "Retreats & conferences", text: "A conference hall for up to 85, with rooms for overnight retreats." },
  { icon: Camera, title: "Shoots", text: "Maternity, birthday, music video and film shoots by the sea." },
];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero
        eyebrow="Weddings & events"
        title="Bring everyone together by the sea"
        subtitle="Beach weddings, team bonding, retreats and conferences for groups of any size."
        imageUrl="/team-bonding/team-bonding-1.jpg"
        imageAlt="A team bonding event at Ziba Beach Resort"
      />

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <ul className="mx-auto grid max-w-7xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {KINDS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon className="h-7 w-7 text-blue-800" strokeWidth={1.5} aria-hidden="true" />
              <h2 className="mt-4 font-cormorant text-2xl font-medium text-blue-950">{title}</h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="enquire" className="scroll-mt-28 bg-[#f7f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading align="left" eyebrow="Enquire" title="Tell us about your event">
              Share your date and headcount and our events team will come back
              to you with options and a quote.
            </SectionHeading>
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-3xl lg:block">
              <Image src="/experience-ziba/conference-room.jpg" alt="The conference room set up for an event at Ziba" fill sizes="35vw" className="object-cover" />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 sm:p-10">
            <EventsForm initialType={type} />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
