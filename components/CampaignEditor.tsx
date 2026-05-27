'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Campaign } from '@/lib/types'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="border border-gray-200 rounded-lg h-64 flex items-center justify-center text-gray-400 text-sm">Loading editor...</div>
})
import 'react-quill/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    ['blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function CampaignEditor({ campaign }: { campaign?: Campaign }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: campaign?.title ?? '',
    slug: campaign?.slug ?? '',
    hashtag: campaign?.hashtag ?? '',
    description: campaign?.description ?? '',
    event_date: campaign?.event_date ? campaign.event_date.split('T')[0] : '',
    event_location: campaign?.event_location ?? '',
    cover_image: campaign?.cover_image ?? '',
    published: campaign?.published ?? false,
  })
  const [content, setContent] = useState(campaign?.content ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!campaign && form.title) {
      setForm(prev => ({ ...prev, slug: slugify(form.title) }))
    }
  }, [form.title, campaign])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  async function handleSave(publishNow?: boolean) {
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const shouldPublish = publishNow !== undefined ? publishNow : form.published

    const payload = {
      ...form,
      content,
      published: shouldPublish,
      cover_image: form.cover_image || null,
      hashtag: form.hashtag || null,
      event_date: form.event_date || null,
      event_location: form.event_location || null,
      description: form.description || null,
    }

    let error
    if (campaign) {
      const { error: e } = await supabase.from('campaigns').update(payload).eq('id', campaign.id)
      error = e
    } else {
      const { error: e } = await supabase.from('campaigns').insert(payload)
      error = e
    }

    setSaving(false)
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(shouldPublish ? 'Published!' : 'Draft saved.')
      setForm(prev => ({ ...prev, published: shouldPublish }))
      if (!campaign) setTimeout(() => router.push('/admin/campaigns'), 1200)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
      {/* Main */}
      <div className="space-y-4">
        <input
          name="title" value={form.title} onChange={handleChange}
          placeholder="Campaign title..."
          className="w-full font-headline text-3xl font-bold text-navy border-0 border-b-2 border-gray-100 pb-3 focus:outline-none placeholder:text-gray-200"
          style={{ '--tw-border-opacity': 1 } as React.CSSProperties}
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#F3F4F6'}
        />
        <input
          name="hashtag" value={form.hashtag} onChange={handleChange}
          placeholder="#Hashtag (optional)"
          className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3 focus:outline-none text-navy"
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        />
        <textarea
          name="description" value={form.description} onChange={handleChange}
          placeholder="Short description shown in listings..."
          rows={2}
          className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3 focus:outline-none text-navy resize-none"
          onFocus={(e) => e.target.style.borderColor = '#E8192C'}
          onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        />
        <ReactQuill
          theme="snow" value={content} onChange={setContent}
          modules={quillModules}
          placeholder="Full campaign content..."
        />
      </div>

      {/* Sidebar */}
      <div className="space-y-4 sticky top-6">
        {/* Publish */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-navy text-sm mb-4">Publishing</h3>
          <div className="space-y-3 mb-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Status</label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${form.published ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-600">{form.published ? 'Published' : 'Draft'}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Slug</label>
              <input
                name="slug" value={form.slug} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono text-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Event Date</label>
              <input
                type="date" name="event_date" value={form.event_date} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Event Location</label>
              <input
                name="event_location" value={form.event_location} onChange={handleChange}
                placeholder="e.g. Malé, Republic Square"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-navy"
              />
            </div>
          </div>

          {message && (
            <p className={`text-xs mb-3 px-3 py-2 rounded ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {message}
            </p>
          )}

          <div className="space-y-2">
            <button
              onClick={() => handleSave(true)} disabled={saving || !form.title}
              className="w-full text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: '#E8192C' }}
            >
              {saving ? 'Saving...' : form.published ? 'Update' : 'Publish'}
            </button>
            <button
              onClick={() => handleSave(false)} disabled={saving || !form.title}
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-navy text-sm mb-3">Cover Image</h3>
          {form.cover_image && (
            <div className="mb-3 relative">
              <img src={form.cover_image} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
              <button onClick={() => setForm(prev => ({ ...prev, cover_image: '' }))} className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full text-xs">×</button>
            </div>
          )}
          <input
            name="cover_image" value={form.cover_image} onChange={handleChange}
            placeholder="Paste image URL..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none text-navy"
          />
        </div>
      </div>
    </div>
  )
}
