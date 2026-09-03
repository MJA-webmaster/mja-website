export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import MembersDirectoryGrid from '@/components/MembersDirectoryGrid'
import type { Member } from '@/lib/types'
import type { Metadata } from 'next'

// Directory tabs mirror MJA's actual membership categories (see lib/membership.ts)
const categorySlugToType: Record<string, Member['membership_type']> = {
  professional: 'Professional',
  student: 'Student',
  corporate: 'Corporate',
  affiliate: 'Affiliate',
}

const categories = Object.keys(categorySlugToType)

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const label = categorySlugToType[params.category]
  return { title: `Members Directory — ${label ?? 'Members'}` }
}

export default async function MembersCategoryPage({ params }: { params: { category: string } }) {
  const supabase = createClient()
  const membershipType = categorySlugToType[params.category]

  const [{ data: members }, { data: stats }] = await Promise.all([
    membershipType
      ? supabase.from('members').select('*').eq('membership_type', membershipType).eq('is_active', true).order('name')
      : Promise.resolve({ data: [] as Member[] }),
    supabase.from('member_stats').select('*').single(),
  ])

  const memberStats = stats
    ? { ...stats, total: stats.local + stats.international + stats.non_member_contributors }
    : { local: 2000, international: 1300, non_member_contributors: 560, total: 3860 }

  const outletCount = new Set((members ?? []).map((m: Member) => m.representing).filter(Boolean)).size

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline font-black uppercase leading-none mb-2" style={{ color: '#0D1B2A', fontSize: 'clamp(32px, 4vw, 48px)' }}>
          Members <span style={{ color: '#E8192C' }}>Directory</span>
        </h1>
        <p className="text-gray-500 text-[14px] leading-relaxed">
          The official register of MJA-accredited journalists, editors, and media workers across the Maldives.
        </p>
      </div>

      {/* Metrics ribbon */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 text-[13px] font-semibold text-gray-500">
        <span><span style={{ color: '#0D1B2A' }}>{memberStats.total.toLocaleString()}</span> Members Registered</span>
        <span className="text-gray-300">•</span>
        <span><span style={{ color: '#0D1B2A' }}>{memberStats.media_outlets || outletCount}</span> Media Outlets</span>
        <span className="text-gray-300">•</span>
        <span>Nationwide Coverage</span>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-6">
        {categories.map((cat) => {
          const isActive = params.category === cat
          return (
            <Link
              key={cat}
              href={`/members-directory/${cat}`}
              className="px-4 py-2 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap"
              style={{
                backgroundColor: isActive ? '#E8192C' : '#F3F4F6',
                color: isActive ? 'white' : '#6B7280',
              }}
            >
              {categorySlugToType[cat]}
            </Link>
          )
        })}
      </div>

      <MembersDirectoryGrid members={(members as Member[]) ?? []} />
    </div>
  )
}
