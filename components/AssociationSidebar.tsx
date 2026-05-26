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

export default function AssociationSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 flex-shrink-0">
      <nav className="space-y-1 sticky top-24">
        {links.map((link) => {
          const isActive = pathname === link.href
          const isParentActive = pathname?.startsWith(link.href)

          return (
            <div key={link.href}>
              <Link
                href={link.href}
                className={`block py-2 text-[14px] font-semibold transition-colors ${
                  isActive || (isParentActive && !link.children)
                    ? 'font-headline'
                    : 'text-gray-400 hover:text-navy'
                }`}
                style={isActive || isParentActive ? { color: '#E8192C' } : {}}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="ml-4 space-y-1 mt-1 mb-2">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block py-1.5 text-[13px] transition-colors ${
                        pathname === child.href
                          ? 'text-navy font-semibold'
                          : 'text-gray-400 hover:text-navy'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
