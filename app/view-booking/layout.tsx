import { pageMetadata } from "@/lib/page-metadata";

// Guests' booking pages stay out of search results.
export const metadata = pageMetadata({
  title: "Find Your Booking",
  description: "Ziba Beach Resort, Okun Ajah, Lagos.",
  path: "/view-booking",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
