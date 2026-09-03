'use client'

import { useState } from 'react'
import { Send, X } from 'lucide-react'

type Subscriber = {
  id: string
  email: string
  subscribed_at: string
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none'
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

export default function NewsletterClient({ subscribers, count }: { subscribers: Subscriber[]; count: number }) {
  const [showCompose, setShowCompose] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const allSelected = selected.size > 0 && selected.size === subscribers.length

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(subscribers.map((s) => s.id)))
  }
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function openCompose() {
    setResult(null)
    setError(null)
    setShowCompose(true)
  }
  function closeCompose() {
    setShowCompose(false)
    setSubject('')
    setMessage('')
    setError(null)
  }

  async function handleSend() {
    if (!subject || !message || selected.size === 0) return
    setSending(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, recipientIds: Array.from(selected) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send.')
      setResult(`Sent to ${data.sent} of ${data.total} recipients.`)
      setSubject('')
      setMessage('')
    } catch (e: any) {
      setError(e.message || 'Something went wrong.')
    }
    setSending(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Newsletter</h1>
          <p className="text-gray-400 text-sm mt-1">{count} subscribers</p>
        </div>
        <button
          onClick={openCompose}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}
        >
          <Send size={15} /> Compose Newsletter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4" style={{ backgroundColor: '#E8192C' }} />
          <p className="text-3xl font-headline font-bold text-navy">{count}</p>
          <p className="text-sm text-gray-400 mt-1">Total Subscribers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4 bg-teal-500" />
          <p className="text-3xl font-headline font-bold text-navy">
            {subscribers.filter((s) => {
              const date = new Date(s.subscribed_at)
              const thirtyDaysAgo = new Date()
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
              return date > thirtyDaysAgo
            }).length}
          </p>
          <p className="text-sm text-gray-400 mt-1">Last 30 Days</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4 bg-amber-500" />
          <p className="text-3xl font-headline font-bold text-navy">
            {subscribers.filter((s) => {
              const date = new Date(s.subscribed_at)
              const sevenDaysAgo = new Date()
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
              return date > sevenDaysAgo
            }).length}
          </p>
          <p className="text-sm text-gray-400 mt-1">Last 7 Days</p>
        </div>
      </div>

      {/* Compose panel */}
      {showCompose && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy">Compose Newsletter</h2>
            <button onClick={closeCompose} className="text-gray-400 text-lg"><X size={18} /></button>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Recipients</label>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={toggleAll}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
              <span className="text-xs text-gray-400">{selected.size} selected</span>
            </div>
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-50">
              {subscribers.map((s) => (
                <label key={s.id} className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggleOne(s.id)}
                    style={{ accentColor: '#E8192C' }}
                  />
                  <span className="text-navy">{s.email}</span>
                </label>
              ))}
              {subscribers.length === 0 && (
                <p className="px-4 py-6 text-center text-gray-400 text-sm">No subscribers yet.</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. MJA Monthly Update — September 2026" className={inputClass} />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Write your newsletter here. Separate paragraphs with a blank line."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Sent using the standard MJA email design (logo, header, footer, unsubscribe link) automatically.</p>
          </div>

          {error && <p className="text-sm mb-4" style={{ color: '#E8192C' }}>{error}</p>}
          {result && <p className="text-sm mb-4 text-green-600">{result}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSend}
              disabled={sending || !subject || !message || selected.size === 0}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}
            >
              {sending ? 'Sending...' : `Send to ${selected.size || 0}`}
            </button>
            <button onClick={closeCompose} className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Export button */}
      <div className="flex justify-end mb-4">
        <a
          href={`data:text/csv;charset=utf-8,Email,Subscribed At\n${subscribers.map((s) => `${s.email},${s.subscribed_at}`).join('\n')}`}
          download="mja-subscribers.csv"
          className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#0D1B2A' }}
        >
          Export CSV
        </a>
      </div>

      {/* Subscribers list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_160px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
          <span>Email</span>
          <span>Subscribed</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
          {subscribers.map((sub) => (
            <div key={sub.id} className="grid grid-cols-[1fr_160px] gap-4 px-6 py-3.5 items-center">
              <p className="text-sm text-navy">{sub.email}</p>
              <p className="text-xs text-gray-400">
                {new Date(sub.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
          {subscribers.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">No subscribers yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
