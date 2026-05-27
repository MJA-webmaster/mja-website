'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, FileText, Megaphone, Users, Award,
  UserCheck, FolderOpen, Mail, Settings, LogOut,
  ClipboardList, BarChart2, BookOpen,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { divider: 'Content' },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
  { label: 'Pages', href: '/admin/pages', icon: BookOpen },
  { label: 'Resources', href: '/admin/resources', icon: FolderOpen },
  { divider: 'People' },
  { label: 'Members', href: '/admin/members', icon: Users },
  { label: 'Applications', href: '/admin/applications', icon: ClipboardList },
  { label: 'Executive Committee', href: '/admin/executive', icon: Award },
  { label: 'Team', href: '/admin/team', icon: UserCheck },
  { divider: 'Data' },
  { label: 'Member Stats', href: '/admin/member-stats', icon: BarChart2 },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-60 bg-navy flex flex-col flex-shrink-0" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="p-5 border-b border-white/10">
        <Link href="/" target="_blank">
          <img src="/mjalogo.png" alt="MJA" className="h-8 w-auto brightness-0 invert" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item, i) => {
          if ('divider' in item) {
            return (
              <p key={i} className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 pt-5 pb-2">
                {item.divider}
              </p>
            )
          }

          const Icon = item.icon
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                isActive ? 'text-white font-semibold' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { backgroundColor: '#E8192C' } : {}}
            >
              <Icon size={16} strokeWidth={1.75} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
