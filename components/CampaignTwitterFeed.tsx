'use client'

import { useEffect, useRef } from 'react'

export default function CampaignTwitterFeed({ hashtag }: { hashtag: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const tag = hashtag.replace('#', '')

  useEffect(() => {
    const existing = document.getElementById('twitter-wjs')
    if (existing) {
      ;(window as any).twttr?.widgets?.load(ref.current)
      return
    }
    const script = document.createElement('script')
    script.id = 'twitter-wjs'
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)
  }, [tag])

  return (
    <div ref={ref} className="rounded-xl border border-gray-100 overflow-hidden" style={{ maxHeight: 600 }}>
      
        className="twitter-timeline"
        data-height="600"
        data-theme="light"
        href={`https://twitter.com/hashtag/${tag}?src=hash`}
      >
        Posts tagged #{tag}
      </a>
    </div>
  )
}
