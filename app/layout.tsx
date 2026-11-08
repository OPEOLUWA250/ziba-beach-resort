import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Inter } from "next/font/google";
import { Noto_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import WhatsAppConcierge from "@/components/whatsapp-concierge";
import NoticeHost from "@/components/notice-center";
import { DEFAULT_SHARE_IMAGE, SITE_URL } from "@/lib/site";
import AnalyticsTracker from "@/components/analytics-tracker";
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
  // Share previews and canonical links use this deployment's own address.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ziba Beach Resort | Nigeria's Premier Overwater Resort",
    template: "%s | Ziba Beach Resort",
  },
  description:
    "Ziba Beach Resort in Okun Ajah, Lagos: Nigeria's first overwater resort. Overwater rooms and suites, day passes, dining, celebrations and experiences by the sea.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Ziba Beach Resort",
    title: "Ziba Beach Resort | Nigeria's Premier Overwater Resort",
    description:
      "Book luxury beach stays, day passes, dining, and experiences at Ziba Beach Resort.",
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziba Beach Resort | Nigeria's Premier Overwater Resort",
    description:
      "Experience overwater luxury, beachfront relaxation, and curated experiences at Ziba Beach Resort.",
    images: [DEFAULT_SHARE_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
      <head>
        {/* Paystack Script - Load globally for payment processing */}
        <script src="https://js.paystack.co/v1/inline.js" async defer></script>
      </head>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
        <WhatsAppConcierge />
        <NoticeHost />
        <Analytics />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
