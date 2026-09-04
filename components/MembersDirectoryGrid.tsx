'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Member } from '@/lib/types'
import { Search } from 'lucide-react'

const selectClass = 'border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none bg-white'

const PAGE_SIZE = 24

type SortKey = 'custom' | 'name-asc' | 'name-desc' | 'joined-newest' | 'joined-oldest'

function joinedDate(m: Member) {
  return new Date(m.member_since ?? m.created_at).getTime()
}

export default function MembersDirectoryGrid({ members }: { members: Member[] }) {
  const [query, setQuery] = useState('')
  const [outlet, setOutlet] = useState('')
  const [membershipType, setMembershipType] = useState('')
  const [sort, setSort] = useState<SortKey>('custom')
  const [page, setPage] = useState(1)

  const outlets = useMemo(
    () => Array.from(new Set(members.map((m) => m.representing).filter(Boolean))) as string[],
    [members]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = members.filter((m) => {
      const matchesQuery = !q || m.name.toLowerCase().includes(q) || (m.representing ?? '').toLowerCase().includes(q)
      const matchesOutlet = !outlet || m.representing === outlet
      const matchesType = !membershipType || m.membership_type === membershipType
      return matchesQuery && matchesOutlet && matchesType
    })

    const sorted = [...list]
    switch (sort) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'joined-newest':
        sorted.sort((a, b) => joinedDate(b) - joinedDate(a))
        break
      case 'joined-oldest':
        sorted.sort((a, b) => joinedDate(a) - joinedDate(b))
        break
      case 'custom':
      default:
        sorted.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name))
        break
    }
    return sorted
  }, [members, query, outlet, membershipType, sort])

  useEffect(() => { setPage(1) }, [query, outlet, membershipType, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by member name or outlet..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-navy focus:outline-none"
          />
        </div>
        <select className={selectClass} value={outlet} onChange={(e) => setOutlet(e.target.value)}>
          <option value="">All Outlets</option>
          {outlets.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select className={selectClass} value={membershipType} onChange={(e) => setMembershipType(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Professional">Accredited Journalist</option>
          <option value="Student">Student Member</option>
          <option value="Corporate">Corporate Member</option>
          <option value="Affiliate">Affiliate Member</option>
        </select>
      </div>

      {/* Sort + result count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-gray-400">{filtered.length} member{filtered.length === 1 ? '' : 's'}</p>
        <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="custom">Featured Order</option>
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="joined-newest">Last Joined</option>
          <option value="joined-oldest">First Joined</option>
        </select>
      </div>

      {/* Member grid */}
      {paged.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {paged.map((member) => (
              <div key={member.id} className="border border-gray-100 rounded-xl p-5 text-center hover:border-gray-200 transition-colors">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mx-auto mb-3 relative" style={{ border: '3px solid #E5E7EB' }}>
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl">
                      {member.name[0]}
                    </div>
                  )}
                </div>
                <p className="font-bold text-sm text-navy leading-tight mb-1.5">{member.name}</p>
                {member.representing && (
                  <p className="text-xs text-gray-500">{member.representing}</p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: page === n ? '#E8192C' : '#F3F4F6',
                    color: page === n ? 'white' : '#6B7280',
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : members.length > 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-semibold text-sm">No members match your search</p>
        </div>
      ) : (
        <div className="text-center py-16 border border-gray-100 rounded-xl">
          <p className="font-bold text-navy text-sm mb-2">No registered members found in this category.</p>
          <p className="text-gray-500 text-[13px] mb-5">
            Are you an active journalist in this field? Apply for your MJA accreditation to join the registry.
          </p>
          <Link
            href="/join-mja"
            className="inline-block text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#E8192C' }}
          >
            Apply for Directory Listing →
          </Link>
        </div>
      )}
    </div>
  )
}
