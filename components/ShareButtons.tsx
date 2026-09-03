'use client'

import { useState } from 'react'

interface Props {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shares = [
    {
      label: 'Facebook',
      bg: '#1877F2',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank', 'noopener,noreferrer,width=600,height=400'),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: 'X',
      bg: '#000000',
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`, '_blank', 'noopener,noreferrer,width=600,height=400'),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      bg: '#25D366',
      onClick: () => window.open(`https://wa.me/?text=${encodedTitle}%20${encoded}`, '_blank', 'noopener,noreferrer'),
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.522 5.847L.057 23.25l5.565-1.451A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.715 9.715 0 0 1-4.953-1.354l-.355-.211-3.676.959.983-3.574-.232-.368A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center gap-3 py-6 border-t border-gray-100 mt-8">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-1">Share</span>
      {shares.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={s.onClick}
          aria-label={`Share on ${s.label}`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: s.bg }}
        >
          {s.icon}
          <span className="hidden sm:inline">{s.label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 transition-colors"
        style={{
          backgroundColor: copied ? 'rgba(16,185,129,0.08)' : 'white',
          color: copied ? '#059669' : '#6B7280',
          borderColor: copied ? '#059669' : '#E5E7EB',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          {copied
            ? <polyline points="20 6 9 17 4 12" />
            : <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>
          }
        </svg>
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy link'}</span>
      </button>
    </div>
  )
}
