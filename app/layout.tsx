import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Inter } from "next/font/google";
import { Noto_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import BackToTop from "@/components/back-to-top";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Ziba Beach Resort | Nigeria's Premier Overwater Resort",
  description:
    "Experience luxury at Ziba Beach Resort, Nigeria's first overwater resort with breathtaking ocean views, family activities, and world-class amenities.",
  generator: "v0.app",
  icons: {
    icon: "/ziba-favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${notoSans.variable}`}
    >
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
