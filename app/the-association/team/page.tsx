import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import NewsletterForm from '@/components/NewsletterForm'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'MJA Team' }

export default async function TeamPage() {
  const supabase = createClient()
  const { data: team } = await supabase
    .from('team_members')
    .select('*')
    .order('order', { ascending: true })

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-2" style={{ color: '#0D1B2A' }}>
              <span style={{ color: '#E8192C' }}>MJA</span> Team
            </h1>
            <p className="text-gray-500 text-[14px] leading-relaxed mb-12 max-w-lg">
              Meet the dedicated team behind MJA's day-to-day operations, working to support journalists and defend press freedom across the Maldives.
            </p>

            {team && team.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div key={member.id}>
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                      {member.photo ? (
                        <Image src={member.photo} alt={member.name} width={300} height={300} className="object-cover w-full h-full grayscale" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl text-gray-300">{member.name[0]}</div>
                      )}
                    </div>
                    <p className="font-bold text-navy text-sm">{member.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#E8192C' }}>{member.position}</p>
                    {member.bio && <p className="text-xs text-gray-400 mt-2 leading-relaxed">{member.bio}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">🤝</p>
                <p className="font-semibold text-sm">Team members will appear here</p>
                <p className="text-xs mt-1">Add team members via the admin panel</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don't wait for information being deprived<br />of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
