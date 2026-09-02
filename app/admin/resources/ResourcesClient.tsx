'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Resource } from '@/lib/types'
import { RESOURCE_CATEGORIES, subcategoriesFor, labelFor } from '@/lib/resource-categories'
import FileUpload from '@/components/FileUpload'
import { Plus, Trash2, ExternalLink, Download, ChevronDown } from 'lucide-react'

const EMPTY = {
  title: '',
  description: '',
  category: 'publications' as Resource['category'],
  subcategory: 'Reports',
  file_url: '',
  external_url: '',
  file_size: '',
  published: true,
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gray-400 transition-colors bg-white'
const labelClass =
  'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-navy focus:outline-none focus:border-gray-400 transition-colors bg-white cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  )
}

export default function ResourcesClient({ resources: initial }: { resources: Resource[] }) {
  const [resources, setResources] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(EMPTY)

  const filtered = filter === 'all' ? resources : resources.filter((r) => r.category === filter)
  const subOptions = subcategoriesFor(form.category).map((s) => ({ value: s, label: s }))
  const isMultimedia = form.category === 'multimedia'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target
    const val = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setForm({ ...form, [target.name]: val })
  }

  function handleCategory(val: string) {
    const nextSubs = subcategoriesFor(val)
    setForm({ ...form, category: val as Resource['category'], subcategory: nextSubs[0] ?? '' })
  }

  async function handleSave() {
    if (!form.title) return
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('resources')
      .insert({
        title: form.title,
        description: form.description || null,
        category: form.category,
        subcategory: form.subcategory || null,
        file_url: form.file_url || null,
        external_url: form.external_url || null,
        file_size: form.file_size || null,
        published: form.published,
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else if (data) {
      setResources((prev) => [data, ...prev])
      setForm(EMPTY)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this resource?')) return
    const supabase = createClient()
    const { error } = await supabase.from('resources').delete().eq('id', id)
    if (!error) setResources((prev) => prev.filter((r) => r.id !== id))
  }

  const categoryOptions = RESOURCE_CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))
  const filterOptions = [
    { value: 'all', label: 'All' },
    ...RESOURCE_CATEGORIES.map((c) => ({ value: c.slug, label: c.label })),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Resource Hub</h1>
          <p className="text-gray-400 text-sm mt-1">{resources.length} resources</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}
        >
          <Plus size={16} />
          Add Resource
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-navy mb-4">New Resource</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="Resource title"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <Select value={form.category} onChange={handleCategory} options={categoryOptions} />
              </div>
              <div>
                <label className={labelClass}>Sub-category</label>
                <Select
                  value={form.subcategory}
                  onChange={(val) => setForm({ ...form, subcategory: val })}
                  options={subOptions}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <input
                name="description" value={form.description} onChange={handleChange}
                placeholder="Brief description"
                className={inputClass}
              />
            </div>

            {/* File upload — hidden for multimedia, shown for everything else */}
            {!isMultimedia && (
              <FileUpload
                label="File"
                value={form.file_url}
                folder={form.category}
                onChange={(url, size) => setForm({ ...form, file_url: url, file_size: size })}
                onClear={() => setForm({ ...form, file_url: '', file_size: '' })}
              />
            )}

            {/* External URL — always shown; required for multimedia */}
            <div>
              <label className={labelClass}>
                {isMultimedia ? 'Video / Photo URL *' : 'External URL'}
              </label>
              <input
                name="external_url" value={form.external_url} onChange={handleChange}
                placeholder={isMultimedia ? 'YouTube, Vimeo, or direct link' : 'https://...'}
                className={inputClass}
              />
            </div>

            {/* File size — auto-filled on upload, editable override */}
            {!isMultimedia && (
              <div className="w-40">
                <label className={labelClass}>File Size</label>
                <input
                  name="file_size" value={form.file_size} onChange={handleChange}
                  placeholder="e.g. 2.4 MB"
                  className={inputClass}
                />
                <p className="text-[10px] text-gray-300 mt-1">Auto-filled on upload</p>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox" name="published" checked={form.published} onChange={handleChange}
                style={{ accentColor: '#E8192C' }}
              />
              Published
            </label>

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
                {saving ? 'Saving...' : 'Save Resource'}
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

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filterOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: filter === f.value ? '#0D1B2A' : '#F3F4F6',
              color: filter === f.value ? 'white' : '#6B7280',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-semibold text-navy">{resource.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">{labelFor(resource.category)}</span>
                  {resource.subcategory && (
                    <span className="text-xs text-gray-300">{resource.subcategory}</span>
                  )}
                  {resource.file_size && (
                    <span className="text-xs text-gray-300">{resource.file_size}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    resource.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {resource.published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {resource.file_url && (
                  <a href={resource.file_url} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-navy">
                    <Download size={15} />
                  </a>
                )}
                {resource.external_url && (
                  <a href={resource.external_url} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-navy">
                    <ExternalLink size={15} />
                  </a>
                )}
                <button onClick={() => handleDelete(resource.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No resources yet. Click &quot;Add Resource&quot; to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
