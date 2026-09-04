'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import type { Campaign } from '@/lib/types'
import { getCampaignStatus, STATUS_BADGE_STYLE } from '@/lib/campaigns'

const PAGE_SIZE = 9

export default function CampaignsBrowser({ campaigns }: { campaigns: Campaign[] }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return campaigns
    return campaigns.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      (c.hashtag ?? '').toLowerCase().includes(q) ||
      (c.description ?? '').toLowerCase().includes(q)
    )
  }, [campaigns, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full text-sm border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none text-navy"
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>

      {pageItems.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-semibold">No campaigns match "{query}"</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {pageItems.map((campaign) => {
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
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-sm font-semibold px-4 py-2 rounded border border-gray-200 text-navy disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-sm font-semibold px-4 py-2 rounded border border-gray-200 text-navy disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
