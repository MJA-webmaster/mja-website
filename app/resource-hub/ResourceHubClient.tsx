'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Resource } from '@/lib/types'
import { Download, ExternalLink, Search, FileText, Film, Eye } from 'lucide-react'

interface Category {
  slug: string
  label: string
  blurb: string
  subcategories: readonly string[]
}

interface Props {
  resources: Resource[]
  categories: readonly Category[]
  currentCategory: string
  currentSub: string
  currentSearch: string
}

function DocIcon({ category }: { category: string }) {
  if (category === 'multimedia') return <Film size={28} style={{ color: '#E8192C' }} />
  return <FileText size={28} style={{ color: '#E8192C' }} />
}

function DocumentCard({ resource }: { resource: Resource }) {
  const hasCover = Boolean(resource.cover_image)
  const isImageFile = resource.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Cover — A4 ratio */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#F3F4F6', aspectRatio: '1 / 1.414' }}
      >
        {hasCover ? (
          <img
            src={resource.cover_image!}
            alt={resource.title}
            className="w-full h-full object-cover object-top"
          />
        ) : isImageFile && resource.file_url ? (
          <img
            src={resource.file_url}
            alt={resource.title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(232,25,44,0.08)' }}
            >
              <DocIcon category={resource.category} />
            </div>
            {resource.file_size && (
              <span className="text-[10px] text-gray-400 font-mono">{resource.file_size}</span>
            )}
          </div>
        )}

        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded"
            style={{ backgroundColor: '#E8192C', color: 'white' }}
          >
            {resource.subcategory ?? resource.category.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-navy text-[13px] leading-snug mb-1 flex-1">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-gray-400 text-[11px] leading-relaxed mb-3 line-clamp-2">
            {resource.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-50">
          {resource.file_url && (
            <>
              {/* View — opens inline */}
              <button
                type="button"
                onClick={() => window.open(resource.file_url!, '_blank', 'noopener,noreferrer')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Eye size={12} />
                View
              </button>
              {/* Download — forces download */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch(resource.file_url!)
                    const blob = await res.blob()
                    const blobUrl = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = blobUrl
                    a.download = resource.title + (resource.file_url!.endsWith('.pdf') ? '.pdf' : '')
                    a.click()
                    URL.revokeObjectURL(blobUrl)
                  } catch {
                    window.open(resource.file_url!, '_blank', 'noopener,noreferrer')
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-colors"
                style={{ backgroundColor: '#E8192C', color: 'white' }}
              >
                <Download size={12} />
                Download
              </button>
            </>
          )}
          {!resource.file_url && resource.external_url && (
            <button
              type="button"
              onClick={() => window.open(resource.external_url!, '_blank', 'noopener,noreferrer')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={12} />
              View Online
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResourceHubClient({
  resources,
  categories,
  currentCategory,
  currentSub,
  currentSearch,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch)

  function push(category: string, sub: string, q: string) {
    const params = new URLSearchParams()
    params.set('category', category)
    if (sub) params.set('sub', sub)
    if (q) params.set('q', q)
    router.push(pathname + '?' + params.toString())
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    push(currentCategory, currentSub, search)
  }

  const allTab = { slug: 'all', label: 'All Documents', blurb: '', subcategories: [] as readonly string[] }
  const tabs = [allTab, ...categories]

  return (
    <div>
      {/* Integrated search */}
      <form onSubmit={handleSearch} className="flex items-center mb-8 border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="pl-5 text-gray-300 flex-shrink-0">
          <Search size={17} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports, guidelines, submissions..."
          className="flex-1 px-4 py-4 text-sm text-navy focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          className="px-7 py-4 text-white text-xs font-bold tracking-widest uppercase flex-shrink-0 transition-opacity hover:opacity-85"
          style={{ backgroundColor: '#E8192C' }}
        >
          Search
        </button>
      </form>

      {/* Horizontal tab strip */}
      <div className="flex flex-wrap gap-2 mb-2 pb-4 border-b border-gray-100">
        {tabs.map((cat) => {
          const isActive = currentCategory === cat.slug
          return (
            <button
              key={cat.slug}
              onClick={() => push(cat.slug, '', search)}
              className="px-5 py-2 rounded-full text-[13px] font-semibold transition-colors"
              style={{
                backgroundColor: isActive ? '#0D1B2A' : '#F3F4F6',
                color: isActive ? 'white' : '#6B7280',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Subcategory pills */}
      {currentCategory !== 'all' && (() => {
        const active = categories.find((c) => c.slug === currentCategory)
        if (!active || active.subcategories.length === 0) return null
        return (
          <div className="flex flex-wrap gap-2 mb-6 mt-3">
            <button
              onClick={() => push(currentCategory, '', search)}
              className="px-4 py-1 rounded-full text-[11px] font-semibold border transition-colors"
              style={{
                borderColor: !currentSub ? '#0D1B2A' : '#E5E7EB',
                backgroundColor: !currentSub ? '#0D1B2A' : 'white',
                color: !currentSub ? 'white' : '#6B7280',
              }}
            >
              All
            </button>
            {active.subcategories.map((sub) => {
              const isActive = currentSub === sub
              return (
                <button
                  key={sub}
                  onClick={() => push(currentCategory, sub, search)}
                  className="px-4 py-1 rounded-full text-[11px] font-semibold border transition-colors"
                  style={{
                    borderColor: isActive ? '#0D1B2A' : '#E5E7EB',
                    backgroundColor: isActive ? '#0D1B2A' : 'white',
                    color: isActive ? 'white' : '#6B7280',
                  }}
                >
                  {sub}
                </button>
              )
            })}
          </div>
        )
      })()}

      {/* Count */}
      {resources.length > 0 && (
        <div className="flex items-center justify-between mb-5 mt-4">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-navy">{resources.length}</span> document{resources.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Document grid */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {resources.map((resource) => (
            <DocumentCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📁</p>
          <p className="font-semibold text-sm">No documents found</p>
          <p className="text-xs mt-1">
            {currentSearch ? 'Try a different search term' : 'Documents will appear here once added'}
          </p>
        </div>
      )}

      {/* Bottom banner */}
      <div
        className="mt-14 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ backgroundColor: '#0D1B2A' }}
      >
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#E8192C' }}>
            Defend the public right to know
          </p>
          <h3 className="font-headline font-black text-white text-xl md:text-2xl leading-tight">
            Independent reporting needs defending<br className="hidden md:block" /> before it is silenced.
          </h3>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => window.location.href = '/join-mja#form'}
            className="font-bold text-sm px-7 py-3 rounded-lg transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#E8192C', color: 'white' }}
          >
            Join the Union →
          </button>
        </div>
      </div>
    </div>
  )
}
