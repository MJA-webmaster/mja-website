import Link from 'next/link'

const footerLinks = {
  about: [
    { label: 'Journalist Directory', href: '/members-directory' },
    { label: 'MJA Press Freedom Index', href: '/resource-hub/publications' },
    { label: 'Downloads', href: '/resource-hub' },
    { label: 'Code of Conduct', href: '/the-association/code-of-conduct' },
    { label: 'MJA Team', href: '/the-association/team' },
  ],
  contact: [
    { label: 'Connect with Us', href: '/connect' },
    { label: 'Press Inquiries', href: '/connect' },
    { label: 'Membership', href: '/join-mja' },
    { label: 'Report a Case', href: '/connect' },
  ],
  resourceHub: [
    { label: 'Publications', href: '/resource-hub/publications' },
    { label: 'Photos', href: '/resource-hub/photos' },
    { label: 'Videos', href: '/resource-hub/videos' },
    { label: 'Code of Conduct', href: '/the-association/code-of-conduct' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* CTA Row */}
      <div className="bg-navy-mid px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-xs font-bold tracking-widest uppercase text-white/50">
          Get Involved Today!
        </p>
        <Link
          href="/shop"
          className="bg-red text-white px-7 py-3 rounded text-sm font-bold tracking-widest uppercase hover:bg-red-dark transition-colors"
        >
          Visit the Shop
        </Link>
      </div>

      {/* Links Grid */}
      <div className="max-w-[1280px] mx-auto px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5">
        {/* Logo col */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-6">
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
              <path d="M4 28V10L14 24L24 10V28" stroke="#E8192C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M27 12L33 12" stroke="#E8192C" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M27 18L33 18" stroke="#E8192C" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <div className="text-[10px] font-semibold uppercase tracking-wide leading-tight text-white/70">
              Maldives<br />Journalist<br />Association
            </div>
          </Link>
          <p className="text-xs text-white/30 leading-relaxed">
            Defending freedom of information across every corner of the globe.
          </p>
        </div>

        {/* About */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">About</p>
          {footerLinks.about.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[13px] text-white/45 hover:text-teal-400 transition-colors leading-loose"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">Contact</p>
          {footerLinks.contact.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[13px] text-white/45 hover:text-teal-400 transition-colors leading-loose"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Resource Hub */}
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">Resource Hub</p>
          {footerLinks.resourceHub.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[13px] text-white/45 hover:text-teal-400 transition-colors leading-loose"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} Maldives Journalist Association
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {[
            { label: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
            { label: 'Instagram', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z' },
            { label: 'LinkedIn', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
            { label: 'Twitter', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
          ].map((social) => (
            <a
              key={social.label}
              href="#"
              aria-label={social.label}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-red flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d={social.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
