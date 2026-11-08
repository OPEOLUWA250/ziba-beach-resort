import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Experiences & Activities",
  description:
    "Floating breakfasts, beach dinners, massages, horse riding, foam parties and more at Ziba Beach Resort, Lagos.",
  path: "/experience",
  image: "/experience-ziba/floating-breakfast.jpg",
  imageAlt: "A floating breakfast at Ziba",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
