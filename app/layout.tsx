import type { Metadata } from 'next'
import { Google_Fonts_loader } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Finlandica Headline for headings
const finlandicaHeadline = {
  variable: '--font-finlandica-headline',
}

// Finlandica for body text
const finlandicaText = {
  variable: '--font-finlandica-text',
}

export const metadata: Metadata = {
  title: {
    default: 'Maldives Journalist Association',
    template: '%s | MJA',
  },
  description: 'Be the voice for freedom of press. Maldives Journalist Association — defending freedom of information across every corner of the globe.',
  keywords: ['MJA', 'Maldives Journalist Association', 'press freedom', 'journalism', 'Maldives'],
  openGraph: {
    title: 'Maldives Journalist Association',
    description: 'Be the voice for freedom of press.',
    url: 'https://mja.mv',
    siteName: 'MJA',
    locale: 'en_US',
    type: 'website',
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
      </body>
    </html>
  )
}
