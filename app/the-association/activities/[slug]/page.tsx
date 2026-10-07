export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const TZ = 'Indian/Maldives'
const SITE_URL = 'https://mja.mv'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TZ,
  })
}

// Date-only entries are saved as 00:00 UTC, so treat that as "no time set"
function formatTime(iso: string) {
  const d = new Date(iso)
  if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return null
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  })
}

// Single line of plain text for share previews
function toPreviewText(text: string | null | undefined, max = 160) {
  if (!text) return ''
  const clean = text.replace(/^[-•*]\s+/gm, '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean
}

function RichText({ text }: { text: string }) {
  const blocks: { type: 'p' | 'ul'; lines: string[] }[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const match = line.match(/^[-•*]\s+(.*)$/)
    const type = match ? 'ul' : 'p'
    const content = match ? match[1] : line
    const last = blocks[blocks.length - 1]
    if (type === 'ul' && last?.type === 'ul') last.lines.push(content)
    else blocks.push({ type, lines: [content] })
  }

  return (
    <div className="space-y-3 text-slate-600 text-[15px] leading-relaxed">
      {blocks.map((b, i) =>
        b.type === 'ul' ? (
          <ul key={i} className="list-disc pl-5 space-y-1.5 marker:text-[#E8192C]">
            {b.lines.map((l, j) => (
              <li key={j}>{l}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{b.lines[0]}</p>
        )
      )}
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (UUID_RE.test(params.slug)) return { title: 'Event' }

  const supabase = createClient()
  const { data } = await supabase
    .from('activities')
    .select('title, slug, description, cover_image, gallery')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()

  if (!data) return { title: 'Event' }

  const url = `${SITE_URL}/the-association/activities/${data.slug}`
  const description =
    toPreviewText(data.description) || 'An event by the Maldives Journalists Association.'
  const image = data.cover_image || data.gallery?.[0] || DEFAULT_OG_IMAGE

  return {
    title: data.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: 'MJA',
      locale: 'en_US',
      url,
      title: data.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description,
      images: [image],
    },
  }
}

export default async function ActivityDetailPage({ params }: Props) {
  const supabase = createClient()

  // Old links used the activity ID. Send them to the slug URL.
  if (UUID_RE.test(params.slug)) {
    const { data: byId } = await supabase
      .from('activities')
      .select('slug')
      .eq('id', params.slug)
      .eq('published', true)
      .maybeSingle()
    if (byId?.slug) redirect(`/the-association/activities/${byId.slug}`)
    notFound()
  }

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

  const eventUrl = `${SITE_URL}/the-association/activities/${activity.slug}`
  const timeLabel = activity.event_date ? formatTime(activity.event_date) : null

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="md:flex md:gap-14 items-start">
        <AssociationSidebar />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8192C] block mb-1">
              {activity.year} · Event
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
              {activity.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            {/* Main column */}
            <div className="space-y-6 min-w-0">
              {activity.cover_image && (
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
                  <Image
                    src={activity.cover_image}
                    alt={activity.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              {activity.description && (
                <div className="bg-white rounded-xl border border-gray-200/80 p-6">
                  <RichText text={activity.description} />
                </div>
              )}

              {activity.gallery?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Gallery</p>
                  <EventGallery images={activity.gallery} />
                </div>
              )}

              {activity.tweet_urls?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">On Social</p>
                  <CampaignTwitterFeed tweetUrls={activity.tweet_urls} />
                </div>
              )}

              {sortedUpdates.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Updates</p>
                  <div className="relative pl-6 space-y-5">
                    <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-200" />
                    {sortedUpdates.map((u, i) => (
                      <div key={i} className="relative">
                        <div
                          className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: '#E8192C' }}
                        />
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                          {new Date(u.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            timeZone: TZ,
                          })}
                        </p>
                        <h3 className="font-semibold text-navy text-sm mb-1">{u.title}</h3>
                        {u.description && (
                          <p className="text-sm text-gray-500 leading-relaxed">{u.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side column */}
            <aside className="order-first lg:order-none space-y-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-xl border border-gray-200/80 p-5 space-y-5">
                {activity.event_date ? (
                  <>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Countdown</p>
                      <EventCountdown eventDate={activity.event_date} />
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Date</p>
                        <p className="text-sm font-semibold text-navy">{formatDate(activity.event_date)}</p>
                        {timeLabel && <p className="text-sm text-gray-500">{timeLabel}</p>}
                      </div>
                      {activity.venue && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Venue</p>
                          <p className="text-sm font-semibold text-navy">{activity.venue}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm text-gray-400">Date to be announced</p>
                    {activity.venue && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Venue</p>
                        <p className="text-sm font-semibold text-navy">{activity.venue}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
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

              {activity.media_kit_url && (
                <Link
                  href={activity.media_kit_url}
                  target="_blank"
                  className="bg-white rounded-xl border border-gray-200/80 p-4 hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#FEE2E2' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" className="w-5 h-5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">Media Kit</p>
                    <p className="text-xs text-gray-400">Photos & press assets</p>
                  </div>
                </Link>
              )}
            </aside>
          </div>

          {/* Calendar */}
          {activity.event_date && (
            <div className="mt-8">
              <EventCalendarWidget currentEventId={activity.id} allEvents={allEvents} moments={allMoments} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
