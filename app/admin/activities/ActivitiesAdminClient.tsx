'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, Upload, X, ExternalLink, Loader2 } from 'lucide-react'

type Update = { date: string; title: string; description: string }

type Activity = {
  id: string
  title: string
  slug: string | null
  description: string | null
  year: number
  order: number
  published: boolean | null
  event_date: string | null
  venue: string | null
  cover_image: string | null
  gallery: string[] | null
  updates: Update[] | null
  tweet_urls: string[] | null
  media_kit_url: string | null
  registration_url: string | null
}

type FormState = {
  title: string
  slug: string
  description: string
  year: number
  order: number
  published: boolean
  event_date: string
  venue: string
  cover_image: string
  gallery: string[]
  updates: Update[]
  tweet_urls: string
  media_kit_url: string
  registration_url: string
}

const BUCKET = 'public-images'
const OFFSET_MS = 5 * 60 * 60 * 1000 // Maldives is UTC+5, no daylight saving

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gray-400 transition-colors'
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'
const sectionClass = 'text-sm font-bold text-navy pb-2 mb-4 border-b border-gray-100'

function isoToInput(iso: string | null) {
  if (!iso) return ''
  return new Date(new Date(iso).getTime() + OFFSET_MS).toISOString().slice(0, 16)
}

function inputToIso(value: string) {
  return value ? new Date(`${value}:00+05:00`).toISOString() : null
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function uniqueSlug(base: string, taken: string[]) {
  let slug = base
  let n = 2
  while (taken.includes(slug)) slug = `${base}-${n++}`
  return slug
}

async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file')
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be under 8MB')
  const supabase = createClient()
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600' })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function blankForm(): FormState {
  return {
    title: '',
    slug: '',
    description: '',
    year: new Date().getFullYear(),
    order: 0,
    published: true,
    event_date: '',
    venue: '',
    cover_image: '',
    gallery: [],
    updates: [],
    tweet_urls: '',
    media_kit_url: '',
    registration_url: '',
  }
}

function formFromActivity(a: Activity): FormState {
  return {
    title: a.title,
    slug: a.slug ?? slugify(a.title),
    description: a.description ?? '',
    year: a.year,
    order: a.order ?? 0,
    published: a.published ?? true,
    event_date: isoToInput(a.event_date),
    venue: a.venue ?? '',
    cover_image: a.cover_image ?? '',
    gallery: a.gallery ?? [],
    updates: (a.updates ?? []).map((u) => ({
      date: (u.date ?? '').slice(0, 10),
      title: u.title ?? '',
      description: u.description ?? '',
    })),
    tweet_urls: (a.tweet_urls ?? []).join('\n'),
    media_kit_url: a.media_kit_url ?? '',
    registration_url: a.registration_url ?? '',
  }
}

export default function ActivitiesAdminClient({ activities: initial }: { activities: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(blankForm())
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'cover' | 'gallery' | null>(null)
  const [error, setError] = useState('')
  const [filterYear, setFilterYear] = useState<number | 'all'>('all')

  const years = Array.from(new Set(activities.map((a) => a.year))).sort((a, b) => b - a)
  const filtered = filterYear === 'all' ? activities : activities.filter((a) => a.year === filterYear)
  const sortList = (list: Activity[]) =>
    [...list].sort((a, b) => b.year - a.year || (a.order ?? 0) - (b.order ?? 0))

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function startAdd() {
    setEditingId(null)
    setForm(blankForm())
    setError('')
    setShowForm(true)
  }

  function startEdit(a: Activity) {
    setEditingId(a.id)
    setForm(formFromActivity(a))
    setError('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(blankForm())
    setError('')
  }

  function onDateChange(value: string) {
    setForm((f) => ({ ...f, event_date: value, year: value ? Number(value.slice(0, 4)) : f.year }))
  }

  function setUpdate(i: number, patch: Partial<Update>) {
    setForm((f) => ({
      ...f,
      updates: f.updates.map((u, idx) => (idx === i ? { ...u, ...patch } : u)),
    }))
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading('cover')
    setError('')
    try {
      const url = await uploadImage(file, 'activities')
      setForm((f) => ({ ...f, cover_image: url }))
    } catch (err: any) {
      setError(err.message)
    }
    setUploading(null)
  }

  async function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return
    setUploading('gallery')
    setError('')
    try {
      const urls: string[] = []
      for (const file of files) urls.push(await uploadImage(file, 'activities/gallery'))
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }))
    } catch (err: any) {
      setError(err.message)
    }
    setUploading(null)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setError('')

    const incomplete = form.updates.some((u) => (u.title.trim() && !u.date) || (!u.title.trim() && u.date))
    if (incomplete) {
      setError('Each update needs both a date and a title.')
      return
    }

    const taken = activities
      .filter((a) => a.id !== editingId)
      .map((a) => a.slug)
      .filter((s): s is string => !!s)
    const base = slugify(form.slug.trim() || form.title) || `activity-${Date.now().toString(36)}`
    const slug = uniqueSlug(base, taken)

    const payload = {
      title: form.title.trim(),
      slug,
      description: form.description.trim() || null,
      year: form.year,
      order: form.order,
      published: form.published,
      event_date: inputToIso(form.event_date),
      venue: form.venue.trim() || null,
      cover_image: form.cover_image || null,
      gallery: form.gallery,
      updates: form.updates
        .filter((u) => u.title.trim() && u.date)
        .map((u) => ({ date: u.date, title: u.title.trim(), description: u.description.trim() })),
      tweet_urls: form.tweet_urls
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      media_kit_url: form.media_kit_url.trim() || null,
      registration_url: form.registration_url.trim() || null,
    }

    setSaving(true)
    const supabase = createClient()

    if (editingId) {
      const { data, error } = await supabase
        .from('activities')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()
      if (error || !data) {
        setError(error?.message ?? 'Could not save. Please sign out and back in, then try again.')
      } else {
        setActivities((prev) => sortList(prev.map((a) => (a.id === editingId ? (data as Activity) : a))))
        closeForm()
      }
    } else {
      const { data, error } = await supabase.from('activities').insert(payload).select().single()
      if (error || !data) {
        setError(error?.message ?? 'Could not save. Please sign out and back in, then try again.')
      } else {
        setActivities((prev) => sortList([data as Activity, ...prev]))
        closeForm()
      }
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this activity? This cannot be undone.')) return
    const supabase = createClient()
    const { error } = await supabase.from('activities').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    setActivities((prev) => prev.filter((a) => a.id !== id))
    if (editingId === id) closeForm()
  }

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
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy">{editingId ? 'Edit Activity' : 'New Activity'}</h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-navy" aria-label="Close form">
              <X size={18} />
            </button>
          </div>

          {/* Basics */}
          <section>
            <h3 className={sectionClass}>Basics</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Fact-Checking Workshop"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Page link (slug)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">/the-association/activities/</span>
                  <input
                    value={form.slug}
                    onChange={(e) => set('slug', e.target.value)}
                    placeholder="created from the title if left empty"
                    className={inputClass + ' font-mono'}
                  />
                </div>
                {editingId && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Changing this breaks links that were already shared.
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={6}
                  placeholder={'Start a line with "- " to make a bullet list.'}
                  className={inputClass + ' resize-y'}
                />
              </div>
            </div>
          </section>

          {/* When and where */}
          <section>
            <h3 className={sectionClass}>When and where</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date and time (Maldives time)</label>
                <input
                  type="datetime-local"
                  value={form.event_date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Venue</label>
                <input
                  value={form.venue}
                  onChange={(e) => set('venue', e.target.value)}
                  placeholder="e.g. MJA Office, Malé"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => set('year', Number(e.target.value) || new Date().getFullYear())}
                  min={2000}
                  max={2099}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => set('order', Number(e.target.value) || 0)}
                  min={0}
                  className={inputClass}
                />
                <p className="text-[11px] text-gray-400 mt-1">Lower numbers appear first within a year.</p>
              </div>
            </div>
          </section>

          {/* Images */}
          <section>
            <h3 className={sectionClass}>Photos</h3>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Cover photo</label>
                {form.cover_image ? (
                  <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img src={form.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      onClick={() => set('cover_image', '')}
                      className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center"
                      aria-label="Remove cover photo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 w-full max-w-sm aspect-video rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 cursor-pointer hover:border-gray-300">
                    {uploading === 'cover' ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Upload size={20} />
                    )}
                    <span className="text-xs font-medium">
                      {uploading === 'cover' ? 'Uploading...' : 'Click to upload'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <label className={labelClass}>Gallery</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {form.gallery.map((url, i) => (
                    <div key={url + i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => set('gallery', form.gallery.filter((_, idx) => idx !== i))}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        aria-label={`Remove gallery photo ${i + 1}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center gap-1 aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 cursor-pointer hover:border-gray-300">
                    {uploading === 'gallery' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Plus size={18} />
                    )}
                    <span className="text-[11px] font-medium">
                      {uploading === 'gallery' ? 'Uploading...' : 'Add photos'}
                    </span>
                    <input type="file" accept="image/*" multiple onChange={handleGallery} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h3 className={sectionClass}>Updates</h3>
            <p className="text-xs text-gray-400 mb-4">
              Follow-ups shown on the event page, such as a press conference or a statement.
            </p>
            <div className="space-y-4">
              {form.updates.map((u, i) => (
                <div key={i} className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3 items-end">
                    <div>
                      <label className={labelClass}>Date</label>
                      <input
                        type="date"
                        value={u.date}
                        onChange={(e) => setUpdate(i, { date: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        value={u.title}
                        onChange={(e) => setUpdate(i, { title: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <button
                      onClick={() => set('updates', form.updates.filter((_, idx) => idx !== i))}
                      className="text-gray-300 hover:text-red-500 transition-colors pb-3"
                      aria-label="Remove update"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    value={u.description}
                    onChange={(e) => setUpdate(i, { description: e.target.value })}
                    rows={3}
                    placeholder="Details"
                    className={inputClass + ' resize-y bg-white'}
                  />
                </div>
              ))}
              <button
                onClick={() => set('updates', [...form.updates, { date: '', title: '', description: '' }])}
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: '#E8192C' }}
              >
                <Plus size={14} /> Add update
              </button>
            </div>
          </section>

          {/* Links */}
          <section>
            <h3 className={sectionClass}>Links</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Registration link</label>
                <input
                  type="url"
                  value={form.registration_url}
                  onChange={(e) => set('registration_url', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Media kit link</label>
                <input
                  type="url"
                  value={form.media_kit_url}
                  onChange={(e) => set('media_kit_url', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tweet links</label>
                <textarea
                  value={form.tweet_urls}
                  onChange={(e) => set('tweet_urls', e.target.value)}
                  rows={3}
                  placeholder="One link per line"
                  className={inputClass + ' resize-y font-mono'}
                />
              </div>
            </div>
          </section>

          {/* Publish */}
          <section>
            <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set('published', e.target.checked)}
                style={{ accentColor: '#E8192C', width: 16, height: 16 }}
              />
              Published (visible on the website)
            </label>
          </section>

          {error && (
            <p
              className="text-sm px-4 py-3 rounded-lg"
              style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.08)', border: '1px solid rgba(232,25,44,0.2)' }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !!uploading || !form.title.trim()}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Save Activity'}
            </button>
            <button
              onClick={closeForm}
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
          {filtered.map((a) => (
            <div key={a.id} className="flex items-start gap-4 px-6 py-4">
              <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {a.cover_image && <img src={a.cover_image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-navy">{a.title}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                    {a.year}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      a.published === false ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {a.published === false ? 'Draft' : 'Live'}
                  </span>
                  {!a.slug && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      No page link. Edit and save to create one.
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-gray-500">
                  {a.event_date && (
                    <span>
                      {new Date(a.event_date).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZone: 'Indian/Maldives',
                      })}
                    </span>
                  )}
                  {a.venue && <span>{a.venue}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {a.slug && (
                  <a
                    href={`/the-association/activities/${a.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-navy transition-colors"
                    aria-label="View on website"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
                <button
                  onClick={() => startEdit(a)}
                  className="text-gray-400 hover:text-navy transition-colors"
                  aria-label="Edit activity"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  aria-label="Delete activity"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No activities yet. Click "Add Activity" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
