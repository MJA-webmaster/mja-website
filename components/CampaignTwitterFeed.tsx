'use client'

import { useEffect, useRef } from 'react'

export default function CampaignTwitterFeed({ hashtag }: { hashtag: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const tag = hashtag.replace('#', '')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.innerHTML =
      '<a class="twitter-timeline" data-height="600" data-theme="light" ' +
      'href="https://twitter.com/hashtag/' + tag + '?src=hash">' +
      'Posts tagged #' + tag +
      '</a>'

    function loadWidget() {
      ;(window as any).twttr?.widgets?.load(el)
    }

    const existing = document.getElementById('twitter-wjs') as HTMLScriptElement | null
    if (existing) {
      loadWidget()
      return
    }

    const script = document.createElement('script')
    script.id = 'twitter-wjs'
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.onload = loadWidget
    document.body.appendChild(script)
  }, [tag])

  return (
    <div ref={ref} className="rounded-xl border border-gray-100 overflow-hidden" style={{ minHeight: 200 }} />
  )
}
