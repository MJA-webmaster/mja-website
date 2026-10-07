'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil } from 'lucide-react'

type Activity = {
  id: string
  year: number
  title: string
  description: string | null
  order: number
}

const emptyForm = { year: new Date().getFullYear(), title: '', description: '', order: 0 }

export default function ActivitiesAdminClient({ activities: initial }: { activities: Activity[] }) {
  const [activities, setActivities] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value,
    })
  }

  function startAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  function startEdit(a: Activity) {
    setEditingId(a.id)
    setForm({ year: a.year, title: a.title, description: a.description ?? '', order: a.order })
    setError('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const sortList = (list: Activity[]) =>
    [...list].sort((a, b) => b.year - a.year || a.order - b.order)

  async function handleSave() {
    if (!form.title) return
    setSaving(true)
    setError('')
    const supabase = createClient()

    const payload = {
      year: form.year,
      title: form.title,
      description: form.description || null,
      order: form.order,
    }

    if (editingId) {
      const { data, error } = await supabase
        .from('activities')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()

      if (error || !data) {
        setError(error?.message ?? 'Could not save changes. Make sure you are signed in.')
      } else {
        setActivities(prev => sortList(prev.map(a => (a.id === editingId ? data : a))))
        cancelForm()
      }
    } else {
      const { data, error } = await supabase
        .from('activities')
        .insert(payload)
        .select()
        .single()

      if (error || !data) {
        setError(error?.message ?? 'Could not save. Make sure you are signed in.')
      } else {
        setActivities(prev => sortList([data, ...prev]))
        cancelForm()
      }
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this activity?')) return
    const supabase = createClient()
    const { error } = await supabase.from('activities').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    setActivities(prev => prev.filter(a => a.id !== id))
    if (editingId === id) cancelForm()
  }

  const grouped = activities.reduce((acc, a) => {
    if (!acc[a.year]) acc[a.year] = []
    acc[a.year].push(a)
    return acc
  }, {} as Record<number, Activity[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Activities</h1>
          <p className="text-gray-400 text-sm mt-1">{activities.length} activities</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}
        >
          <Plus size={16} /> Add Activity
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-navy mb-4">
            {editingId ? 'Edit Activity' : 'New Activity'}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Year *</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Display Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Event Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. World Press Freedom Day Rally"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="What happened at this event..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none resize-none"
            />
          </div>

          {error && (
            <p
              className="text-sm px-4 py-3 rounded-lg mb-4"
              style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.08)' }}
            >
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
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Save Activity'}
            </button>
            <button
              onClick={cancelForm}
              className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && error && (
        <p
          className="text-sm px-4 py-3 rounded-lg mb-4"
          style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.08)' }}
        >
          {error}
        </p>
      )}

      <div className="space-y-8">
        {Object.keys(grouped)
          .sort((a, b) => Number(b) - Number(a))
          .map((year) => (
            <div key={year} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
                <span className="font-headline text-xl font-black" style={{ color: '#E8192C' }}>{year}</span>
                <span className="text-xs text-gray-400">{grouped[Number(year)].length} events</span>
              </div>
              <div className="divide-y divide-gray-50">
                {grouped[Number(year)].map((activity) => (
                  <div key={activity.id} className="flex items-start justify-between px-6 py-4">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-semibold text-navy">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{activity.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => startEdit(activity)}
                        className="text-gray-400 hover:text-navy transition-colors"
                        aria-label="Edit activity"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        aria-label="Delete activity"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        {activities.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 px-6 py-12 text-center text-gray-400 text-sm">
            No activities yet. Add the first one above.
          </div>
        )}
      </div>
    </div>
  )
}
