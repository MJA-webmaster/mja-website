'use client'

import { useState } from 'react'

const membershipTypes = [
  { value: 'local', label: 'Local Member', desc: 'For journalists based in the Maldives' },
  { value: 'international', label: 'International Member', desc: 'For journalists based outside the Maldives' },
  { value: 'contributor', label: 'Non-Member Contributor', desc: 'Support without full membership' },
]

export default function JoinForm() {
  const [type, setType] = useState('local')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    outlet: '',
    years: '',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...form }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      setLoading(false)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(232,25,44,0.1)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2.5" className="w-8 h-8">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="font-headline text-2xl font-bold text-navy mb-2">Application Received!</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Thank you for applying. Our team will review your application and get back to you within 3 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Membership type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
          Membership Type
        </label>
        <div className="space-y-2">
          {membershipTypes.map((t) => (
            <label
              key={t.value}
              className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
              style={{
                borderColor: type === t.value ? '#E8192C' : '#E5E7EB',
                backgroundColor: type === t.value ? 'rgba(232,25,44,0.03)' : 'white',
              }}
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="mt-0.5"
                style={{ accentColor: '#E8192C' }}
              />
              <div>
                <p className="text-sm font-semibold text-navy">{t.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Full Name *</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange} required
            placeholder="Ahmed Mohamed"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy"
            onFocus={(e) => e.target.style.borderColor = '#E8192C'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Email Address *</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange} required
            placeholder="ahmed@example.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy"
            onFocus={(e) => e.target.style.borderColor = '#E8192C'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Phone Number</label>
          <input
            type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder="+960 7XX XXXX"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy"
            onFocus={(e) => e.target.style.borderColor = '#E8192C'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Years in Journalism</label>
          <input
            type="number" name="years" value={form.years} onChange={handleChange}
            placeholder="e.g. 5" min="0"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy"
            onFocus={(e) => e.target.style.borderColor = '#E8192C'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Media Outlet / Organisation</label>
        <input
          type="text" name="outlet" value={form.outlet} onChange={handleChange}
          placeholder="e.g. Mihaaru, PSM, Avas..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy"
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Why do you want to join MJA?</label>
        <textarea
          name="message" value={form.message} onChange={handleChange} rows={4}
          placeholder="Tell us a bit about yourself and why you want to join..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy resize-none"
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        />
      </div>

      {error && (
        <p className="text-sm px-4 py-3 rounded-lg" style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.08)', border: '1px solid rgba(232,25,44,0.2)' }}>
          {error}
        </p>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full text-white py-4 rounded-lg font-bold text-sm tracking-wide transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#E8192C' }}
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        By submitting, you agree to MJA's membership terms and code of conduct.
      </p>
    </form>
  )
}
