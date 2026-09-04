import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCampaignStatus, STATUS_EYEBROW, STATUS_BADGE_STYLE } from '@/lib/campaigns'
import CampaignTwitterFeed from '@/components/CampaignTwitterFeed'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('campaigns').select('title, description, cover_image').eq('slug', params.slug).maybeSingle()
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
    <>
      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[400px]">
        <div className="flex flex-col justify-center p-12 text-white relative overflow-hidden" style={{ backgroundColor: '#E8192C' }}>
          <div className="absolute font-headline font-black text-white/10 text-[200px] leading-none -bottom-8 -left-4 select-none">M</div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-bold tracking-wider mb-2">
              {eyebrow}{campaign.hashtag ? ` · ${campaign.hashtag}` : ''}
            </p>
            <h1 className="font-headline text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
              {campaign.title}
            </h1>
            {campaign.description && (
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">{campaign.description}</p>
            )}
            {campaign.event_date && (
              <div className="mb-6">
                <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Event Date</p>
                <p className="text-white font-semibold text-sm">
                  {new Date(campaign.event_date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                {campaign.event_location && (
                  <p className="text-white/60 text-sm">{campaign.event_location}</p>
                )}
              </div>
            )}
            {(campaign.cta_primary_label || campaign.cta_secondary_label) && (
              <div className="flex gap-3 flex-wrap">
                {campaign.cta_primary_label && campaign.cta_primary_url && (
                  <Link href={campaign.cta_primary_url} className="bg-white font-semibold px-7 py-3 rounded text-sm hover:bg-white/90 transition-colors" style={{ color: '#E8192C' }}>
                    {campaign.cta_primary_label}
                  </Link>
                )}
                {campaign.cta_secondary_label && campaign.cta_secondary_url && (
                  <Link href={campaign.cta_secondary_url} className="border border-white/40 text-white px-7 py-3 rounded text-sm font-semibold hover:bg-white/10 transition-colors">
                    {campaign.cta_secondary_label}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {campaign.cover_image ? (
          <div className="relative overflow-hidden min-h-[300px]">
            <Image src={campaign.cover_image} alt={campaign.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
            <span className="font-headline text-white/5 text-[160px] font-black">#</span>
          </div>
        )}
      </section>

      {/* Three-column body */}
      <div className="max-w-[1280px] mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[200px_1fr_300px] gap-10 items-start">

        {/* Left: quick facts */}
        <aside className="md:sticky md:top-6 space-y-4 order-2 md:order-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full mb-4"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              {badge.label}
            </span>
            {campaign.event_date && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Event Date</p>
                <p className="text-sm font-semibold text-navy">
                  {new Date(campaign.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}
            {campaign.event_location && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Location</p>
                <p className="text-sm text-gray-600">{campaign.event_location}</p>
              </div>
            )}
            {campaign.hashtag && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Hashtag</p>
                <p className="text-sm font-semibold" style={{ color: '#E8192C' }}>{campaign.hashtag}</p>
              </div>
            )}
          </div>

          {(campaign.cta_primary_label || campaign.cta_secondary_label) && (
            <div className="space-y-2">
              {campaign.cta_primary_label && campaign.cta_primary_url && (
                <Link
                  href={campaign.cta_primary_url}
                  className="block text-center text-white font-semibold px-4 py-2.5 rounded text-sm"
                  style={{ backgroundColor: '#E8192C' }}
                >
                  {campaign.cta_primary_label}
                </Link>
              )}
              {campaign.cta_secondary_label && campaign.cta_secondary_url && (
                <Link
                  href={campaign.cta_secondary_url}
                  className="block text-center border border-gray-200 text-navy font-semibold px-4 py-2.5 rounded text-sm hover:bg-gray-50"
                >
                  {campaign.cta_secondary_label}
                </Link>
              )}
            </div>
          )}
        </aside>

        {/* Center: article content */}
        <main className="order-1 md:order-2 min-w-0">
          {campaign.content && (
            <div
              className="article-content prose max-w-none text-[15px] leading-relaxed text-gray-600"
              dangerouslySetInnerHTML={{ __html: campaign.content }}
            />
          )}
        </main>

        {/* Right: timeline + social + media kit */}
        <aside className="md:sticky md:top-6 space-y-6 order-3">
          {sortedMilestones.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-headline text-base font-bold text-navy mb-4">Timeline</h2>
              <div className="relative pl-5 space-y-5 max-h-[420px] overflow-y-auto pr-1">
                <div className="absolute left-[4px] top-1 bottom-1 w-px bg-gray-200" />
                {sortedMilestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-[21px] top-1 w-2 h-2 rounded-full border-2 border-white"
                      style={{ backgroundColor: '#E8192C' }}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">
                      {new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <h3 className="font-semibold text-navy text-sm mb-1 leading-snug">{m.title}</h3>
                    {m.description && (
                      <p className="text-xs text-gray-500 leading-relaxed">{m.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {campaign.hashtag && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-headline text-base font-bold text-navy mb-4">On social</h2>
              <CampaignTwitterFeed hashtag={campaign.hashtag} />
            </div>
          )}

          {campaign.media_kit_url && (
            <a
              href={campaign.media_kit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-300 transition-colors"
            >
              <h2 className="font-headline text-base font-bold text-navy mb-1">Media kit</h2>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">Logos, photos, and factsheet for this campaign</p>
              <span className="text-xs font-semibold" style={{ color: '#E8192C' }}>Download →</span>
            </a>
          )}
        </aside>
      </div>

      {/* Related campaigns */}
      {related && related.length > 0 && (
        <section className="border-t border-gray-100 py-12 px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline text-2xl font-bold text-navy mb-6">More Campaigns</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((c) => (
                <Link key={c.id} href={`/campaigns/${c.slug}`} className="group">
                  <div className="rounded-xl overflow-hidden aspect-video mb-3 relative" style={{ backgroundColor: '#E8192C' }}>
                    {c.cover_image && <Image src={c.cover_image} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                  </div>
                  {c.hashtag && <p className="text-xs font-bold mb-1" style={{ color: '#E8192C' }}>{c.hashtag}</p>}
                  <h3 className="font-bold text-navy text-sm uppercase leading-snug group-hover:text-red transition-colors">{c.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
