'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, GripVertical } from 'lucide-react'

type Activity = {
  id: string
  title: string
  description: string | null
  year: number
  order: number
  created_at: string
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gray-400 transition-colors'
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

const EMPTY = {
  title: '',
  description: '',
  year: new Date().getFullYear(),
  order: 0,
}

export default function ActivitiesAdminClient({ activities: initial }: { activities: Activity[] }) {
  const [activities, setActivities] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [filterYear, setFilterYear] = useState<number | 'all'>('all')

  const years = Array.from(new Set(activities.map(a => a.year))).sort((a, b) => b - a)
  const filtered = filterYear === 'all'
    ? activities
    : activities.filter(a => a.year === filterYear)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'year' || name === 'order' ? Number(value) : value }))
  }

  async function handleSave() {
    if (!form.title) return
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('activities')
      .insert({
        title: form.title,
        description: form.description || null,
        year: form.year,
        order: form.order,
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setActivities(prev => [data, ...prev].sort((a, b) => b.year - a.year || a.order - b.order))
      setForm(EMPTY)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this activity?')) return
    const supabase = createClient()
    const { error } = await supabase.from('activities').delete().eq('id', id)
    if (!error) setActivities(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Activities</h1>
          <p className="text-gray-400 text-sm mt-1">{activities.length} activities</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}
        >
          <Plus size={16} />
          Add Activity
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-navy mb-4">New Activity</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Press Freedom Workshop"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                placeholder="Brief description of the activity"
                rows={3}
                className={inputClass + ' resize-none'}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Year</label>
                <input
                  type="number" name="year" value={form.year} onChange={handleChange}
                  min={2000} max={2099}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Order</label>
                <input
                  type="number" name="order" value={form.order} onChange={handleChange}
                  min={0}
                  className={inputClass}
                />
                <p className="text-[10px] text-gray-300 mt-1">Lower number appears first within year</p>
              </div>
            </div>

            {error && (
              <p className="text-sm px-4 py-3 rounded-lg"
                style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.08)', border: '1px solid rgba(232,25,44,0.2)' }}>
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
                className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#E8192C' }}
              >
                {saving ? 'Saving...' : 'Save Activity'}
              </button>
              <button
                onClick={() => { setShowForm(false); setError(null) }}
                className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Year filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['all', ...years] as const).map((y) => (
          <button
            key={y}
            onClick={() => setFilterYear(y as number | 'all')}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: filterYear === y ? '#0D1B2A' : '#F3F4F6',
              color: filterYear === y ? 'white' : '#6B7280',
            }}
          >
            {y === 'all' ? 'All Years' : y}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 px-6 py-4">
              <GripVertical size={16} className="text-gray-200 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-navy">{activity.title}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                    {activity.year}
                  </span>
                </div>
                {activity.description && (
                  <p className="text-xs text-gray-400 leading-relaxed">{activity.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(activity.id)}
                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No activities yet. Click &quot;Add Activity&quot; to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
