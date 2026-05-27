'use client'

import { useState } from 'react'

const subjects = [
  'General Inquiry',
  'Membership',
  'Press Inquiry',
  'Report a Case',
  'Partnership',
  'Other',
]

export default function ConnectForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(232,25,44,0.1)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2.5" className="w-8 h-8">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="font-headline text-xl font-bold text-navy mb-2">Message Sent!</h3>
        <p className="text-gray-400 text-sm">We'll get back to you as soon as possible.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Full Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required
            placeholder="Ahmed Mohamed"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-navy focus:outline-none"
            onFocus={(e) => e.target.style.borderColor = '#E8192C'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required
            placeholder="ahmed@example.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-navy focus:outline-none"
            onFocus={(e) => e.target.style.borderColor = '#E8192C'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Subject</label>
        <select name="subject" value={form.subject} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-navy focus:outline-none"
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        >
          {subjects.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Message *</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
          placeholder="Write your message here..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-navy focus:outline-none resize-none"
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm px-4 py-3 rounded-lg" style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.08)' }}>
          Something went wrong. Please try again.
        </p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full text-white py-4 rounded-lg font-bold text-sm tracking-wide disabled:opacity-60"
        style={{ backgroundColor: '#E8192C' }}>
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
