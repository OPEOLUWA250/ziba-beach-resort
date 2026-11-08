import { pageMetadata } from "@/lib/page-metadata";

// Guests' booking pages stay out of search results.
export const metadata = pageMetadata({
  title: "Day Pass Confirmation",
  description: "Ziba Beach Resort, Okun Ajah, Lagos.",
  path: "/day-pass/confirmation",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
