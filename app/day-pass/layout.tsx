import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Day Pass",
  description:
    "Spend the day at Ziba Beach Resort, 10am to 6pm: pools, the beach, food, drinks and activities. Book your day pass online.",
  path: "/day-pass",
  image: "/day-experience.jpg",
  imageAlt: "A day at the beach at Ziba",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
