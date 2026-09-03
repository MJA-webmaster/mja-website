'use client'

import { useState } from 'react'

interface Props {
  /** 'light' (default) is for white/off-white backgrounds; 'dark' is for the navy footer */
  variant?: 'light' | 'dark'
  /** Smaller footprint for tight spaces like the footer */
  compact?: boolean
}

export default function NewsletterForm({ variant = 'light', compact = false }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Subscribe failed')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  const isDark = variant === 'dark'

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex border rounded overflow-hidden ${compact ? 'max-w-sm' : 'max-w-xl'}`}
      style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#E5E7EB' }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className={`flex-1 min-w-0 text-sm focus:outline-none ${compact ? 'px-3.5 py-2.5' : 'px-5 py-4'}`}
        style={{
          backgroundColor: isDark ? 'transparent' : 'white',
          color: isDark ? 'white' : '#0D1B2A',
        }}
        disabled={status === 'loading' || status === 'success'}
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className={`bg-red text-white font-bold tracking-widest uppercase hover:bg-red-dark transition-colors disabled:opacity-60 whitespace-nowrap ${
          compact ? 'px-4 py-2.5 text-[10px]' : 'px-8 py-4 text-xs'
        }`}
      >
        {status === 'loading' ? '...' : status === 'success' ? 'Subscribed ✓' : 'Subscribe'}
      </button>
    </form>
  )
}
