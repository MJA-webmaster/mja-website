export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { 
  title: 'Our Activities | Maldives Journalists Association' 
}

type Activity = {
  id: string
  title: string
  description: string | null
  year: number
  order: number
}

export default async function ActivitiesPage() {
  const supabase = createClient()
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .order('year', { ascending: false })
    .order('order', { ascending: true })

  const typedActivities = (activities ?? []) as Activity[]

  // Group activities by year
  const grouped = typedActivities.reduce((acc, a) => {
    if (!acc[a.year]) acc[a.year] = []
    acc[a.year].push(a)
    return acc
  }, {} as Record<number, Activity[]>)

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-14 items-start">
        {/* Navigation Sidebar */}
        <AssociationSidebar />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="border-b border-slate-200/80 pb-6 mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8192C] block mb-1">
              Archive & Initiatives
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
              Our <span className="text-[#E8192C]">Activities</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Key workshops, campaigns, press rallies, and advocacy efforts organized by the association.
            </p>
          </div>

          {years.length > 0 ? (
            <div className="space-y-12">
              {years.map((year) => (
                <section key={year} className="relative">
                  {/* Sticky/Prominent Year Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {year}
                      </span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                        {grouped[year].length} {grouped[year].length === 1 ? 'event' : 'events'}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-slate-200/70" />
                  </div>

                  {/* Activity Grid / Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    {grouped[year].map((activity, idx) => (
                      <article 
                        key={activity.id} 
                        className="group bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex items-start gap-4"
                      >
                        {/* Numerical accent / sequence counter */}
                        <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-400 group-hover:text-[#E8192C] group-hover:bg-rose-50 transition-colors mt-0.5">
                          {String(idx + 1).padStart(2, '0')}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-[#E8192C] transition-colors mb-1.5">
                            {activity.title}
                          </h3>
                          {activity.description && (
                            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl whitespace-pre-line">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
              <p className="font-semibold text-sm text-slate-600 mb-1">No activities recorded yet</p>
              <p className="text-xs">Entries added via the admin panel will appear here chronologically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
