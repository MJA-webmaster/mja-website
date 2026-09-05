export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Governance' }

export default async function GovernancePage() {
  const supabase = createClient()
  const { data: members } = await supabase
    .from('executive_committee')
    .select('*')
    .order('order', { ascending: true })

  const president = members?.find(m => m.is_president)
  const committee = members?.filter(m => !m.is_president)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-16">
        <AssociationSidebar />
        <div className="flex-1 min-w-0">
          <div className="grid md:grid-cols-2 gap-10 mb-14 items-start">
            <h1 className="font-headline font-black uppercase leading-none text-4xl md:text-5xl" style={{ color: '#0D1B2A' }}>
              <span style={{ color: '#E8192C' }}>MJA</span><br />
              Executive<br />
              Committee
            </h1>
            <p className="text-gray-500 text-[14px] leading-relaxed">
              The MJA Executive Committee is elected by members and is responsible for overseeing the association's work, setting strategic direction, and ensuring MJA's mission of press freedom is upheld.
            </p>
          </div>

          {president && (
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-8 md:p-10 mb-14">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-100 mx-auto md:mx-0" style={{ border: '4px solid #E8192C' }}>
                  {president.photo ? (
                    <Image src={president.photo} alt={president.name} width={192} height={192} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl text-gray-300">
                      {president.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#E8192C' }}>{president.role}</p>
                  <h2 className="font-headline text-2xl md:text-3xl font-black text-navy mb-3">{president.name}</h2>
                  {president.bio && <p className="text-gray-500 text-[14px] leading-relaxed mb-3 max-w-xl">{president.bio}</p>}
                  {president.representing && <p className="text-xs font-semibold text-gray-400">{president.representing}</p>}
                </div>
              </div>
            </div>
          )}

          {committee && committee.length > 0 && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 pb-3 border-b border-gray-100">
                Committee Members
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {committee.map((member) => (
                  <div key={member.id} className="text-center group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mx-auto mb-3 transition-shadow group-hover:shadow-md">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-[filter] duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl text-gray-300">{member.name[0]}</div>
                      )}
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#E8192C' }}>{member.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
                    {member.representing && <p className="text-xs text-gray-300 mt-0.5">{member.representing}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {(!members || members.length === 0) && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🏛</p>
              <p className="font-semibold text-sm">Executive Committee members will appear here</p>
              <p className="text-xs mt-1">Add members via the admin panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
