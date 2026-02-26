import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ziba Beach Resort | Nigeria\'s Premier Overwater Resort',
  description: 'Experience luxury at Ziba Beach Resort, Nigeria\'s first overwater resort with breathtaking ocean views, family activities, and world-class amenities.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
