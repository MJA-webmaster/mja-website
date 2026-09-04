'use client'

import { useState } from 'react'
import { Send, X, Plus, Trash2, ChevronUp, ChevronDown, Eye } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import { wrapEmail, blocksToHtml, type NewsletterBlock } from '@/lib/emailTemplates'

type Subscriber = {
  id: string
  email: string
  subscribed_at: string
}

type ArticleOption = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
}

type PublicationOption = {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  file_url: string | null
  external_url: string | null
}

type Block = NewsletterBlock & { id: string }

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none'
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'
const selectClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none bg-white'

function newBlock(type: Block['type']): Block {
  const id = Math.random().toString(36).slice(2)
  switch (type) {
    case 'heading':
      return { id, type: 'heading', text: '' }
    case 'paragraph':
      return { id, type: 'paragraph', text: '' }
    case 'image':
      return { id, type: 'image', url: '', caption: '' }
    case 'button':
      return { id, type: 'button', label: '', url: '' }
    case 'divider':
      return { id, type: 'divider' }
    case 'article':
      return { id, type: 'article', title: '', excerpt: '', image: '', url: '' }
    case 'publication':
      return { id, type: 'publication', title: '', description: '', image: '', url: '' }
  }
}

const BLOCK_TYPES: { type: Block['type']; label: string }[] = [
  { type: 'heading', label: 'Heading' },
  { type: 'paragraph', label: 'Paragraph' },
  { type: 'image', label: 'Image' },
  { type: 'button', label: 'Button' },
  { type: 'article', label: 'Article' },
  { type: 'publication', label: 'Publication' },
  { type: 'divider', label: 'Divider' },
]

function BlockEditor({ block, onChange, onRemove, onMove, isFirst, isLast, articles, publications }: {
  block: Block
  onChange: (b: Block) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
  isFirst: boolean
  isLast: boolean
  articles: ArticleOption[]
  publications: PublicationOption[]
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{block.type}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={isFirst} className="text-gray-400 hover:text-navy disabled:opacity-30 p-1"><ChevronUp size={14} /></button>
          <button onClick={() => onMove(1)} disabled={isLast} className="text-gray-400 hover:text-navy disabled:opacity-30 p-1"><ChevronDown size={14} /></button>
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
        </div>
      </div>

      {block.type === 'heading' && (
        <input
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="e.g. This Month at MJA"
          className={inputClass}
        />
      )}

      {block.type === 'paragraph' && (
        <textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          rows={4}
          placeholder="Write a paragraph..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-navy focus:outline-none resize-none bg-white"
        />
      )}

      {block.type === 'image' && (
        <div className="space-y-3">
          <ImageUpload label="" value={block.url} folder="newsletter" onChange={(url) => onChange({ ...block, url })} />
          <input
            value={block.caption ?? ''}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
            className={inputClass}
          />
        </div>
      )}

      {block.type === 'button' && (
        <div className="grid grid-cols-2 gap-3">
          <input
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Button text, e.g. Read More"
            className={inputClass}
          />
          <input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="https://mja.mv/..."
            className={inputClass}
          />
        </div>
      )}

      {block.type === 'divider' && (
        <p className="text-xs text-gray-400">A horizontal line will appear here.</p>
      )}

      {block.type === 'article' && (
        <div className="space-y-3">
          <select
            className={selectClass}
            value=""
            onChange={(e) => {
              const article = articles.find((a) => a.id === e.target.value)
              if (!article) return
              onChange({
                ...block,
                title: article.title,
                excerpt: article.excerpt ?? '',
                image: article.cover_image ?? '',
                url: `https://mja.mv/news-room/${article.slug}`,
              })
            }}
          >
            <option value="">{block.title ? 'Change article...' : 'Select an article from News Room...'}</option>
            {articles.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          {articles.length === 0 && <p className="text-xs text-gray-400">No published articles found.</p>}
          {block.title && (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
              {block.image && <img src={block.image} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{block.title}</p>
                <p className="text-xs text-gray-400 truncate">{block.url}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {block.type === 'publication' && (
        <div className="space-y-3">
          <select
            className={selectClass}
            value=""
            onChange={(e) => {
              const pub = publications.find((p) => p.id === e.target.value)
              if (!pub) return
              onChange({
                ...block,
                title: pub.title,
                description: pub.description ?? '',
                image: pub.cover_image ?? '',
                url: pub.file_url || pub.external_url || '',
              })
            }}
          >
            <option value="">{block.title ? 'Change publication...' : 'Select a publication from Resources...'}</option>
            {publications.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          {publications.length === 0 && <p className="text-xs text-gray-400">No published publications found.</p>}
          {block.title && (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
              {block.image && <img src={block.image} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{block.title}</p>
                <p className="text-xs text-gray-400 truncate">{block.url || 'No file or link set on this publication'}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function NewsletterClient({ subscribers, count, articles, publications }: {
  subscribers: Subscriber[]
  count: number
  articles: ArticleOption[]
  publications: PublicationOption[]
}) {
  const [showCompose, setShowCompose] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [subject, setSubject] = useState('')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const allSelected = selected.size > 0 && selected.size === subscribers.length
  const hasContent = blocks.some((b) => {
    if (b.type === 'heading' || b.type === 'paragraph') return b.text.trim()
    if (b.type === 'image') return b.url
    if (b.type === 'button') return b.label && b.url
    if (b.type === 'article' || b.type === 'publication') return b.title && b.url
    return true
  })

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(subscribers.map((s) => s.id)))
  }
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function openCompose() {
    setResult(null)
    setError(null)
    setShowCompose(true)
  }
  function closeCompose() {
    setShowCompose(false)
    setShowPreview(false)
    setSubject('')
    setBlocks([])
    setError(null)
  }

  function addBlock(type: Block['type']) {
    setBlocks((prev) => [...prev, newBlock(type)])
  }
  function updateBlock(id: string, next: Block) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? next : b)))
  }
  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }
  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      const swapWith = idx + dir
      if (swapWith < 0 || swapWith >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
      return next
    })
  }

  async function handleSend() {
    if (!subject || blocks.length === 0 || selected.size === 0) return
    setSending(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          blocks: blocks.map(({ id, ...rest }) => rest),
          recipientIds: Array.from(selected),
        }),
      })

      // A slow send (large recipient list, or MailerSend running slow) can
      // outlast the server's request timeout, in which case the response
      // is an HTML error page rather than JSON. Guard the parse so that
      // shows up as a clear message instead of a cryptic browser error.
      let data: any = null
      try {
        data = await res.json()
      } catch {
        throw new Error(
          `The server didn't return a valid response (status ${res.status}). It may have timed out — try again, or send to fewer recipients at once.`
        )
      }
      if (!res.ok) throw new Error(data?.error || 'Failed to send.')
      setResult(`Sent to ${data.sent} of ${data.total} recipients.`)
      setSubject('')
      setBlocks([])
    } catch (e: any) {
      setError(e.message || 'Something went wrong.')
    }
    setSending(false)
  }

  const previewHtml = wrapEmail({
    preheader: subject,
    unsubscribeUrl: '#',
    body: `
      <h1 style="margin:0 0 20px 0;font-size:20px;color:#0D1B2A;font-weight:800;">${subject || 'Your subject here'}</h1>
      ${blocksToHtml(blocks.map(({ id, ...rest }) => rest as NewsletterBlock))}
    `,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Newsletter</h1>
          <p className="text-gray-400 text-sm mt-1">{count} subscribers</p>
        </div>
        <button
          onClick={openCompose}
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}
        >
          <Send size={15} /> Compose Newsletter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4" style={{ backgroundColor: '#E8192C' }} />
          <p className="text-3xl font-headline font-bold text-navy">{count}</p>
          <p className="text-sm text-gray-400 mt-1">Total Subscribers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4 bg-teal-500" />
          <p className="text-3xl font-headline font-bold text-navy">
            {subscribers.filter((s) => {
              const date = new Date(s.subscribed_at)
              const thirtyDaysAgo = new Date()
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
              return date > thirtyDaysAgo
            }).length}
          </p>
          <p className="text-sm text-gray-400 mt-1">Last 30 Days</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4 bg-amber-500" />
          <p className="text-3xl font-headline font-bold text-navy">
            {subscribers.filter((s) => {
              const date = new Date(s.subscribed_at)
              const sevenDaysAgo = new Date()
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
              return date > sevenDaysAgo
            }).length}
          </p>
          <p className="text-sm text-gray-400 mt-1">Last 7 Days</p>
        </div>
      </div>

      {/* Compose panel */}
      {showCompose && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-navy">Compose Newsletter</h2>
            <button onClick={closeCompose} className="text-gray-400 text-lg"><X size={18} /></button>
          </div>

          <div className={`grid ${showPreview ? 'grid-cols-2 gap-6' : 'grid-cols-1'}`}>
            <div>
              <div className="mb-4">
                <label className={labelClass}>Recipients</label>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={toggleAll}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    {allSelected ? 'Deselect all' : 'Select all'}
                  </button>
                  <span className="text-xs text-gray-400">{selected.size} selected</span>
                </div>
                <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto divide-y divide-gray-50">
                  {subscribers.map((s) => (
                    <label key={s.id} className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggleOne(s.id)}
                        style={{ accentColor: '#E8192C' }}
                      />
                      <span className="text-navy">{s.email}</span>
                    </label>
                  ))}
                  {subscribers.length === 0 && (
                    <p className="px-4 py-6 text-center text-gray-400 text-sm">No subscribers yet.</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className={labelClass}>Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. MJA Monthly Recap — September 2026" className={inputClass} />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass} style={{ marginBottom: 0 }}>Content</label>
                  <button
                    onClick={() => setShowPreview((v) => !v)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Eye size={13} /> {showPreview ? 'Hide preview' : 'Preview'}
                  </button>
                </div>

                {blocks.map((block, i) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    onChange={(b) => updateBlock(block.id, b)}
                    onRemove={() => removeBlock(block.id)}
                    onMove={(dir) => moveBlock(block.id, dir)}
                    isFirst={i === 0}
                    isLast={i === blocks.length - 1}
                    articles={articles}
                    publications={publications}
                  />
                ))}

                <div className="flex flex-wrap gap-2 mt-2">
                  {BLOCK_TYPES.map((bt) => (
                    <button
                      key={bt.type}
                      onClick={() => addBlock(bt.type)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-navy transition-colors"
                    >
                      <Plus size={13} /> {bt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Sent using the standard MJA email design (logo, header, footer, unsubscribe link) automatically.</p>
              </div>

              {error && <p className="text-sm mb-4" style={{ color: '#E8192C' }}>{error}</p>}
              {result && <p className="text-sm mb-4 text-green-600">{result}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleSend}
                  disabled={sending || !subject || !hasContent || selected.size === 0}
                  className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: '#E8192C' }}
                >
                  {sending ? 'Sending...' : `Send to ${selected.size || 0}`}
                </button>
                <button onClick={closeCompose} className="border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>

            {showPreview && (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100" style={{ height: 640 }}>
                <iframe title="Newsletter preview" srcDoc={previewHtml} className="w-full h-full" style={{ border: 0 }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export button */}
      <div className="flex justify-end mb-4">
        <a
          href={`data:text/csv;charset=utf-8,Email,Subscribed At\n${subscribers.map((s) => `${s.email},${s.subscribed_at}`).join('\n')}`}
          download="mja-subscribers.csv"
          className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#0D1B2A' }}
        >
          Export CSV
        </a>
      </div>

      {/* Subscribers list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_160px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
          <span>Email</span>
          <span>Subscribed</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
          {subscribers.map((sub) => (
            <div key={sub.id} className="grid grid-cols-[1fr_160px] gap-4 px-6 py-3.5 items-center">
              <p className="text-sm text-navy">{sub.email}</p>
              <p className="text-xs text-gray-400">
                {new Date(sub.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
          {subscribers.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">No subscribers yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
