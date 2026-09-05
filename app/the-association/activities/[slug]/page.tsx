export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import EventCountdown from '@/components/EventCountdown'
import type { Activity } from '@/lib/types'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('activities').select('title, description').eq('slug', params.slug).maybeSingle()
  return {
    title: data?.title ?? 'Event',
    description: data?.description ?? '',
  }
}

export default async function ActivityDetailPage({ params }: Props) {
  const supabase = createClient()
  const { data } = await supabase
    .from('activities')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()

  if (!data) notFound()
  const activity = data as Activity

  const sortedUpdates = [...(activity.updates ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-16">
        <AssociationSidebar />
        <div className="flex-1 min-w-0 max-w-[860px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8192C] block mb-1">
            {activity.year} · Event
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 mb-4">
            {activity.title}
          </h1>

          {(activity.event_date || activity.venue) && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600 mb-6 pb-6 border-b border-gray-100">
              {activity.event_date && (
                <span>
                  {new Date(activity.event_date).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  })}
                  {' at '}
                  {new Date(activity.event_date).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit',
                  })}
                </span>
              )}
              {activity.venue && <span>{activity.venue}</span>}
            </div>
          )}

          {activity.event_date && (
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Countdown</p>
              <EventCountdown eventDate={activity.event_date} />
            </div>
          )}

          {activity.description && (
            <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-line mb-10">
              {activity.description}
            </p>
          )}

          {sortedUpdates.length > 0 && (
            <div>
              <h2 className="font-headline text-xl font-bold text-slate-900 mb-5">Updates</h2>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-200" />
                {sortedUpdates.map((u, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ backgroundColor: '#E8192C' }}
                    />
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                      {new Date(u.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{u.title}</h3>
                    {u.description && (
                      <p className="text-sm text-gray-500 leading-relaxed">{u.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
