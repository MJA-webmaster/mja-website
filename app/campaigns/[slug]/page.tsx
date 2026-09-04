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
    <>
      {/* Hero Section */}
      <section className="bg-[#E8192C] text-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-12 min-h-[440px] items-end">
          
          {/* Hero Copy */}
          <div className="md:col-span-7 py-12 px-6 md:py-16 relative z-10 self-center">
            <div className="flex items-center gap-2 mb-3">
              <span 
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
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

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.05] tracking-tight mb-4">
              {campaign.title}
            </h1>

            {campaign.description && (
              <p className="text-white/90 text-base leading-relaxed mb-6 max-w-xl font-normal">
                {campaign.description}
              </p>
            )}

            {/* Event Meta Strip */}
            {campaign.event_date && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 pb-6 border-t border-white/20 text-xs text-white/80">
                <div>
                  <span className="uppercase text-white/50 font-bold tracking-wider block mb-0.5">Date</span>
                  <span className="font-semibold text-white">
                    {new Date(campaign.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                {campaign.event_location && (
                  <div>
                    <span className="uppercase text-white/50 font-bold tracking-wider block mb-0.5">Location</span>
                    <span className="font-semibold text-white">{campaign.event_location}</span>
                  </div>
                )}
              </div>
            )}

            {/* Call to Actions */}
            {(campaign.cta_primary_label || campaign.cta_secondary_label) && (
              <div className="flex gap-3 flex-wrap pt-2">
                {campaign.cta_primary_label && campaign.cta_primary_url && (
                  <Link 
                    href={campaign.cta_primary_url} 
                    className="bg-white font-bold px-6 py-3 rounded text-sm hover:bg-white/95 transition-all shadow-sm" 
                    style={{ color: '#E8192C' }}
                  >
                    {campaign.cta_primary_label}
                  </Link>
                )}
                {campaign.cta_secondary_label && campaign.cta_secondary_url && (
                  <Link 
                    href={campaign.cta_secondary_url} 
                    className="border border-white/40 text-white px-6 py-3 rounded text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    {campaign.cta_secondary_label}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Hero Visual */}
          <div className="md:col-span-5 relative h-full min-h-[360px] md:min-h-[440px] flex items-end justify-center">
            {campaign.cover_image ? (
              <Image 
                src={campaign.cover_image} 
                alt={campaign.title} 
                fill 
                priority
                className="object-contain object-bottom" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/10">
                <span className="font-headline text-white/10 text-9xl font-black">#</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
        
        {/* Left: Campaign Editorial Article */}
        <main className="min-w-0">
          {campaign.content ? (
            <article 
              className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-headline prose-headings:font-bold prose-a:text-[#E8192C] prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: campaign.content }}
            />
          ) : (
            <p className="text-gray-400 italic">No campaign overview available.</p>
          )}
        </main>

        {/* Right: Key Timeline & Supplementary Modules */}
        <aside className="space-y-6 lg:sticky lg:top-8">
          {sortedMilestones.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
              <h2 className="font-headline text-base font-bold text-slate-900 mb-5 pb-3 border-b border-gray-100 uppercase tracking-wide">
                Key Timeline
              </h2>
              <div className="relative pl-5 space-y-6">
                <div className="absolute left-[3px] top-1 bottom-1 w-[2px] bg-gray-100" />
                {sortedMilestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div 
                      className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]" 
                      style={{ backgroundColor: '#E8192C' }} 
                    />
                    <time className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      {new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug">{m.title}</h3>
                    {m.description && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{m.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {campaign.hashtag && (
            <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
              <h2 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Live Conversation
              </h2>
              <CampaignTwitterFeed hashtag={campaign.hashtag} />
            </div>
          )}

          {campaign.media_kit_url && (
            <a
              href={campaign.media_kit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-slate-50 border border-slate-200/80 rounded-xl p-5 hover:bg-slate-100 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Media Kit & Assets</h3>
                  <p className="text-xs text-gray-500 mt-0.5">High-res photos, statements, and brand kits</p>
                </div>
                <span className="text-sm font-semibold text-[#E8192C] group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </div>
            </a>
          )}
        </aside>
      </div>

      {/* Related Campaigns */}
      {related && related.length > 0 && (
        <section className="border-t border-gray-200/80 bg-gray-50/50 py-14 px-6 mt-12">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline text-xl font-bold text-slate-900 uppercase tracking-tight mb-6">
              Other Campaigns
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((c) => (
                <Link key={c.id} href={`/campaigns/${c.slug}`} className="group bg-white rounded-lg border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  <div className="aspect-video relative bg-slate-900 overflow-hidden">
                    {c.cover_image && (
                      <Image 
                        src={c.cover_image} 
                        alt={c.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    )}
                  </div>
                  <div className="p-4">
                    {c.hashtag && <p className="text-[11px] font-bold text-[#E8192C] uppercase tracking-wider mb-1">{c.hashtag}</p>}
                    <h3 className="font-bold text-slate-900 text-sm uppercase leading-snug group-hover:text-[#E8192C] transition-colors line-clamp-2">
                      {c.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
