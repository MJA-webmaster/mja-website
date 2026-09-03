import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CampaignPrompt from '@/components/CampaignPrompt'

export const metadata: Metadata = {
  metadataBase: new URL('https://mja.mv'),
  title: {
    default: 'Maldives Journalist Association',
    template: '%s | MJA',
  },
  description: 'Be the voice for freedom of press. Maldives Journalist Association — defending freedom of information across every corner of the globe.',
  keywords: ['MJA', 'Maldives Journalist Association', 'press freedom', 'journalism', 'Maldives'],
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Maldives Journalist Association',
    description: 'Be the voice for freedom of press.',
    url: 'https://mja.mv',
    siteName: 'MJA',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Maldives Journalists Association' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maldives Journalist Association',
    description: 'Be the voice for freedom of press.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Finlandica:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          '--font-finlandica-headline': "'Finlandica', sans-serif",
          '--font-finlandica-text': "'Finlandica', sans-serif",
        } as React.CSSProperties}
      >
        <Nav />
        <main>{children}</main>
        <Footer />
        <CampaignPrompt />
      </body>
    </html>
  )
}
