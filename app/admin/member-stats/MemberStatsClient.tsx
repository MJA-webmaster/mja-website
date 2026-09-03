'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MemberStats } from '@/lib/types'

const FIELDS = [
  { key: 'total', label: 'Members Total' },
  { key: 'media_outlets', label: 'Number of Media Outlets' },
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
] as const

export default function MemberStatsClient({ stats: initial }: { stats: MemberStats }) {
  const [stats, setStats] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStats({ ...stats, [e.target.name]: parseInt(e.target.value) || 0 })
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase
      .from('member_stats')
      .update({
        total: stats.total,
        media_outlets: stats.media_outlets,
        male: stats.male,
        female: stats.female,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    setSaving(false)
    setMessage(error ? 'Error saving' : 'Saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Member Stats</h1>
          <p className="text-gray-400 text-sm mt-1">These numbers appear in the Membership widget on the homepage</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm font-semibold ${message === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: '#E8192C' }}
          >
            {saving ? 'Saving...' : 'Save Stats'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl p-6 mb-8 text-white" style={{ backgroundColor: '#0D1B2A' }}>
        <p className="text-[11px] font-bold tracking-widest uppercase text-teal-400 mb-1">MJA</p>
        <p className="font-headline text-lg font-bold mb-4">Preview</p>
        <div className="space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
              <span className="text-white/60 text-sm">{f.label}</span>
              <span className="font-headline text-2xl font-black">
                {(stats[f.key] ?? 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit fields */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-navy mb-2">Edit Numbers</h2>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              {f.label}
            </label>
            <input
              type="number"
              name={f.key}
              value={stats[f.key] ?? 0}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-2xl font-bold text-navy focus:outline-none"
              onFocus={(e) => e.target.style.borderColor = '#E8192C'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
