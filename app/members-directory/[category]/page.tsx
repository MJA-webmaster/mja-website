import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import MemberMeter from '@/components/MemberMeter'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

const categoryLabels: Record<string, string> = {
  'category-one': 'Category One',
  'category-two': 'Category Two',
  'category-three': 'Category Three',
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
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex gap-16">
          {/* Sidebar */}
          <aside className="w-52 flex-shrink-0">
            <nav className="space-y-1 sticky top-24">
              <Link href="/the-association" className="block py-2 text-[14px] text-gray-400 hover:text-navy transition-colors">
                The Association
              </Link>
              <Link href="/the-association/governance" className="block py-2 text-[14px] text-gray-400 hover:text-navy transition-colors">
                Governance
              </Link>
              <div>
                <Link
                  href="/members-directory"
                  className="block py-2 text-[14px] font-bold transition-colors"
                  style={{ color: '#E8192C' }}
                >
                  Members Directory
                </Link>
                <div className="ml-4 space-y-1 mt-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/members-directory/${cat}`}
                      className="block py-1.5 text-[13px] transition-colors"
                      style={params.category === cat ? { color: '#0D1B2A', fontWeight: 600 } : { color: '#9CA3AF' }}
                    >
                      {categoryLabels[cat]}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/the-association/team" className="block py-2 text-[14px] text-gray-400 hover:text-navy transition-colors">
                MJA Team
              </Link>
              <Link href="/the-association/code-of-conduct" className="block py-2 text-[14px] text-gray-400 hover:text-navy transition-colors">
                Code of Conduct
              </Link>
            </nav>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="grid md:grid-cols-2 gap-10 mb-10 items-start">
              <div>
                <h1 className="font-headline font-black uppercase leading-none mb-2" style={{ color: '#0D1B2A' }}>
                  <span style={{ color: '#E8192C' }}>Category</span><br />
                  {categoryLabels[params.category]?.split(' ')[1] ?? 'One'}
                </h1>
                <p className="text-gray-500 text-[14px] leading-relaxed mt-4">
                  MJA members are journalists, media professionals, and advocates dedicated to press freedom across the Maldives.
                </p>
              </div>
              <MemberMeter stats={memberStats} />
            </div>

            {/* Members grid */}
            {members && members.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {members.map((member) => (
                  <div key={member.id} className="text-center group cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mx-auto mb-3 relative" style={{ border: '3px solid #E5E7EB' }}>
                      {member.photo ? (
                        <Image src={member.photo} alt={member.name} width={96} height={96} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                          {member.name[0]}
                        </div>
                      )}
                      {/* Status dot */}
                      <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: '#E8192C' }} />
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#E8192C' }}>{member.name}</p>
                    {member.representing && (
                      <p className="text-xs text-gray-400 mt-0.5">Representing: {member.representing}</p>
                    )}
                    {member.years_in_journalism && (
                      <p className="text-xs text-gray-300 mt-0.5">{member.years_in_journalism} Years in Journalism</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">👥</p>
                <p className="font-semibold text-sm">No members in this category yet</p>
                <p className="text-xs mt-1">Members can be added via the admin panel</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don't wait for information being deprived<br />
            of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
