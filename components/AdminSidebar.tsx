'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '⊞' },
  { label: 'Articles', href: '/admin/articles', icon: '✍' },
  { label: 'Campaigns', href: '/admin/campaigns', icon: '📢' },
  { label: 'Members', href: '/admin/members', icon: '👥' },
  { label: 'Executive Committee', href: '/admin/executive', icon: '🏛' },
  { label: 'Team', href: '/admin/team', icon: '🤝' },
  { label: 'Resources', href: '/admin/resources', icon: '📁' },
  { label: 'Newsletter', href: '/admin/newsletter', icon: '✉' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-60 bg-navy flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
            <path d="M4 28V10L14 24L24 10V28" stroke="#E8192C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-[10px] font-bold uppercase tracking-wide text-white/70 leading-tight">
            MJA<br />Admin
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-red text-white font-semibold'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <span>→</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
