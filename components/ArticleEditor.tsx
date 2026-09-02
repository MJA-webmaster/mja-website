'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'
import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Minus,
  Image as ImageIcon, Link as LinkIcon,
  Eye, EyeOff, Save, ArrowLeft,
  Heading1, Heading2, Heading3,
} from 'lucide-react'

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  category: string
  published: boolean
  published_at: string | null
}

const CATEGORIES = [
  { value: 'latest', label: 'Latest' },
  { value: 'top-news', label: 'Top News' },
  { value: 'news-room', label: 'News Room' },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded transition-colors"
      style={{
        backgroundColor: active ? '#0D1B2A' : 'transparent',
        color: active ? 'white' : '#6B7280',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = '#F3F4F6'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />
}

export default function ArticleEditor({ article }: { article?: Article }) {
  const router = useRouter()
  const isEdit = Boolean(article)

  const [form, setForm] = useState({
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    excerpt: article?.excerpt ?? '',
    category: article?.category ?? 'latest',
    cover_image: article?.cover_image ?? '',
    published: article?.published ?? false,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)
  const [slugManual, setSlugManual] = useState(isEdit)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write the article body here...' }),
    ],
    content: article?.content ?? '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] px-6 py-5',
      },
    },
  })

  function handleTitleChange(val: string) {
    setForm((f) => ({
      ...f,
      title: val,
      slug: slugManual ? f.slug : slugify(val),
    }))
  }

  async function insertImage() {
    const url = window.prompt('Image URL (paste a Supabase public URL):')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  async function uploadAndInsertImage(file: File) {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('public-images').upload(path, file)
    if (error) return
    const { data } = supabase.storage.from('public-images').getPublicUrl(path)
    editor?.chain().focus().setImage({ src: data.publicUrl }).run()
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

  function setLink() {
    const url = window.prompt('URL:', editor?.getAttributes('link').href ?? '')
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkToLink().unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkToLink().setLink({ href: url }).run()
  }

  async function handleSave(publish?: boolean) {
    if (!form.title || !form.slug) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError('')

    const supabase = createClient()
    const content = editor?.getHTML() ?? ''
    const shouldPublish = publish !== undefined ? publish : form.published

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content,
      cover_image: form.cover_image || null,
      category: form.category,
      published: shouldPublish,
      published_at: shouldPublish ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    if (isEdit && article) {
      const { error } = await supabase
        .from('articles')
        .update(payload)
        .eq('id', article.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase
        .from('articles')
        .insert({ ...payload, created_at: new Date().toISOString() })
      if (error) { setError(error.message); setSaving(false); return }
    }

    setSaving(false)
    setForm((f) => ({ ...f, published: shouldPublish }))
    if (!isEdit) router.push('/admin/articles')
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none focus:border-gray-400 transition-colors'
  const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

  return (
    <div className="max-w-[900px]">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push('/admin/articles')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-navy transition-colors"
        >
          <ArrowLeft size={15} />
          Back to articles
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            {preview ? <EyeOff size={15} /> : <Eye size={15} />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <Save size={15} />
            Save draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(!form.published)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: '#E8192C' }}
          >
            {form.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm px-4 py-3 rounded-lg mb-4"
          style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.08)', border: '1px solid rgba(232,25,44,0.2)' }}>
          {error}
        </p>
      )}

      {preview ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8">
          {form.cover_image && (
            <img src={form.cover_image} alt="" className="w-full h-64 object-cover rounded-xl mb-8" />
          )}
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E8192C' }}>
            {CATEGORIES.find(c => c.value === form.category)?.label}
          </p>
          <h1 className="font-headline text-4xl font-black text-navy mb-4">{form.title || 'Untitled'}</h1>
          {form.excerpt && <p className="text-gray-500 text-lg mb-8 leading-relaxed">{form.excerpt}</p>}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? '' }}
          />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Cover image */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <ImageUpload
              label="Cover Image"
              value={form.cover_image}
              folder="articles"
              onChange={(url) => setForm((f) => ({ ...f, cover_image: url }))}
            />
          </div>

          {/* Meta fields */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManual(true)
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }}
                  placeholder="article-slug"
                  className={inputClass}
                />
                <p className="text-[10px] text-gray-300 mt-1">Auto-generated from title</p>
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-navy focus:outline-none focus:border-gray-400 transition-colors bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short summary shown in article listings..."
                rows={2}
                className={inputClass + ' resize-none'}
              />
            </div>
          </div>

          {/* Body editor */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50">
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })} title="Heading 1">
                <Heading1 size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2">
                <Heading2 size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3">
                <Heading3 size={15} />
              </ToolbarButton>
              <Divider />
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold">
                <Bold size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic">
                <Italic size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline">
                <UnderlineIcon size={15} />
              </ToolbarButton>
              <Divider />
              <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Align left">
                <AlignLeft size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Align center">
                <AlignCenter size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Align right">
                <AlignRight size={15} />
              </ToolbarButton>
              <Divider />
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet list">
                <List size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Numbered list">
                <ListOrdered size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Quote">
                <Quote size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} active={false} title="Divider">
                <Minus size={15} />
              </ToolbarButton>
              <Divider />
              <ToolbarButton onClick={handleImageToolbar} active={false} title="Insert image">
                <ImageIcon size={15} />
              </ToolbarButton>
              <ToolbarButton onClick={setLink} active={editor?.isActive('link')} title="Insert link">
                <LinkIcon size={15} />
              </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />

            {/* Word count */}
            <div className="px-6 py-2 border-t border-gray-50 text-[11px] text-gray-300 text-right">
              {editor?.storage.characterCount?.words?.() ?? 0} words
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
