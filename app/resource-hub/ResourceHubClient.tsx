'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Resource } from '@/lib/types'
import { Download, FileText, Image as ImageIcon, BookOpen, ExternalLink } from 'lucide-react'

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

export default function ResourceHubClient(props: Props) {
  const { resources, categories, currentCategory, currentSub, currentSearch } = props

  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch)

  const active = categories.find((c) => c.slug === currentCategory)

  function iconFor(slug: string) {
    if (slug === 'multimedia') return ImageIcon
    if (slug === 'annual-reports') return FileText
    return BookOpen
  }

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

  return (
    <div>
      {/* Search */}
      <form onSubmit={handleSearch} className="flex mb-10 border border-gray-200 rounded-lg overflow-hidden">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources..."
          className="flex-1 px-5 py-4 text-sm text-navy focus:outline-none"
        />
        <button
          type="submit"
          className="px-8 py-4 text-white text-xs font-bold tracking-widest uppercase"
          style={{ backgroundColor: '#E8192C' }}
        >
          Search
        </button>
      </form>

      <div className="md:grid md:grid-cols-[240px_1fr] md:gap-10">
        {/* Category sidebar */}
        <aside className="mb-8 md:mb-0">
          <nav className="flex md:block gap-2 overflow-x-auto pb-2 md:pb-0 md:space-y-1">
            {categories.map((cat) => {
              const Icon = iconFor(cat.slug)
              const isActive = currentCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  onClick={() => push(cat.slug, '', search)}
                  className="flex-shrink-0 md:w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap md:whitespace-normal"
                  style={{
                    backgroundColor: isActive ? '#E8192C' : 'transparent',
                    color: isActive ? 'white' : '#6B7280',
                  }}
                >
                  <Icon size={16} strokeWidth={1.75} className="mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="block text-[14px] font-semibold">{cat.label}</span>
                    <span
                      className="hidden md:block text-[11px] mt-0.5 leading-snug"
                      style={{ color: isActive ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}
                    >
                      {cat.blurb}
                    </span>
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Resources list */}
        <div>
          {active && active.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => push(currentCategory, '', search)}
                className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                style={{
                  backgroundColor: currentSub ? '#F3F4F6' : '#0D1B2A',
                  color: currentSub ? '#6B7280' : 'white',
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
                    className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                    style={{
                      backgroundColor: isActive ? '#0D1B2A' : '#F3F4F6',
                      color: isActive ? 'white' : '#6B7280',
                    }}
                  >
                    {sub}
                  </button>
                )
              })}
            </div>
          )}

          {resources.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between py-4 group">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-semibold text-navy group-hover:text-red transition-colors line-clamp-2">
                      {resource.title}
                    </p>
                    {resource.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{resource.description}</p>
                    )}
                    {resource.subcategory && (
                      <p className="text-[11px] text-gray-300 mt-1 uppercase tracking-wide">
                        {resource.subcategory}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {resource.file_url ? (
                      
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: '#E8192C' }}
                      >
                        <Download size={16} />
                        {resource.file_size && <span className="text-gray-400">{resource.file_size}</span>}
                      </a>
                    ) : resource.external_url ? (
                      
                        href={resource.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: '#E8192C' }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-semibold text-sm">No resources found</p>
              <p className="text-xs mt-1">
                {currentSearch ? 'Try a different search term' : 'Resources will appear here once added'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
