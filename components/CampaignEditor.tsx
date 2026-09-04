'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import ImageUpload from '@/components/ImageUpload'
import type { Campaign } from '@/lib/types'
import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Quote, Heading2, Heading3,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
} from 'lucide-react'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button
      type="button" onClick={onClick} title={title}
      className="w-8 h-8 flex items-center justify-center rounded transition-colors"
      style={{ backgroundColor: active ? '#0D1B2A' : 'transparent', color: active ? 'white' : '#6B7280' }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = '#F3F4F6' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      {children}
    </button>
  )
}

type StatusValue = '' | 'upcoming' | 'active' | 'past'

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
    show_prompt: (campaign as any)?.show_prompt ?? false,
    status: (campaign?.status ?? '') as StatusValue,
    is_hero_featured: campaign?.is_hero_featured ?? false,
    cta_primary_label: campaign?.cta_primary_label ?? '',
    cta_primary_url: campaign?.cta_primary_url ?? '',
    cta_secondary_label: campaign?.cta_secondary_label ?? '',
    cta_secondary_url: campaign?.cta_secondary_url ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [slugManual, setSlugManual] = useState(Boolean(campaign))

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Full campaign content...' }),
    ],
    content: campaign?.content ?? '',
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[280px] px-5 py-4' },
    },
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target
    const val = (target as HTMLInputElement).type === 'checkbox'
      ? (target as HTMLInputElement).checked
      : target.value
    if (target.name === 'title' && !slugManual) {
      setForm(f => ({ ...f, title: val as string, slug: slugify(val as string) }))
    } else {
      setForm(f => ({ ...f, [target.name]: val }))
    }
  }

  function uploadAndInsertImage(file: File) {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `campaigns/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    supabase.storage.from('public-images').upload(path, file).then(({ error }) => {
      if (error) return
      const { data } = supabase.storage.from('public-images').getPublicUrl(path)
      editor?.chain().focus().setImage({ src: data.publicUrl }).run()
    })
  }

  function handleImageToolbar() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) uploadAndInsertImage(file)
    }
    input.click()
  }

  async function handleSave(publishNow?: boolean) {
    if (!form.title) return
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const shouldPublish = publishNow !== undefined ? publishNow : form.published

    const payload = {
      title: form.title,
      slug: form.slug,
      hashtag: form.hashtag || null,
      description: form.description || null,
      content: editor?.getHTML() ?? '',
      cover_image: form.cover_image || null,
      event_date: form.event_date || null,
      event_location: form.event_location || null,
      published: shouldPublish,
      show_prompt: form.show_prompt,
      status: form.status || null,
      is_hero_featured: form.is_hero_featured,
      cta_primary_label: form.cta_primary_label || null,
      cta_primary_url: form.cta_primary_url || null,
      cta_secondary_label: form.cta_secondary_label || null,
      cta_secondary_url: form.cta_secondary_url || null,
      updated_at: new Date().toISOString(),
    }

    let error
    if (campaign) {
      const { error: e } = await supabase.from('campaigns').update(payload).eq('id', campaign.id)
      error = e
    } else {
      const { error: e } = await supabase.from('campaigns').insert({ ...payload, created_at: new Date().toISOString() })
      error = e
    }

    setSaving(false)
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(shouldPublish ? 'Published!' : 'Draft saved.')
      setForm(f => ({ ...f, published: shouldPublish }))
      if (!campaign) setTimeout(() => router.push('/admin/campaigns'), 1200)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-navy focus:border-gray-400 transition-colors'
  const labelClass = 'text-xs font-bold uppercase tracking-wide text-gray-500 block mb-1.5'

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
      {/* Main */}
      <div className="space-y-4">
        <input
          name="title" value={form.title} onChange={handleChange}
          placeholder="Campaign title..."
          className="w-full font-headline text-3xl font-bold text-navy border-0 border-b-2 border-gray-100 pb-3 focus:outline-none placeholder:text-gray-200"
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

        {/* Tiptap editor */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={15} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold"><Bold size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic"><Italic size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline"><UnderlineIcon size={15} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Align left"><AlignLeft size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Align center"><AlignCenter size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Align right"><AlignRight size={15} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet list"><List size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Numbered list"><ListOrdered size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Quote"><Quote size={15} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <ToolbarButton onClick={handleImageToolbar} active={false} title="Insert image"><ImageIcon size={15} /></ToolbarButton>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 sticky top-6">
        {/* Publishing */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-navy text-sm mb-4">Publishing</h3>
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${form.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {form.published ? 'Published' : 'Draft'}
              </span>
            </div>

            <div>
              <label className={labelClass}>Slug</label>
              <input
                name="slug" value={form.slug} onChange={(e) => { setSlugManual(true); handleChange(e) }}
                className={inputClass + ' font-mono text-xs'}
              />
            </div>
            <div>
              <label className={labelClass}>Event Date</label>
              <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Event Location</label>
              <input name="event_location" value={form.event_location} onChange={handleChange} placeholder="e.g. Malé, Republic Square" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="">Auto (based on event date)</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="past">Past</option>
              </select>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                Leave on Auto unless you need to override — e.g. mark a resolved campaign as Past.
              </p>
            </div>

            {/* Hero feature toggle */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" name="is_hero_featured" checked={form.is_hero_featured} onChange={handleChange}
                  className="mt-0.5" style={{ accentColor: '#E8192C' }}
                />
                <div>
                  <p className="text-sm font-semibold text-navy">Feature in homepage hero</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                    Only takes effect while this campaign's status is Active.
                  </p>
                </div>
              </label>
            </div>

            {/* Show prompt toggle */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" name="show_prompt" checked={form.show_prompt} onChange={handleChange}
                  className="mt-0.5" style={{ accentColor: '#E8192C' }}
                />
                <div>
                  <p className="text-sm font-semibold text-navy">Show as popup</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                    Displays a prompt to site visitors once per session when enabled.
                  </p>
                </div>
              </label>
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

        {/* Call to action buttons */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-navy text-sm mb-1">Call to Action</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
            Shown on the listing card and the campaign page. Leave blank to hide a button.
          </p>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Primary label</label>
              <input name="cta_primary_label" value={form.cta_primary_label} onChange={handleChange} placeholder="e.g. Join the Rally" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Primary URL</label>
              <input name="cta_primary_url" value={form.cta_primary_url} onChange={handleChange} placeholder="/join-mja" className={inputClass} />
            </div>
            <div className="pt-2 border-t border-gray-100">
              <label className={labelClass}>Secondary label</label>
              <input name="cta_secondary_label" value={form.cta_secondary_label} onChange={handleChange} placeholder="e.g. Contribute" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Secondary URL</label>
              <input name="cta_secondary_url" value={form.cta_secondary_url} onChange={handleChange} placeholder="/join-mja" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-navy text-sm mb-3">Cover Image</h3>
          <ImageUpload
            value={form.cover_image}
            folder="campaigns"
            onChange={(url) => setForm(f => ({ ...f, cover_image: url }))}
          />
        </div>
      </div>
    </div>
  )
}
