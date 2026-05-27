'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  {
    label: 'The Association',
    href: '/the-association',
    children: [
      { label: 'Our Values', href: '/the-association/values' },
      { label: 'Our Supporters', href: '/the-association/supporters' },
      { label: 'Our Activities', href: '/the-association/activities' },
    ],
  },
  { label: 'Governance', href: '/the-association/governance' },
  { label: 'MJA Team', href: '/the-association/team' },
  { label: 'Code of Conduct', href: '/the-association/code-of-conduct' },
]

// Flat list for mobile tab bar
const flatLinks = [
  { label: 'About', href: '/the-association' },
  { label: 'Values', href: '/the-association/values' },
  { label: 'Supporters', href: '/the-association/supporters' },
  { label: 'Activities', href: '/the-association/activities' },
  { label: 'Governance', href: '/the-association/governance' },
  { label: 'Team', href: '/the-association/team' },
  { label: 'Code of Conduct', href: '/the-association/code-of-conduct' },
]

export default function AssociationSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Mobile: horizontal scrollable tab bar ── */}
      <div className="md:hidden sticky top-16 z-40 bg-white border-b border-gray-100 -mx-4 px-4 mb-8">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {flatLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? '#E8192C' : '#F3F4F6',
                  color: isActive ? 'white' : '#6B7280',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <aside className="hidden md:block w-52 flex-shrink-0">
        <nav className="space-y-1 sticky top-24">
          {links.map((link) => {
            const isActive = pathname === link.href
            const isParentActive = pathname?.startsWith(link.href)

            return (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-[14px] font-semibold transition-colors"
                  style={isActive || isParentActive ? { color: '#E8192C' } : { color: '#9CA3AF' }}
                  onMouseEnter={(e) => { if (!isActive && !isParentActive) (e.target as HTMLElement).style.color = '#0D1B2A' }}
                  onMouseLeave={(e) => { if (!isActive && !isParentActive) (e.target as HTMLElement).style.color = '#9CA3AF' }}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 space-y-0.5 mt-0.5 mb-2">
                    {link.children.map((child) => {
                      const childActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-1.5 text-[13px] transition-colors"
                          style={childActive ? { color: '#0D1B2A', fontWeight: 600 } : { color: '#9CA3AF' }}
                          onMouseEnter={(e) => { if (!childActive) (e.target as HTMLElement).style.color = '#0D1B2A' }}
                          onMouseLeave={(e) => { if (!childActive) (e.target as HTMLElement).style.color = '#9CA3AF' }}
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
