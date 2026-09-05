'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/ImageUpload'
import { Plus, Trash2, Pencil, Check, X, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

type Activity = {
  id: string
  title: string
  slug: string | null
  description: string | null
  year: number
  order: number
  event_date: string | null
  venue: string | null
  cover_image: string | null
  published: boolean
  updates: { date: string; title: string; description?: string }[]
  registration_url: string | null
  gallery: string[]
  tweet_urls: string[]
  media_kit_url: string | null
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

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  year: defaultYear,
  order: 0,
  event_date: '',
  venue: '',
  cover_image: '',
  published: true,
  updates: [] as UpdateEntry[],
  registration_url: '',
  gallery: [] as string[],
  tweet_urls: [] as string[],
  media_kit_url: '',
}

const STEPS = [
  { key: 'details', label: 'Details' },
  { key: 'media', label: 'Media' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'updates', label: 'Updates' },
] as const

type StepKey = (typeof STEPS)[number]['key']

export default function ActivitiesAdminClient({ activities: initial }: { activities: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initial)
  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState<StepKey>('details')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterYear, setFilterYear] = useState<number | 'all'>('all')
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)

  const years = Array.from(new Set(activities.map((a) => a.year))).sort((a, b) => b - a)
  const filtered = filterYear === 'all'
    ? activities
    : activities.filter((a) => a.year === filterYear)

  const stepIndex = STEPS.findIndex((s) => s.key === step)
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === STEPS.length - 1

  function openCreateForm() {
    setError(null)
    setEditingId(null)
    setSlugManual(false)
    setStep('details')

    const targetYear = filterYear === 'all' ? defaultYear : filterYear
    const yearItems = activities.filter((a) => a.year === targetYear)
    const nextOrder = yearItems.length > 0 ? Math.max(...yearItems.map((a) => a.order)) + 1 : 0

    setForm({ ...EMPTY_FORM, year: targetYear, order: nextOrder })
    setShowForm(true)
  }

  function startEdit(activity: Activity) {
    setError(null)
    setEditingId(activity.id)
    setSlugManual(true)
    setStep('details')
    setForm({
      title: activity.title,
      slug: activity.slug ?? '',
      description: activity.description ?? '',
      year: activity.year,
      order: activity.order,
      event_date: activity.event_date ? activity.event_date.slice(0, 16) : '',
      venue: activity.venue ?? '',
      cover_image: activity.cover_image ?? '',
      published: activity.published,
      updates: activity.updates ?? [],
      registration_url: activity.registration_url ?? '',
      gallery: activity.gallery ?? [],
      tweet_urls: activity.tweet_urls ?? [],
      media_kit_url: activity.media_kit_url ?? '',
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

  // Updates
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

  // Gallery
  function addGalleryImage() {
    setForm((f) => ({ ...f, gallery: [...f.gallery, ''] }))
  }
  function updateGalleryImage(i: number, url: string) {
    setForm((f) => {
      const next = [...f.gallery]
      next[i] = url
      return { ...f, gallery: next }
    })
  }
  function removeGalleryImage(i: number) {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))
  }

  // Tweets
  function addTweetUrl() {
    setForm((f) => ({ ...f, tweet_urls: [...f.tweet_urls, ''] }))
  }
  function updateTweetUrl(i: number, value: string) {
    setForm((f) => {
      const next = [...f.tweet_urls]
      next[i] = value
      return { ...f, tweet_urls: next }
    })
  }
  function removeTweetUrl(i: number) {
    setForm((f) => ({ ...f, tweet_urls: f.tweet_urls.filter((_, idx) => idx !== i) }))
  }

  function goNext() {
    if (!isLastStep) setStep(STEPS[stepIndex + 1].key)
  }
  function goBack() {
    if (!isFirstStep) setStep(STEPS[stepIndex - 1].key)
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setStep('details')
      setError('Title is required.')
      return
    }
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
      cover_image: form.cover_image || null,
      published: form.published,
      updates: form.updates.filter((u) => u.date && u.title),
      registration_url: form.registration_url.trim() || null,
      gallery: form.gallery.map((g) => g.trim()).filter(Boolean),
      tweet_urls: form.tweet_urls.map((t) => t.trim()).filter(Boolean),
      media_kit_url: form.media_kit_url.trim() || null,
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
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-slate-900">Events</h1>
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
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Step progress bar */}
          <div className="flex items-center border-b border-slate-100 px-6 py-4">
            {STEPS.map((s, i) => {
              const isActive = s.key === step
              const isDone = i < stepIndex
              return (
                <div key={s.key} className="flex items-center flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => setStep(s.key)}
                    className="flex items-center gap-2 shrink-0"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors"
                      style={
                        isActive
                          ? { backgroundColor: '#E8192C', color: 'white' }
                          : isDone
                          ? { backgroundColor: '#FEE2E2', color: '#E8192C' }
                          : { backgroundColor: '#F1F5F9', color: '#94A3B8' }
                      }
                    >
                      {isDone ? <Check size={12} /> : i + 1}
                    </span>
                    <span
                      className={`text-xs font-bold hidden sm:inline ${isActive ? 'text-slate-900' : 'text-slate-400'}`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-slate-100 mx-3" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="p-6">
            {/* Step 1: Details */}
            {step === 'details' && (
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
              </div>
            )}

            {/* Step 2: Media */}
            {step === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Cover Image</label>
                  <div className="w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-slate-200">
                    <ImageUpload
                      value={form.cover_image}
                      folder="activities"
                      onChange={(url) => setForm((f) => ({ ...f, cover_image: url }))}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={labelClass}>Gallery</label>
                    <button type="button" onClick={addGalleryImage} className="text-xs font-bold text-[#E8192C] hover:underline">
                      + Add image
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {form.gallery.map((url, i) => (
                      <div key={i} className="relative">
                        <div className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <ImageUpload
                            value={url}
                            folder="activities/gallery"
                            onChange={(newUrl) => updateGalleryImage(i, newUrl)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center text-xs shadow-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {form.gallery.length === 0 && (
                      <p className="text-[11px] text-slate-400 col-span-full">No gallery images yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Engagement */}
            {step === 'engagement' && (
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Registration URL</label>
                  <input
                    name="registration_url"
                    value={form.registration_url}
                    onChange={handleChange}
                    placeholder="https://forms.gle/... or event page link"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Media Kit URL</label>
                  <input
                    name="media_kit_url"
                    value={form.media_kit_url}
                    onChange={handleChange}
                    placeholder="Link to press kit / assets folder"
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={labelClass}>Featured Tweets / Posts</label>
                    <button type="button" onClick={addTweetUrl} className="text-xs font-bold text-[#E8192C] hover:underline">
                      + Add tweet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.tweet_urls.length === 0 && (
                      <p className="text-[11px] text-slate-400">No tweets added yet.</p>
                    )}
                    {form.tweet_urls.map((url, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={url}
                          onChange={(e) => updateTweetUrl(i, e.target.value)}
                          placeholder="https://x.com/user/status/..."
                          className={`${inputClass} text-xs`}
                        />
                        <button type="button" onClick={() => removeTweetUrl(i)} className="text-slate-300 hover:text-rose-600 text-xs px-1">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Updates */}
            {step === 'updates' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelClass}>Upcoming Updates</label>
                  <button type="button" onClick={addUpdate} className="text-xs font-bold text-[#E8192C] hover:underline">
                    + Add update
                  </button>
                </div>
                <div className="space-y-3">
                  {form.updates.length === 0 && (
                    <p className="text-[11px] text-slate-400">No updates yet. You can publish now and add these later.</p>
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
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2.5 rounded-lg mt-4">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={isFirstStep ? closeForm : goBack}
              className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-white transition-colors"
            >
              {isFirstStep ? (
                'Cancel'
              ) : (
                <>
                  <ChevronLeft size={14} /> Back
                </>
              )}
            </button>

            {isLastStep ? (
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex items-center gap-1.5 text-white px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors shadow-xs"
                style={{ backgroundColor: '#E8192C' }}
              >
                <Check size={14} />
                {saving ? 'Saving...' : editingId ? 'Update Event' : 'Save Event'}
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
                style={{ backgroundColor: '#E8192C' }}
              >
                Next <ChevronRight size={14} />
              </button>
            )}
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
              <span>{y === 'all' ? 'All Events' : y}</span>
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
                  title="Edit event"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete event"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="text-xs text-slate-400 mb-2">No events listed for this criteria.</p>
              <button
                onClick={openCreateForm}
                className="text-xs font-bold text-[#E8192C] hover:underline"
              >
                + Add the first event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
