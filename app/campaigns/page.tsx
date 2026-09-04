export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getCampaignStatus, STATUS_BADGE_STYLE, STATUS_DOT_COLOR } from '@/lib/campaigns'
import type { Campaign } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'MJA campaigns for press freedom across the Maldives.',
}

export default async function CampaignsPage() {
  const supabase = createClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const timelineItems = campaigns
    ? [...campaigns].sort((a, b) => {
        const dateA = new Date(a.event_date || a.created_at).getTime()
        const dateB = new Date(b.event_date || b.created_at).getTime()
        return dateA - dateB
      })
    : []

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <h1 className="font-headline text-5xl font-black uppercase mb-10" style={{ color: '#0D1B2A' }}>
          <span style={{ color: '#E8192C' }}>MJA</span> Campaigns
        </h1>

        {timelineItems.length > 0 ? (
          <>
            {/* Timeline hero */}
            <div className="overflow-x-auto pb-4 mb-16 -mx-6 px-6">
              <div className="relative flex items-center min-w-max" style={{ minHeight: 260 }}>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200" />
                {timelineItems.map((campaign: Campaign, i: number) => {
                  const status = getCampaignStatus(campaign)
                  const isTop = i % 2 === 0
                  const dotColor = STATUS_DOT_COLOR[status]
                  return (
                    <div key={campaign.id} className="relative flex-shrink-0" style={{ width: 220 }}>
                      {isTop && (
                        <Link href={`/campaigns/${campaign.slug}`} className="group block absolute left-1/2 -translate-x-1/2 bottom-[calc(50%+22px)] w-48 text-center">
                          {status === 'active' && (
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: dotColor }}>Active now</p>
                          )}
                          <p className="font-headline font-bold text-navy text-sm uppercase leading-snug group-hover:text-red transition-colors">
                            {campaign.title}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {new Date(campaign.event_date || campaign.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </Link>
                      )}

                      <Link href={`/campaigns/${campaign.slug}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <span
                          className="flex items-center justify-center rounded-full border-2 border-white"
                          style={{ width: 20, height: 20, backgroundColor: dotColor, boxShadow: '0 0 0 2px ' + dotColor + '33' }}
                        />
                      </Link>

                      {!isTop && (
                        <Link href={`/campaigns/${campaign.slug}`} className="group block absolute left-1/2 -translate-x-1/2 top-[calc(50%+22px)] w-48 text-center">
                          {status === 'active' && (
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: dotColor }}>Active now</p>
                          )}
                          <p className="font-headline font-bold text-navy text-sm uppercase leading-snug group-hover:text-red transition-colors">
                            {campaign.title}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {new Date(campaign.event_date || campaign.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Campaign cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {campaigns!.map((campaign: Campaign) => {
                const status = getCampaignStatus(campaign)
                const badge = STATUS_BADGE_STYLE[status]
                return (
                  <Link key={campaign.id} href={`/campaigns/${campaign.slug}`} className="group block">
                    <div className="rounded-xl overflow-hidden mb-4 aspect-video bg-gray-100 relative">
                      {campaign.cover_image ? (
                        <Image
                          src={campaign.cover_image}
                          alt={campaign.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#E8192C' }}>
                          <span className="font-headline text-white/20 text-6xl font-black">#</span>
                        </div>
                      )}
                      <span
                        className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    {campaign.hashtag && (
                      <p className="text-xs font-bold mb-1" style={{ color: '#E8192C' }}>{campaign.hashtag}</p>
                    )}
                    <h3 className="font-headline font-bold text-navy text-lg uppercase leading-snug group-hover:text-red transition-colors">
                      {campaign.title}
                    </h3>
                    {campaign.event_date && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(campaign.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                    {(campaign.cta_primary_label || campaign.cta_secondary_label) && (
                      <div className="flex gap-2 mt-3">
                        {campaign.cta_primary_label && (
                          <span className="text-xs font-semibold px-3 py-1.5 rounded text-white" style={{ backgroundColor: '#E8192C' }}>
                            {campaign.cta_primary_label}
                          </span>
                        )}
                        {campaign.cta_secondary_label && (
                          <span className="text-xs font-semibold px-3 py-1.5 rounded border border-gray-200 text-navy">
                            {campaign.cta_secondary_label}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📢</p>
            <p className="font-semibold">No campaigns yet</p>
            <p className="text-sm mt-1">Campaigns will appear here once published</p>
          </div>
        )}
      </div>
    </>
  )
}
