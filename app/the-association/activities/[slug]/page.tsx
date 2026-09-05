export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AssociationSidebar from '@/components/AssociationSidebar'
import EventCountdown from '@/components/EventCountdown'
import EventGallery from '@/components/EventGallery'
import EventShare from '@/components/EventShare'
import EventCalendarWidget from '@/components/EventCalendarWidget'
import AddToCalendarButton from '@/components/AddToCalendarButton'
import CampaignTwitterFeed from '@/components/CampaignTwitterFeed'
import type { Activity } from '@/lib/types'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('activities').select('title, description').eq('slug', params.slug).maybeSingle()
  return { title: data?.title ?? 'Event', description: data?.description ?? '' }
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

  const { data: allEventsRaw } = await supabase
    .from('activities')
    .select('id, title, slug, event_date, venue')
    .eq('published', true)
    .not('event_date', 'is', null)
    .order('event_date', { ascending: true })

  const allEvents = allEventsRaw ?? []

  const { data: allActivitiesWithUpdates } = await supabase
    .from('activities')
    .select('id, title, slug, updates')
    .eq('published', true)

  const allMoments = (allActivitiesWithUpdates ?? []).flatMap((a: any) =>
    (a.updates ?? []).map((u: any, i: number) => ({
      id: `${a.id}-${i}`,
      title: u.title,
      date: u.date,
      parentSlug: a.slug,
      parentTitle: a.title,
    }))
  )

  const sortedUpdates = [...(activity.updates ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const eventUrl = `https://mja.mv/the-association/activities/${activity.slug}`

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-14 items-start">
        <AssociationSidebar />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8192C] block mb-1">
              {activity.year} · Event
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
              {activity.title}
            </h1>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

            {/* Cover image — spans 2 cols on larger screens */}
            {activity.cover_image && (
              <div className="sm:col-span-2 relative rounded-xl overflow-hidden aspect-video sm:aspect-[16/9] bg-gray-100">
                <Image src={activity.cover_image} alt={activity.title} fill className="object-cover" />
              </div>
            )}

            {/* Countdown + register + calendar + share */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-5 flex flex-col justify-between gap-4">
              {activity.event_date ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Countdown</p>
                  <EventCountdown eventDate={activity.event_date} />
                </div>
              ) : (
                <p className="text-sm text-gray-400">Date to be announced</p>
              )}
              <div className="flex flex-col gap-2">
                {activity.registration_url && (
                  <Link
                    href={activity.registration_url}
                    target="_blank"
                    className="text-center text-white font-semibold px-4 py-2.5 rounded-lg text-sm"
                    style={{ backgroundColor: '#E8192C' }}
                  >
                    Register for Event
                  </Link>
                )}
                {activity.event_date && (
                  <AddToCalendarButton
                    title={activity.title}
                    description={activity.description ?? undefined}
                    location={activity.venue ?? undefined}
                    startDate={activity.event_date}
                  />
                )}
                <EventShare title={activity.title} url={eventUrl} />
              </div>
            </div>

            {/* Date/venue facts */}
            {(activity.event_date || activity.venue) && (
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 space-y-3">
                {activity.event_date && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Date & Time</p>
                    <p className="text-sm font-semibold text-navy">
                      {new Date(activity.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                )}
                {activity.venue && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Venue</p>
                    <p className="text-sm font-semibold text-navy">{activity.venue}</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {activity.description && (
              <div className="sm:col-span-2 lg:col-span-2 bg-white rounded-xl border border-gray-200/80 p-5">
                <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-line">{activity.description}</p>
              </div>
            )}

            {/* Calendar widget */}
            {activity.event_date && (
              <div className="sm:col-span-2 lg:col-span-3">
                <EventCalendarWidget currentEventId={activity.id} allEvents={allEvents} moments={allMoments} />
              </div>
            )}

            {/* Gallery */}
            {activity.gallery?.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200/80 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Gallery</p>
                <EventGallery images={activity.gallery} />
              </div>
            )}

            {/* Tweets */}
            {activity.tweet_urls?.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200/80 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">On Social</p>
                <CampaignTwitterFeed tweetUrls={activity.tweet_urls} />
              </div>
            )}

            {/* Media kit */}
            {activity.media_kit_url && (
              <Link
                href={activity.media_kit_url}
                target="_blank"
                className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200/80 p-5 hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEE2E2' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" className="w-5 h-5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">Media Kit</p>
                  <p className="text-xs text-gray-400">Photos & press assets</p>
                </div>
              </Link>
            )}

            {/* Updates */}
            {sortedUpdates.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200/80 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Updates</p>
                <div className="relative pl-6 space-y-5">
                  <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-200" />
                  {sortedUpdates.map((u, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: '#E8192C' }} />
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                        {new Date(u.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 className="font-semibold text-navy text-sm mb-1">{u.title}</h3>
                      {u.description && <p className="text-sm text-gray-500 leading-relaxed">{u.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
