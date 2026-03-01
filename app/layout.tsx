import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import BackToTop from "@/components/back-to-top";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <head>
        {/* Paystack Script - Load globally for payment processing */}
        <script src="https://js.paystack.co/v1/inline.js" async defer></script>
      </head>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}
