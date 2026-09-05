'use client'

import { useState } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

export default function EventShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 text-navy hover:bg-gray-50 transition-colors"
    >
      {copied ? <Check size={16} /> : navigator?.share ? <Share2 size={16} /> : <Link2 size={16} />}
      {copied ? 'Link copied' : 'Share Event'}
    </button>
  )
}
