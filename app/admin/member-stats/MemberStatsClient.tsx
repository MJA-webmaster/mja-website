'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Stats = {
  local: number
  international: number
  non_member_contributors: number
}

export default function MemberStatsClient({ stats: initial }: { stats: Stats }) {
  const [stats, setStats] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const total = stats.local + stats.international + stats.non_member_contributors

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStats({ ...stats, [e.target.name]: parseInt(e.target.value) || 0 })
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase
      .from('member_stats')
      .update({ ...stats, updated_at: new Date().toISOString() })
      .eq('id', 1)

    setSaving(false)
    setMessage(error ? 'Error saving' : 'Saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  const segments = [
    { key: 'local', label: 'Local Members', color: '#00B5AD', pct: total ? (stats.local / total) * 100 : 0 },
    { key: 'international', label: 'International Members', color: '#60A5FA', pct: total ? (stats.international / total) * 100 : 0 },
    { key: 'non_member_contributors', label: 'Non-Member Contributors', color: '#F59E0B', pct: total ? (stats.non_member_contributors / total) * 100 : 0 },
  ]

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Member Stats</h1>
          <p className="text-gray-400 text-sm mt-1">These numbers appear in the Membermeter across the site</p>
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

      {/* Preview meter */}
      <div className="bg-navy rounded-xl p-6 mb-8" style={{ backgroundColor: '#0D1B2A' }}>
        <p className="text-xs font-bold tracking-widest uppercase text-teal-400 mb-1">MJA</p>
        <p className="text-white font-bold text-lg mb-4">Membermeter Preview</p>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden flex mb-5">
          {segments.map((seg) => (
            <div key={seg.key} className="h-full transition-all duration-500" style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} />
          ))}
        </div>
        <div className="space-y-2">
          {segments.map((seg) => (
            <div key={seg.key} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="text-white/60">{seg.label}</span>
              </div>
              <span className="text-white font-bold">{(stats as any)[seg.key].toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="text-white/60">Total</span>
            </div>
            <span className="text-white font-bold">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Edit fields */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-navy mb-2">Edit Numbers</h2>
        {segments.map((seg) => (
          <div key={seg.key}>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </label>
            <input
              type="number"
              name={seg.key}
              value={(stats as any)[seg.key]}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-2xl font-bold text-navy focus:outline-none"
              onFocus={(e) => e.target.style.borderColor = '#E8192C'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>
        ))}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Total members: <span className="font-bold text-navy">{total.toLocaleString()}</span></p>
        </div>
      </div>
    </div>
  )
}
