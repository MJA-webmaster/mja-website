'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Application = {
  id: string
  type: string
  name: string
  email: string
  phone: string | null
  outlet: string | null
  years_in_journalism: number | null
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const statusColors = {
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#D97706', label: 'Pending' },
  approved: { bg: 'rgba(16,185,129,0.1)', color: '#059669', label: 'Approved' },
  rejected: { bg: 'rgba(232,25,44,0.1)', color: '#E8192C', label: 'Rejected' },
}

export default function ApplicationsClient({ applications: initial }: { applications: Application[] }) {
  const [applications, setApplications] = useState(initial)
  const [selected, setSelected] = useState<Application | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [updating, setUpdating] = useState(false)

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('membership_applications')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    }
    setUpdating(false)
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Left — list */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-3xl font-bold text-navy">Membership Applications</h1>
            <p className="text-gray-400 text-sm mt-1">{counts.all} total applications</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors"
              style={{
                backgroundColor: filter === f ? '#0D1B2A' : '#F3F4F6',
                color: filter === f ? 'white' : '#6B7280',
              }}
            >
              {f} <span className="ml-1 text-xs opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_80px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>Applicant</span>
            <span>Type</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((app) => {
              const s = statusColors[app.status]
              return (
                <button
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className="w-full grid grid-cols-[1fr_100px_100px_80px] gap-4 px-5 py-4 hover:bg-gray-50 transition-colors items-center text-left"
                  style={selected?.id === app.id ? { backgroundColor: 'rgba(232,25,44,0.03)' } : {}}
                >
                  <div>
                    <p className="text-sm font-semibold text-navy">{app.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{app.email}</p>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{app.type}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold w-fit"
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="px-5 py-12 text-center text-gray-400 text-sm">
                No {filter === 'all' ? '' : filter} applications yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right — detail panel */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-6">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="font-bold text-navy">{selected.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{selected.type} member</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              {[
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone || '—' },
                { label: 'Media Outlet', value: selected.outlet || '—' },
                { label: 'Years in Journalism', value: selected.years_in_journalism ? `${selected.years_in_journalism} years` : '—' },
                { label: 'Applied', value: new Date(selected.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm text-navy">{item.value}</p>
                </div>
              ))}

              {selected.message && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Message</p>
                  <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-3">{selected.message}</p>
                </div>
              )}
            </div>

            {/* Status badge */}
            <div className="px-5 pb-3">
              <div
                className="text-xs px-3 py-1.5 rounded-full font-semibold w-fit"
                style={{
                  backgroundColor: statusColors[selected.status].bg,
                  color: statusColors[selected.status].color,
                }}
              >
                {statusColors[selected.status].label}
              </div>
            </div>

            {/* Actions */}
            {selected.status === 'pending' && (
              <div className="p-5 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => updateStatus(selected.id, 'approved')}
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#059669' }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'rejected')}
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#E8192C' }}
                >
                  ✕ Reject
                </button>
              </div>
            )}

            {selected.status !== 'pending' && (
              <div className="p-5 border-t border-gray-100">
                <button
                  onClick={() => updateStatus(selected.id, selected.status === 'approved' ? 'rejected' : 'approved')}
                  disabled={updating}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Change to {selected.status === 'approved' ? 'Rejected' : 'Approved'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
