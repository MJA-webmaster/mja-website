import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCampaignStatus, STATUS_EYEBROW, STATUS_BADGE_STYLE } from '@/lib/campaigns'
import CampaignTwitterFeed from '@/components/CampaignTwitterFeed'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('campaigns')
    .select('title, description, cover_image')
    .eq('slug', params.slug)
    .maybeSingle()

  return {
    title: data?.title ?? 'Campaign',
    description: data?.description ?? '',
    openGraph: {
      title: data?.title ?? 'Campaign',
      description: data?.description ?? '',
      images: data?.cover_image ? [{ url: data.cover_image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data?.title ?? 'Campaign',
      description: data?.description ?? '',
      images: data?.cover_image ? [data.cover_image] : undefined,
    },
  }
}

export default async function CampaignPage({ params }: Props) {
  const supabase = createClient()
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()

  if (!campaign) notFound()

  const { data: related } = await supabase
    .from('campaigns')
    .select('*')
    .eq('published', true)
    .neq('id', campaign.id)
    .limit(3)

  const status = getCampaignStatus(campaign)
  const eyebrow = STATUS_EYEBROW[status]
  const badge = STATUS_BADGE_STYLE[status]
  const milestones = (campaign.milestones ?? []) as { date: string; title: string; description?: string }[]
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* 1. Full Image Hero with Black Gradient Overlay */}
      <section className="relative min-h-[460px] md:min-h-[520px] flex items-end bg-black text-white overflow-hidden">
        {campaign.cover_image && (
          <Image
            src={campaign.cover_image}
            alt={campaign.title}
            fill
            priority
            className="object-cover object-center opacity-65"
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 py-12 md:py-16 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded"
                style={{ backgroundColor: badge.bg, color: badge.text }}
              >
                {eyebrow}
              </span>
              {campaign.hashtag && (
                <span className="text-white/80 text-xs font-semibold tracking-wide">
                  {campaign.hashtag}
                </span>
              )}
            </div>

            <h1 className="font-headline text-4xl sm:text-6xl font-black uppercase leading-[1.05] tracking-tight mb-4 text-white">
              {campaign.title}
            </h1>

            {campaign.description && (
              <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-6 font-normal max-w-2xl">
                {campaign.description}
              </p>
            )}

            {(campaign.cta_primary_label || campaign.cta_secondary_label) && (
              <div className="flex gap-3 flex-wrap pt-2">
                {campaign.cta_primary_label && campaign.cta_primary_url && (
                  <Link
                    href={campaign.cta_primary_url}
                    className="bg-[#E8192C] text-white font-bold px-7 py-3 rounded text-sm hover:bg-[#c91424] transition-colors shadow-md"
                  >
                    {campaign.cta_primary_label}
                  </Link>
                )}
                {campaign.cta_secondary_label && campaign.cta_secondary_url && (
                  <Link
                    href={campaign.cta_secondary_url}
                    className="border border-white/50 text-white px-7 py-3 rounded text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    {campaign.cta_secondary_label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Horizontal Timeline Rail */}
      {sortedMilestones.length > 0 && (
        <section className="bg-white border-b border-gray-200 shadow-xs py-7 overflow-hidden">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-400">
                Key Timeline
              </h2>
              <span className="text-[11px] text-gray-400 font-medium">Scroll to explore →</span>
            </div>

            <div className="overflow-x-auto pb-4 pt-2 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
              <div className="inline-flex gap-8 relative min-w-full">
                {/* Connecting track line */}
                <div className="absolute top-[6px] left-2 right-2 h-[2px] bg-gray-200" />

                {sortedMilestones.map((m, i) => (
                  <div key={i} className="relative w-[280px] sm:w-[320px] shrink-0 snap-start pt-5">
                    {/* Node Dot */}
                    <div
                      className="absolute top-0.5 left-0 w-3 h-3 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: '#E8192C' }}
                    />

                    <time className="block text-[11px] font-bold uppercase tracking-wider text-[#E8192C] mb-1">
                      {new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1">
                      {m.title}
                    </h3>
                    {m.description && (
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {m.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. 66:33 Content Grid */}
      <div className="max-w-[1240px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: 66% (8 cols) - Statement followed directly by Twitter Feed */}
          <div className="lg:col-span-8 space-y-10">
            {campaign.content && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-10 shadow-xs">
                <article
                  className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed prose-headings:font-headline prose-headings:font-bold prose-a:text-[#E8192C] prose-strong:text-slate-900 prose-li:my-1.5"
                  dangerouslySetInnerHTML={{ __html: campaign.content }}
                />
              </div>
            )}

            {campaign.hashtag && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                  <h2 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-400">
                    Live Feed · {campaign.hashtag}
                  </h2>
                  <span className="text-xs text-[#E8192C] font-semibold">Latest Posts</span>
                </div>
                <CampaignTwitterFeed hashtag={campaign.hashtag} />
              </div>
            )}
          </div>

          {/* Right: 33% (4 cols) - Media Kit & Quick Facts */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Media Kit Card */}
            {campaign.media_kit_url && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                <h3 className="font-headline text-base font-bold text-slate-900 mb-1">
                  Media Kit & Assets
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-5">
                  Download high-resolution photos, official statements, and press campaign kits.
                </p>
                <a
                  href={campaign.media_kit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
                >
                  Download Media Kit ↓
                </a>
              </div>
            )}

            {/* Campaign Metadata Details */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-100">
                Campaign Info
              </h3>
              
              {campaign.event_date && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Event Date</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {new Date(campaign.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}

              {campaign.event_location && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Location</span>
                  <span className="text-sm font-semibold text-slate-900">{campaign.event_location}</span>
                </div>
              )}

              {campaign.hashtag && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Official Hashtag</span>
                  <span className="text-sm font-bold text-[#E8192C]">{campaign.hashtag}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* 4. Related Campaigns */}
      {related && related.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-14 px-6 mt-12">
          <div className="max-w-[1240px] mx-auto">
            <h2 className="font-headline text-lg font-bold text-slate-900 uppercase tracking-tight mb-6">
              More Campaigns
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((c) => (
                <Link key={c.id} href={`/campaigns/${c.slug}`} className="group block">
                  <div className="aspect-video relative bg-slate-900 rounded-xl overflow-hidden mb-3">
                    {c.cover_image && (
                      <Image
                        src={c.cover_image}
                        alt={c.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  {c.hashtag && (
                    <p className="text-[10px] font-bold text-[#E8192C] uppercase tracking-wider mb-1">
                      {c.hashtag}
                    </p>
                  )}
                  <h3 className="font-bold text-slate-900 text-sm uppercase leading-snug group-hover:text-[#E8192C] transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
