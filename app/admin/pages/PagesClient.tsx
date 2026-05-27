'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { FileText } from 'lucide-react'

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
    ['link'],
    ['clean'],
  ],
}

type Page = {
  id: string
  slug: string
  title: string
  content: string | null
  updated_at: string
}

export default function PagesClient({ pages: initial }: { pages: Page[] }) {
  const [pages, setPages] = useState(initial)
  const [selected, setSelected] = useState<Page | null>(initial[0] ?? null)
  const [content, setContent] = useState(initial[0]?.content ?? '')
  const [title, setTitle] = useState(initial[0]?.title ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function selectPage(page: Page) {
    setSelected(page)
    setContent(page.content ?? '')
    setTitle(page.title)
    setMessage('')
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase
      .from('pages')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', selected.id)

    if (!error) {
      setPages(prev => prev.map(p => p.id === selected.id ? { ...p, title, content } : p))
      setSelected(prev => prev ? { ...prev, title, content } : null)
      setMessage('Saved!')
    } else {
      setMessage('Error saving page')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Pages list */}
      <div className="w-56 flex-shrink-0">
        <h1 className="font-headline text-2xl font-bold text-navy mb-4">Pages</h1>
        <div className="space-y-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => selectPage(page)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-colors"
              style={{
                backgroundColor: selected?.id === page.id ? '#E8192C' : 'transparent',
                color: selected?.id === page.id ? 'white' : '#6B7280',
              }}
            >
              <FileText size={15} strokeWidth={1.75} />
              {page.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {selected && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-headline text-2xl font-bold text-navy border-0 border-b-2 border-gray-100 pb-1 focus:outline-none w-full"
                onFocus={(e) => e.target.style.borderColor = '#E8192C'}
                onBlur={(e) => e.target.style.borderColor = '#F3F4F6'}
              />
              <p className="text-xs text-gray-400 mt-1">
                /{selected.slug} · Last updated {new Date(selected.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {message && (
                <span className={`text-xs font-semibold ${message === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#E8192C' }}
              >
                {saving ? 'Saving...' : 'Save Page'}
              </button>
            </div>
          </div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            placeholder="Write page content here..."
          />
        </div>
      )}
    </div>
  )
}
