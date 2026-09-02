'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  {
    label: 'The Association',
    href: '/the-association',
    children: [
      { label: 'Our Values', href: '/the-association/values' },
      { label: 'Governance', href: '/the-association/governance' },
      { label: 'Code of Conduct', href: '/the-association/code-of-conduct' },
    ],
  },
  { label: 'News Room', href: '/news-room' },
  { label: 'Resource Hub', href: '/resource-hub' },
  { label: 'Campaigns', href: '/campaigns' },
  {
    label: 'Members Directory',
    href: '/members-directory',
    children: [
      { label: 'Directory', href: '/members-directory' },
      { label: 'Check Membership Status', href: '/membership-status' },
    ],
  },
  { label: 'Connect', href: '/connect' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (pathname?.startsWith('/admin')) return null

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'border-b border-gray-100'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <img
            src="/mjalogo.png"
            alt="Maldives Journalists Association"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <li
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={`text-[15px] font-medium tracking-wide transition-colors hover:text-red ${
                  pathname?.startsWith(link.href) && link.href !== '/'
                    ? 'text-red'
                    : 'text-navy'
                }`}
              >
                {link.label}
              </Link>

              {link.children && (
                <AnimatePresence>
                  {activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 pt-3 w-60"
                    >
                      <div className="bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-3 text-[14px] text-navy hover:bg-gray-50 hover:text-red transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>

        {/* Join CTA */}
        <Link
          href="/join-mja"
          className="hidden lg:block text-white text-[14px] font-semibold px-6 py-2.5 rounded transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#E8192C' }}
        >
          Join MJA
        </Link>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-navy origin-center"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-navy"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-navy origin-center"
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-3 text-[16px] font-medium border-b border-gray-50 ${
                      pathname?.startsWith(link.href) ? 'text-red' : 'text-navy'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4 mt-1 mb-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2 text-[14px] text-gray-500 hover:text-red"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/join-mja"
                className="mt-4 text-white text-center py-3.5 rounded font-semibold text-[15px]"
                style={{ backgroundColor: '#E8192C' }}
              >
                Join MJA
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
