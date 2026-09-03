export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Activities' }

export default async function ActivitiesPage() {
  const supabase = createClient()
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .order('year', { ascending: false })
    .order('order', { ascending: true })

  // Group by year
  const grouped = (activities ?? []).reduce((acc, a) => {
    if (!acc[a.year]) acc[a.year] = []
    acc[a.year].push(a)
    return acc
  }, {} as Record<number, typeof activities>)

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />
          <div className="flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-black uppercase mb-10" style={{ color: '#0D1B2A' }}>
              Our <span style={{ color: '#E8192C' }}>Activities</span>
            </h1>

            {years.length > 0 ? (
              <div className="space-y-12">
                {years.map((year) => (
                  <div key={year}>
                    {/* Year divider */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-headline text-2xl font-black" style={{ color: '#E8192C' }}>{year}</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Activity cards */}
                    <div className="space-y-4 pl-4 border-l-2" style={{ borderColor: '#F3F4F6' }}>
                      {grouped[Number(year)]?.map((activity: any) => (
                        <div key={activity.id} className="relative pl-6">
                          <div className="absolute left-[-9px] top-2 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: '#E8192C' }} />
                          <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                            <h3 className="font-bold text-navy text-[15px] mb-1">{activity.title}</h3>
                            {activity.description && (
                              <p className="text-gray-500 text-[13px] leading-relaxed">{activity.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📅</p>
                <p className="font-semibold text-sm">No activities yet</p>
                <p className="text-xs mt-1">Add activities from the admin panel</p>
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
        </div>
      </section>
    </>
  )
}
