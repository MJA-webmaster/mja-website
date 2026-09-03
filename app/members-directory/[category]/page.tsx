export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import MemberMeter from '@/components/MemberMeter'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

const categoryLabels: Record<string, string> = {
  'category-one': 'Local',
  'category-two': 'International',
  'category-three': 'Non-Member Contributors',
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  return { title: `Members Directory — ${categoryLabels[params.category] ?? 'Members'}` }
}

export default async function MembersCategoryPage({ params }: { params: { category: string } }) {
  const supabase = createClient()
  const [{ data: members }, { data: stats }] = await Promise.all([
    supabase.from('members').select('*').eq('category', params.category).eq('is_active', true).order('name'),
    supabase.from('member_stats').select('*').single(),
  ])

  const memberStats = stats
    ? { ...stats, total: stats.local + stats.international + stats.non_member_contributors }
    : { local: 2000, international: 1300, non_member_contributors: 560, total: 3860 }

  const categories = ['category-one', 'category-two', 'category-three']

  return (
    <>
      {/* Mobile category tabs */}
      <div className="md:hidden sticky top-16 z-40 bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto px-4 py-3 gap-2" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <Link key={cat} href={`/members-directory/${cat}`}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{
                backgroundColor: params.category === cat ? '#E8192C' : '#F3F4F6',
                color: params.category === cat ? 'white' : '#6B7280',
              }}>
              {categoryLabels[cat]}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-52 flex-shrink-0">
            <AssociationSidebar />
            <nav className="mt-6 pt-6 border-t border-gray-100 space-y-1">
              <Link href="/members-directory" className="block py-2 text-[14px] font-bold transition-colors" style={{ color: '#E8192C' }}>
                Members Directory
              </Link>
              <div className="ml-4 space-y-1 mt-1">
                {categories.map((cat) => (
                  <Link key={cat} href={`/members-directory/${cat}`}
                    className="block py-1.5 text-[13px] transition-colors"
                    style={params.category === cat ? { color: '#0D1B2A', fontWeight: 600 } : { color: '#9CA3AF' }}>
                    {categoryLabels[cat]}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="grid md:grid-cols-2 gap-8 mb-10 items-start">
              <div>
                <h1 className="font-headline font-black uppercase leading-none mb-2" style={{ color: '#0D1B2A', fontSize: 'clamp(32px, 4vw, 48px)' }}>
                  <span style={{ color: '#E8192C' }}>Members</span><br />
                  {categoryLabels[params.category] ?? 'Members'}
                </h1>
                <p className="text-gray-500 text-[14px] leading-relaxed mt-3">
                  MJA members dedicated to press freedom across the Maldives.
                </p>
              </div>
              <MemberMeter stats={memberStats} />
            </div>

            {/* Members grid */}
            {members && members.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-6 md:gap-8">
                {members.map((member) => (
                  <div key={member.id} className="text-center group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 mx-auto mb-2 md:mb-3 relative"
                      style={{ border: '3px solid #E5E7EB' }}>
                      {member.photo ? (
                        <Image src={member.photo} alt={member.name} width={96} height={96} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl">
                          {member.name[0]}
                        </div>
                      )}
                      <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: '#E8192C' }} />
                    </div>
                    <p className="font-semibold text-xs md:text-sm leading-tight" style={{ color: '#E8192C' }}>{member.name}</p>
                    {member.representing && (
                      <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">Rep: {member.representing}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">👥</p>
                <p className="font-semibold text-sm">No members in this category yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
