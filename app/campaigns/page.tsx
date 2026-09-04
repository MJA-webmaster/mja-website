export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCampaignStatus, STATUS_DOT_COLOR } from '@/lib/campaigns'
import type { Campaign } from '@/lib/types'
import CampaignsBrowser from '@/components/CampaignsBrowser'

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
                const initial = campaign.title.trim().charAt(0).toUpperCase()

                const label = (
                  <Link
                    href={`/campaigns/${campaign.slug}`}
                    className={`group block absolute left-1/2 -translate-x-1/2 w-48 text-center ${
                      isTop ? 'bottom-[calc(50%+34px)]' : 'top-[calc(50%+34px)]'
                    }`}
                  >
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
                )

                return (
                  <div key={campaign.id} className="relative flex-shrink-0" style={{ width: 220 }}>
                    {isTop && label}

                    <Link
                      href={`/campaigns/${campaign.slug}`}
                      className="group block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <div
                        className="rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                        style={{ width: 48, height: 48, border: `2px solid ${dotColor}`, boxShadow: `0 0 0 2px ${dotColor}22` }}
                      >
                        {campaign.cover_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={campaign.cover_image}
                            alt={campaign.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-300"
                          />
                        ) : (
                          <span className="font-headline font-black text-sm" style={{ color: dotColor }}>{initial}</span>
                        )}
                      </div>
                    </Link>

                    {!isTop && label}
                  </div>
                )
              })}
            </div>
          </div>

          <CampaignsBrowser campaigns={campaigns!} />
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📢</p>
          <p className="font-semibold">No campaigns yet</p>
          <p className="text-sm mt-1">Campaigns will appear here once published</p>
        </div>
      )}
    </div>
  )
}
