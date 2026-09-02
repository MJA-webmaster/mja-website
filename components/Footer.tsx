"use client"

import Link from 'next/link'

const footerLinks = {
  about: [
    { label: 'Our Values', href: '/the-association/values' },
    { label: 'Governance', href: '/the-association/governance' },
    { label: 'Board Members', href: '/the-association/board' },
    { label: 'Code of Conduct', href: '/the-association/code-of-conduct' },
  ],
  membership: [
    { label: 'Join MJA', href: '/join-mja' },
    { label: 'Members Directory', href: '/members-directory' },
    { label: 'Check Membership Status', href: '/membership-status' },
    { label: 'Report a Case', href: '/connect' },
  ],
  resources: [
    { label: 'Publications', href: '/resource-hub?category=publications' },
    { label: 'Annual Reports', href: '/resource-hub?category=annual-reports' },
    { label: 'Financials', href: '/resource-hub?category=financials' },
    { label: 'Multimedia', href: '/resource-hub?category=multimedia' },
  ],
}

const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/mjamaldives',
    d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/mjamaldives',
    d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/mjamaldives',
    d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
  },
]

function SocialIcon({ label, href, d }: { label: string; href: string; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
      style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E8192C')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3.5 h-3.5"
      >
        <path d={d} />
      </svg>
    </button>
  )
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D1B2A' }} className="text-white">
      {/* Links grid */}
      <div className="max-w-[1280px] mx-auto px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo col */}
        <div>
          <Link href="/" className="inline-block mb-6">
            <img
              src="/mjalogo.png"
              alt="Maldives Journalists Association"
              className="h-20 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-xs text-white/30 leading-relaxed">
            Defending freedom of information across every corner of the Maldives.
          </p>
        </div>

        {/* The Association */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">The Association</p>
          {footerLinks.about.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-[13px] text-white/45 hover:text-white transition-colors leading-loose"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Membership */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">Membership</p>
          {footerLinks.membership.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-[13px] text-white/45 hover:text-white transition-colors leading-loose"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Resources */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">Resources</p>
          {footerLinks.resources.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-[13px] text-white/45 hover:text-white transition-colors leading-loose"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1280px] mx-auto">
        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} Maldives Journalists Association · mja.mv
        </p>
        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <SocialIcon key={s.label} label={s.label} href={s.href} d={s.d} />
          ))}
        </div>
      </div>
    </footer>
  )
}
