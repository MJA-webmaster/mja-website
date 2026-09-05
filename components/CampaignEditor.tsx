'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import ImageUpload from '@/components/ImageUpload'
import type { Campaign } from '@/lib/types'
import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Quote, Heading2, Heading3,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Calendar, MapPin, Hash, Plus, Trash2, ExternalLink, Check, AlertCircle, ArrowLeft,
  ChevronLeft, ChevronRight
} from 'lucide-react'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
        active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

type StatusValue = '' | 'upcoming' | 'active' | 'past'
type Milestone = { date: string; title: string; description?: string }

const STEPS = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'Content' },
  { key: 'media', label: 'Media & CTAs' },
  { key: 'timeline', label: 'Milestones & Social' },
] as const

type StepKey = (typeof STEPS)[number]['key']

export default function CampaignEditor({ campaign }: { campaign?: Campaign }) {
  const router = useRouter()
  const [step, setStep] = useState<StepKey>('details')
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
    media_kit_url: campaign?.media_kit_url ?? '',
    milestones: (campaign?.milestones ?? []) as Milestone[],
    tweet_urls: (campaign?.tweet_urls ?? []) as string[],
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null)
  const [slugManual, setSlugManual] = useState(Boolean(campaign))

  const stepIndex = STEPS.findIndex((s) => s.key === step)
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === STEPS.length - 1

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write the primary campaign statement or case narrative...' }),
    ],
    content: campaign?.content ?? '',
    editorProps: {
      attributes: { class: 'prose prose-slate max-w-none focus:outline-none min-h-[420px] px-6 py-5' },
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

  function addMilestone() {
    setForm(f => ({ ...f, milestones: [...f.milestones, { date: '', title: '', description: '' }] }))
  }
  function updateMilestone(i: number, field: keyof Milestone, value: string) {
    setForm(f => {
      const next = [...f.milestones]
      next[i] = { ...next[i], [field]: value }
      return { ...f, milestones: next }
    })
  }
  function removeMilestone(i: number) {
    setForm(f => ({ ...f, milestones: f.milestones.filter((_, idx) => idx !== i) }))
  }

  function addTweetUrl() {
    setForm(f => ({ ...f, tweet_urls: [...f.tweet_urls, ''] }))
  }
  function updateTweetUrl(i: number, value: string) {
    setForm(f => {
      const next = [...f.tweet_urls]
      next[i] = value
      return { ...f, tweet_urls: next }
    })
  }
  function removeTweetUrl(i: number) {
    setForm(f => ({ ...f, tweet_urls: f.tweet_urls.filter((_, idx) => idx !== i) }))
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

  function goNext() {
    if (!isLastStep) setStep(STEPS[stepIndex + 1].key)
  }
  function goBack() {
    if (!isFirstStep) setStep(STEPS[stepIndex - 1].key)
  }

  async function handleSave(publishNow?: boolean) {
    if (!form.title) {
      setStep('details')
      setMessage({ text: 'Title is required.', error: true })
      return
    }
    setSaving(true)
    setMessage(null)
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
      media_kit_url: form.media_kit_url || null,
      milestones: form.milestones.filter(m => m.date && m.title),
      tweet_urls: form.tweet_urls.map(u => u.trim()).filter(Boolean),
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
      setMessage({ text: error.message, error: true })
    } else {
      setMessage({ text: shouldPublish ? 'Campaign published!' : 'Draft saved successfully.' })
      setForm(f => ({ ...f, published: shouldPublish }))
      if (!campaign) setTimeout(() => router.push('/admin/campaigns'), 1200)
    }
  }

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8192C]/20 focus:border-[#E8192C] transition-all'
  const labelClass = 'text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5'

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 -mx-6 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Return to campaigns"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {campaign ? 'Editing Campaign' : 'Create Campaign'}
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 leading-none truncate max-w-sm">
                {form.title || 'Untitled Campaign'}
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                form.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {form.published ? 'Live' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {message && (
          <span className={`text-xs flex items-center gap-1.5 font-medium ${message.error ? 'text-rose-600' : 'text-emerald-600'}`}>
            {message.error ? <AlertCircle size={14} /> : <Check size={14} />}
            {message.text}
          </span>
        )}
      </header>

      {/* Step progress bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs px-6 py-4 flex items-center">
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
                <span className={`text-xs font-bold hidden sm:inline ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-slate-100 mx-3" />}
            </div>
          )
        })}
      </div>

      {/* Step 1: Details */}
      {step === 'details' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div>
            <label className={labelClass}>Campaign Headline</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Free Shahzan & Leevan"
              className="w-full font-headline text-2xl sm:text-3xl font-bold text-slate-900 border-0 border-b border-slate-200 pb-2 focus:outline-none focus:border-[#E8192C] placeholder:text-slate-300"
              autoFocus
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className={labelClass}>
                <Hash size={13} className="inline mr-1 -mt-0.5 text-slate-400" />
                Campaign Hashtag
              </label>
              <input
                name="hashtag"
                value={form.hashtag}
                onChange={handleChange}
                placeholder="#FreeAdhadhuJournalists"
                className={inputClass}
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
          </div>

          <div>
            <label className={labelClass}>Short Brief / Subtitle</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A concise 1-2 sentence advocacy summary displayed across cards and search..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className={labelClass}>Status Badge</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="">Auto (derived from event date)</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="past">Past / Resolved</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                <Calendar size={13} className="inline mr-1 -mt-0.5 text-slate-400" />
                Event / Incident Date
              </label>
              <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <MapPin size={13} className="inline mr-1 -mt-0.5 text-slate-400" />
              Event Location
            </label>
            <input
              name="event_location"
              value={form.event_location}
              onChange={handleChange}
              placeholder="e.g. Malé, Maldives"
              className={inputClass}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_hero_featured"
                checked={form.is_hero_featured}
                onChange={handleChange}
                className="mt-0.5 accent-[#E8192C]"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Pin to Homepage Hero</p>
                <p className="text-[11px] text-slate-400 leading-snug">Featured top placement while status is Active.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="show_prompt"
                checked={form.show_prompt}
                onChange={handleChange}
                className="mt-0.5 accent-[#E8192C]"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Show Dialog Prompt</p>
                <p className="text-[11px] text-slate-400 leading-snug">Displays an overlay alert to site visitors.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="mt-0.5 accent-[#E8192C]"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Published</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Content */}
      {step === 'content' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Primary Case Statement & Content
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-white">
            <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={15} /></ToolbarButton>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold"><Bold size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic"><Italic size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline"><UnderlineIcon size={15} /></ToolbarButton>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Align left"><AlignLeft size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Align center"><AlignCenter size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Align right"><AlignRight size={15} /></ToolbarButton>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet list"><List size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Numbered list"><ListOrdered size={15} /></ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Quote"><Quote size={15} /></ToolbarButton>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <ToolbarButton onClick={handleImageToolbar} active={false} title="Insert image"><ImageIcon size={15} /></ToolbarButton>
          </div>

          <EditorContent editor={editor} />
        </div>
      )}

      {/* Step 3: Media & CTAs */}
      {step === 'media' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Cover Image / Hero</h3>
            <div className="max-w-sm">
              <ImageUpload
                value={form.cover_image}
                folder="campaigns"
                onChange={(url) => setForm(f => ({ ...f, cover_image: url }))}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              High resolution landscape image (16:9 or 21:9). Renders in the header hero with dark gradient overlay.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
              Calls to Action & Press
            </h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Primary Button</label>
                <div className="space-y-2">
                  <input
                    name="cta_primary_label"
                    value={form.cta_primary_label}
                    onChange={handleChange}
                    placeholder="Label (e.g. Sign Petition)"
                    className={inputClass}
                  />
                  <input
                    name="cta_primary_url"
                    value={form.cta_primary_url}
                    onChange={handleChange}
                    placeholder="URL (/petition or https://...)"
                    className={`${inputClass} text-xs font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Secondary Button</label>
                <div className="space-y-2">
                  <input
                    name="cta_secondary_label"
                    value={form.cta_secondary_label}
                    onChange={handleChange}
                    placeholder="Label (e.g. Contact Us)"
                    className={inputClass}
                  />
                  <input
                    name="cta_secondary_url"
                    value={form.cta_secondary_url}
                    onChange={handleChange}
                    placeholder="URL (/contact or https://...)"
                    className={`${inputClass} text-xs font-mono`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className={labelClass}>
                <ExternalLink size={13} className="inline mr-1 -mt-0.5 text-slate-400" />
                Media Kit Link
              </label>
              <input
                name="media_kit_url"
                value={form.media_kit_url}
                onChange={handleChange}
                placeholder="Google Drive, Dropbox, or ZIP URL"
                className={`${inputClass} text-xs`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Milestones & Social */}
      {step === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Chronological Milestones</h3>
                <p className="text-xs text-slate-400">Items are ordered below chronologically to mirror the public site.</p>
              </div>
              <button
                type="button"
                onClick={addMilestone}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8192C] hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus size={14} /> Add Milestone
              </button>
            </div>

            {form.milestones.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-lg">
                <p className="text-xs text-slate-400">No events recorded. Click "Add Milestone" to populate the timeline.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {form.milestones
                  .map((m, originalIndex) => ({ ...m, originalIndex }))
                  .sort((a, b) => {
                    if (!a.date) return 1
                    if (!b.date) return -1
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                  })
                  .map((m, displayIndex) => (
                    <div key={m.originalIndex} className="flex gap-4 items-start bg-slate-50/70 border border-slate-200/70 rounded-lg p-4 group">
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-1">
                        {displayIndex + 1}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 flex-1">
                        <div className="sm:col-span-4">
                          <input
                            type="date"
                            value={m.date}
                            onChange={(e) => updateMilestone(m.originalIndex, 'date', e.target.value)}
                            className={`${inputClass} text-xs bg-white`}
                          />
                        </div>
                        <div className="sm:col-span-8">
                          <input
                            value={m.title}
                            onChange={(e) => updateMilestone(m.originalIndex, 'title', e.target.value)}
                            placeholder="Event Title (e.g. Criminal Court Gag Order)"
                            className={`${inputClass} text-xs bg-white font-semibold`}
                          />
                        </div>
                        <div className="sm:col-span-12">
                          <textarea
                            value={m.description ?? ''}
                            onChange={(e) => updateMilestone(m.originalIndex, 'description', e.target.value)}
                            placeholder="Event context or summary sentence..."
                            rows={2}
                            className={`${inputClass} text-xs bg-white resize-none`}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMilestone(m.originalIndex)}
                        className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Curated Tweet / Post Links</h3>
                <p className="text-xs text-slate-400">Add individual X post links to feature alongside hashtag feeds.</p>
              </div>
              <button
                type="button"
                onClick={addTweetUrl}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8192C] hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus size={14} /> Add Tweet
              </button>
            </div>

            {form.tweet_urls.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific tweets linked.</p>
            ) : (
              <div className="space-y-2">
                {form.tweet_urls.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={url}
                      onChange={(e) => updateTweetUrl(i, e.target.value)}
                      placeholder="https://x.com/user/status/..."
                      className={`${inputClass} text-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => removeTweetUrl(i)}
                      className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer nav */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200/80 shadow-xs px-6 py-4">
        <button
          onClick={isFirstStep ? () => router.push('/admin/campaigns') : goBack}
          className="flex items-center gap-1.5 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving || !form.title}
              className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving || !form.title}
              className="bg-[#E8192C] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#c91424] disabled:opacity-50 transition-colors shadow-sm"
            >
              {saving ? 'Saving...' : form.published ? 'Update Campaign' : 'Publish'}
            </button>
          </div>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
            style={{ backgroundColor: '#E8192C' }}
          >
            Next <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
