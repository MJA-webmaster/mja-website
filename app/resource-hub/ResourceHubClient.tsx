'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Resource } from '@/lib/types'
import { Download, FileText, Image, Video, BookOpen, ExternalLink } from 'lucide-react'

const categories = [
  { value: 'publication', label: 'Publications', icon: BookOpen },
  { value: 'photo', label: 'Photos', icon: Image },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'code-of-conduct', label: 'Code of Conduct', icon: FileText },
]

interface Props {
  resources: Resource[]
  currentCategory: string
  currentSearch: string
}

export default function ResourceHubClient({ resources, currentCategory, currentSearch }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('category', currentCategory)
    if (search) params.set('q', search)
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleCategory(cat: string) {
    const params = new URLSearchParams()
    params.set('category', cat)
    if (search) params.set('q', search)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-0 mb-10 border border-gray-200 rounded-lg overflow-hidden">
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

      <div className="grid grid-cols-[200px_1fr] gap-10">
        {/* Sidebar */}
        <aside>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = currentCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategory(cat.value)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-colors"
                  style={{
                    backgroundColor: isActive ? '#E8192C' : 'transparent',
                    color: isActive ? 'white' : '#6B7280',
                  }}
                >
                  <Icon size={15} strokeWidth={1.75} />
                  {cat.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Resources list */}
        <div>
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
                    {resource.file_size && (
                      <p className="text-xs text-gray-300 mt-0.5">{resource.file_size}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {resource.file_url ? (
                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: '#E8192C' }}
                      >
                        <Download size={16} />
                        <span className="text-gray-400">{resource.file_size}</span>
                      </a>
                    ) : resource.external_url ? (
                      <a
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
