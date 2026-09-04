'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import type { Campaign } from '@/lib/types'

export default function CampaignPrompt() {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [visible, setVisible] = useState(false)

useEffect(() => {
  if (sessionStorage.getItem('campaign-prompt-dismissed')) return

  const supabase = createClient()
  supabase
    .from('campaigns')
    .select('*')
    .eq('published', true)
    .eq('show_prompt', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
    .then(({ data }) => {
      if (data) {
        setCampaign(data)
        setTimeout(() => setVisible(true), 1800)
      }
    })
}, [])
  
  function dismiss() {
    setVisible(false)
    sessionStorage.setItem('campaign-prompt-dismissed', '1')
  }

  if (!campaign) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(110%)' }}
    >
      <div className="max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ margin: '0 1rem 1rem' }}>
        <div
          className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5"
          style={{ backgroundColor: '#0D1B2A' }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: '#E8192C' }} />
          <div className="flex-1 min-w-0 pl-2">
            {campaign.hashtag && (
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#E8192C' }}>
                {campaign.hashtag}
              </p>
            )}
            <p className="font-headline font-black text-white text-lg leading-tight mb-1">
              {campaign.title}
            </p>
            {campaign.description && (
              <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                {campaign.description}
              </p>
            )}
            {campaign.event_date && (
              <p className="text-white/30 text-[11px] mt-1">
                {new Date(campaign.event_date).toLocaleDateString('en-US', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
                {campaign.event_location && ` · ${campaign.event_location}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                dismiss()
                window.location.href = `/campaigns/${campaign.slug}`
              }}
              className="text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#E8192C' }}
            >
              Learn More
            </button>
            <button
              onClick={dismiss}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
