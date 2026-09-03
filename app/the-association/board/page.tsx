export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { ExecutiveCommitteeMember } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Board Members',
  description: 'The elected board of the Maldives Journalists Association.',
}

export const revalidate = 60

export default async function BoardPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('executive_committee')
    .select('*')
    .order('order', { ascending: true })

  const members = (data ?? []) as ExecutiveCommitteeMember[]
  const president = members.find((m) => m.is_president)
  const rest = members.filter((m) => !m.is_president)

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />

          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-2" style={{ color: '#0D1B2A' }}>
              Board <span style={{ color: '#E8192C' }}>Members</span>
            </h1>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-lg">
              The elected board of the Maldives Journalists Association, responsible for
              guiding the work of the organisation and representing its members.
            </p>

            {members.length === 0 && (
              <p className="text-gray-400 text-sm">Board members will be listed here shortly.</p>
            )}

            {/* President */}
            {president && (
              <div className="mb-12">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    {president.photo ? (
                      <img src={president.photo} alt={president.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-300">
                        {president.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#E8192C' }}>
                      {president.role}
                    </p>
                    <h2 className="font-headline text-2xl font-black text-navy mb-1">{president.name}</h2>
                    {president.representing && (
                      <p className="text-sm text-gray-400 mb-3">{president.representing}</p>
                    )}
                    {president.bio && (
                      <p className="text-gray-500 text-[14px] leading-relaxed max-w-lg">{president.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rest of the board */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-6">
                {rest.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl p-5 border border-gray-100 flex gap-4 items-start"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-black text-gray-300">
                          {member.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#E8192C' }}>
                        {member.role}
                      </p>
                      <h3 className="font-bold text-navy text-[15px]">{member.name}</h3>
                      {member.representing && (
                        <p className="text-xs text-gray-400 mt-0.5">{member.representing}</p>
                      )}
                      {member.bio && (
                        <p className="text-gray-500 text-[13px] leading-relaxed mt-2 line-clamp-4">{member.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don&apos;t wait for information being deprived<br />
            of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
        </div>
      </section>
    </>
  )
}
