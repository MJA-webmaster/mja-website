'use client'

import { useEffect, useRef } from 'react'

export default function CampaignTwitterFeed({ tweetUrls }: { tweetUrls: string[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || tweetUrls.length === 0) return

    el.innerHTML = tweetUrls
      .map(
        (url) =>
          '<blockquote class="twitter-tweet" data-theme="light">' +
          '<a href="' + url + '"></a>' +
          '</blockquote>'
      )
      .join('')

    function loadWidgets() {
      ;(window as any).twttr?.widgets?.load(el)
    }

    const existingScript = document.getElementById('twitter-wjs') as HTMLScriptElement | null
    if (existingScript) {
      if ((window as any).twttr?.widgets) {
        loadWidgets()
      } else {
        existingScript.addEventListener('load', loadWidgets, { once: true })
      }
      return
    }

    const script = document.createElement('script')
    script.id = 'twitter-wjs'
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.onload = loadWidgets
    document.body.appendChild(script)
  }, [tweetUrls])

  if (tweetUrls.length === 0) return null

  return <div ref={ref} className="space-y-4" />
}
