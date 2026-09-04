import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCampaignStatus, STATUS_EYEBROW } from '@/lib/campaigns'
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
  const milestones = campaign.milestones ?? []

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

      {/* Content */}
      {campaign.content && (
        <section className="max-w-[800px] mx-auto px-6 py-14">
          <div
            className="article-content prose max-w-none text-[15px] leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{ __html: campaign.content }}
          />
        </section>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <section className="max-w-[800px] mx-auto px-6 pb-14">
          <h2 className="font-headline text-2xl font-bold text-navy mb-8">Timeline</h2>
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-200" />
            {[...milestones]
              .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((m: any, i: number) => (
                <div key={i} className="relative">
                  <div
                    className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: '#E8192C' }}
                  />
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                    {new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="font-headline font-bold text-navy text-base mb-1">{m.title}</h3>
                  {m.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">{m.description}</p>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Toolkit: media kit + hashtag feed */}
      {(campaign.media_kit_url || campaign.hashtag) && (
        <section className="border-t border-gray-100 py-14 px-6">
          <div className="max-w-[800px] mx-auto grid md:grid-cols-2 gap-8">
            {campaign.hashtag && (
              <div>
                <h2 className="font-headline text-xl font-bold text-navy mb-4">On social</h2>
                <CampaignTwitterFeed hashtag={campaign.hashtag} />
              </div>
            )}
            {campaign.media_kit_url && (
              <div>
                <h2 className="font-headline text-xl font-bold text-navy mb-4">Media kit</h2>
                <a
                  href={campaign.media_kit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-5 hover:border-gray-300 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-navy text-sm">Download press assets</p>
                    <p className="text-xs text-gray-400 mt-1">Logos, photos, and factsheet for this campaign</p>
                  </div>
                  <span style={{ color: '#E8192C' }}>→</span>
                </a>
              </div>
            )}
          </div>
        </section>
      )}

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
