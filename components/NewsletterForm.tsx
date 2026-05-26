'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    const supabase = createClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })

    if (error) {
      setStatus(error.code === '23505' ? 'success' : 'error')
    } else {
      setStatus('success')
      setEmail('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl border border-gray-200 rounded overflow-hidden">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email here"
        className="flex-1 px-5 py-4 text-sm text-navy focus:outline-none"
        disabled={status === 'loading' || status === 'success'}
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="bg-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-red-dark transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? '...' : status === 'success' ? 'Subscribed ✓' : 'Newsletter'}
      </button>
    </form>
  )
}
