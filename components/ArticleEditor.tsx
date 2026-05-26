'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Article } from '@/lib/types'
import dynamic from 'next/dynamic'

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => (
  <div className="border border-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-400 text-sm">
    Loading editor...
  </div>
)})

import 'react-quill/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block', 'list', 'bullet', 'link', 'image',
]

interface Props {
  article?: Article
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function ArticleEditor({ article }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [category, setCategory] = useState<Article['category']>(article?.category ?? 'news-room')
  const [published, setPublished] = useState(article?.published ?? false)
  const [coverImage, setCoverImage] = useState(article?.cover_image ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (!article && title) {
      setSlug(slugify(title))
    }
  }, [title, article])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `articles/${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('media').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setCoverImage(data.publicUrl)
    }
    setUploading(false)
  }

  async function handleSave(publishNow?: boolean) {
    setSaving(true)
    setMessage('')

    const shouldPublish = publishNow !== undefined ? publishNow : published
    const payload = {
      title,
      slug,
      excerpt,
      content,
      category,
      cover_image: coverImage || null,
      published: shouldPublish,
      published_at: shouldPublish && !article?.published_at ? new Date().toISOString() : article?.published_at,
    }

    let error
    if (article) {
      const { error: e } = await supabase.from('articles').update(payload).eq('id', article.id)
      error = e
    } else {
      const { error: e } = await supabase.from('articles').insert(payload)
      error = e
    }

    setSaving(false)
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(shouldPublish ? 'Published!' : 'Draft saved.')
      setPublished(shouldPublish)
      if (!article) setTimeout(() => router.push('/admin/articles'), 1200)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
      {/* Main editor */}
      <div className="space-y-4">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title..."
          className="w-full font-headline text-3xl font-bold text-navy border-0 border-b-2 border-gray-100 pb-3 focus:outline-none focus:border-red placeholder:text-gray-200"
        />

        {/* Excerpt */}
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt or summary (shown in listings)..."
          rows={2}
          className="w-full text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red resize-none"
        />

        {/* Quill Editor */}
        <div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write your article here..."
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 sticky top-6">
        {/* Publish controls */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-navy text-sm mb-4">Publishing</h3>

          <div className="space-y-3 mb-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Status
              </label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${published ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-600">{published ? 'Published' : 'Draft'}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Article['category'])}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red"
              >
                <option value="latest">Latest in MJA</option>
                <option value="top-news">Top News</option>
                <option value="news-room">News Room</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red font-mono"
              />
            </div>
          </div>

          {message && (
            <p className={`text-xs mb-3 px-3 py-2 rounded ${
              message.startsWith('Error') ? 'bg-red/10 text-red' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </p>
          )}

          <div className="space-y-2">
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title}
              className="w-full bg-red text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : published ? 'Update' : 'Publish'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !title}
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-navy text-sm mb-4">Cover Image</h3>

          {coverImage ? (
            <div className="relative mb-3">
              <img src={coverImage} alt="Cover" className="w-full h-36 object-cover rounded-lg" />
              <button
                onClick={() => setCoverImage('')}
                className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full text-xs hover:bg-black/70"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:border-red transition-colors mb-3"
            >
              <span className="text-2xl mb-1">🖼</span>
              <span className="text-xs text-gray-400">{uploading ? 'Uploading...' : 'Click to upload'}</span>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Or paste image URL..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red"
          />
        </div>
      </div>
    </div>
  )
}
