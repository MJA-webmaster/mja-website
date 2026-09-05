'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, Check, X, AlertCircle } from 'lucide-react'

type Activity = {
  id: string
  title: string
  slug: string | null
  description: string | null
  year: number
  order: number
  event_date: string | null
  venue: string | null
  published: boolean
  updates: { date: string; title: string; description?: string }[]
  created_at: string
}

type UpdateEntry = { date: string; title: string; description?: string }

const inputClass =
  'w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E8192C]/15 focus:border-[#E8192C] transition-all'
const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5'

const defaultYear = new Date().getFullYear()

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function ActivitiesAdminClient({ activities: initial }: { activities: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterYear, setFilterYear] = useState<number | 'all'>('all')
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    year: defaultYear,
    order: 0,
    event_date: '',
    venue: '',
    published: true,
    updates: [] as UpdateEntry[],
  })

  const years = Array.from(new Set(activities.map((a) => a.year))).sort((a, b) => b - a)
  const filtered = filterYear === 'all'
    ? activities
    : activities.filter((a) => a.year === filterYear)

  function openCreateForm() {
    setError(null)
    setEditingId(null)
    setSlugManual(false)

    const targetYear = filterYear === 'all' ? defaultYear : filterYear
    const yearItems = activities.filter((a) => a.year === targetYear)
    const nextOrder = yearItems.length > 0 ? Math.max(...yearItems.map((a) => a.order)) + 1 : 0

    setForm({
      title: '',
      slug: '',
      description: '',
      year: targetYear,
      order: nextOrder,
      event_date: '',
      venue: '',
      published: true,
      updates: [],
    })
    setShowForm(true)
  }

  function startEdit(activity: Activity) {
    setError(null)
    setEditingId(activity.id)
    setSlugManual(true)
    setForm({
      title: activity.title,
      slug: activity.slug ?? '',
      description: activity.description ?? '',
      year: activity.year,
      order: activity.order,
      event_date: activity.event_date ? activity.event_date.slice(0, 16) : '',
      venue: activity.venue ?? '',
      published: activity.published,
      updates: activity.updates ?? [],
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setError(null)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked
      : (name === 'year' || name === 'order') ? Number(value)
      : value

    if (name === 'title' && !slugManual) {
      setForm((f) => ({ ...f, title: value, slug: slugify(value) }))
    } else {
      setForm((f) => ({ ...f, [name]: val }))
    }
  }

  function addUpdate() {
    setForm((f) => ({ ...f, updates: [...f.updates, { date: '', title: '', description: '' }] }))
  }
  function updateUpdate(i: number, field: keyof UpdateEntry, value: string) {
    setForm((f) => {
      const next = [...f.updates]
      next[i] = { ...next[i], [field]: value }
      return { ...f, updates: next }
    })
  }
  function removeUpdate(i: number) {
    setForm((f) => ({ ...f, updates: f.updates.filter((_, idx) => idx !== i) }))
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    setError(null)
    const supabase = createClient()

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description.trim() || null,
      year: form.year,
      order: form.order,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
      venue: form.venue.trim() || null,
      published: form.published,
      updates: form.updates.filter((u) => u.date && u.title),
    }

    if (editingId) {
      const { data, error: err } = await supabase
        .from('activities')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()

      if (err) {
        setError(err.message)
      } else if (data) {
        setActivities((prev) =>
          prev
            .map((item) => (item.id === editingId ? data : item))
            .sort((a, b) => b.year - a.year || a.order - b.order)
        )
        closeForm()
      }
    } else {
      const { data, error: err } = await supabase
        .from('activities')
        .insert(payload)
        .select()
        .single()

      if (err) {
        setError(err.message)
      } else if (data) {
        setActivities((prev) => [data, ...prev].sort((a, b) => b.year - a.year || a.order - b.order))
        closeForm()
      }
    }

    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this activity?')) return
    const supabase = createClient()
    const { error: err } = await supabase.from('activities').delete().eq('id', id)
    if (!err) {
      setActivities((prev) => {
        const next = prev.filter((a) => a.id !== id)
        if (filterYear !== 'all' && !next.some((a) => a.year === filterYear)) {
          setFilterYear('all')
        }
        return next
      })
      if (editingId === id) closeForm()
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-slate-900">Activities</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {activities.length} total across {years.length} {years.length === 1 ? 'year' : 'years'}
          </p>
        </div>
        <button
          onClick={showForm ? closeForm : openCreateForm}
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs hover:bg-[#c91424]"
          style={{ backgroundColor: '#E8192C' }}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Cancel' : 'Add Activity'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide font-headline">
              {editingId ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <span className="text-[11px] text-slate-400">Press Esc or Cancel to discard</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Event Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Safety Training for Investigative Reporters"
                className={inputClass}
                autoFocus
              />
            </div>

            <div>
              <label className={labelClass}>URL Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={(e) => { setSlugManual(true); handleChange(e) }}
                className={`${inputClass} font-mono text-xs`}
              />
            </div>

            <div>
              <label className={labelClass}>Description / Highlights</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief summary of key outcomes, trainers, or attendee scope..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date & Time</label>
                <input
                  type="datetime-local"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Venue</label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="e.g. Dharubaaruge, Malé"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  min={2000}
                  max={2099}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Display Sequence Order</label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min={0}
                  className={inputClass}
                />
                <p className="text-[11px] text-slate-400 mt-1">Lower order numbers appear first within the selected year.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                style={{ accentColor: '#E8192C' }}
              />
              Published
            </label>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <label className={labelClass}>Upcoming Updates</label>
                <button
                  type="button"
                  onClick={addUpdate}
                  className="text-xs font-bold text-[#E8192C] hover:underline"
                >
                  + Add update
                </button>
              </div>
              <div className="space-y-3">
                {form.updates.length === 0 && (
                  <p className="text-[11px] text-slate-400">No updates yet.</p>
                )}
                {form.updates.map((u, i) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-3 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={u.date}
                        onChange={(e) => updateUpdate(i, 'date', e.target.value)}
                        className={`${inputClass} text-xs`}
                      />
                      <button type="button" onClick={() => removeUpdate(i)} className="text-slate-300 hover:text-rose-600 text-xs px-1">
                        ✕
                      </button>
                    </div>
                    <input
                      value={u.title}
                      onChange={(e) => updateUpdate(i, 'title', e.target.value)}
                      placeholder="Update title (e.g. Venue changed)"
                      className={`${inputClass} text-xs`}
                    />
                    <textarea
                      value={u.description ?? ''}
                      onChange={(e) => updateUpdate(i, 'description', e.target.value)}
                      placeholder="Short note (optional)"
                      rows={2}
                      className={`${inputClass} text-xs resize-none`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2.5 rounded-lg">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex items-center gap-1.5 text-white px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors shadow-xs"
                style={{ backgroundColor: '#E8192C' }}
              >
                <Check size={14} />
                {saving ? 'Saving...' : editingId ? 'Update Activity' : 'Save Activity'}
              </button>
              <button
                onClick={closeForm}
                className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
        {(['all', ...years] as const).map((y) => {
          const count = y === 'all' ? activities.length : activities.filter((a) => a.year === y).length
          const isActive = filterYear === y

          return (
            <button
              key={y}
              onClick={() => setFilterYear(y as number | 'all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{y === 'all' ? 'All Activities' : y}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/60 ${
                editingId === activity.id ? 'bg-rose-50/40' : ''
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="shrink-0 w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5">
                  #{activity.order}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{activity.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      {activity.year}
                    </span>
                    {!activity.published && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">Draft</span>
                    )}
                  </div>
                  {(activity.event_date || activity.venue) && (
                    <p className="text-xs text-slate-400 mb-1">
                      {activity.event_date && new Date(activity.event_date).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                      })}
                      {activity.event_date && activity.venue && ' · '}
                      {activity.venue}
                    </p>
                  )}
                  {activity.description && (
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{activity.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => startEdit(activity)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Edit activity"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete activity"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="text-xs text-slate-400 mb-2">No activities listed for this criteria.</p>
              <button
                onClick={openCreateForm}
                className="text-xs font-bold text-[#E8192C] hover:underline"
              >
                + Add the first activity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
