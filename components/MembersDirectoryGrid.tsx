'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Member } from '@/lib/types'
import { Search } from 'lucide-react'

const badgeCopy: Record<Member['membership_type'], string> = {
  Professional: 'Accredited Journalist',
  Student: 'Student Member',
  Corporate: 'Corporate Member',
  Affiliate: 'Affiliate Member',
}

const selectClass = 'border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-navy focus:outline-none bg-white'

export default function MembersDirectoryGrid({ members }: { members: Member[] }) {
  const [query, setQuery] = useState('')
  const [outlet, setOutlet] = useState('')
  const [membershipType, setMembershipType] = useState('')

  const outlets = useMemo(
    () => Array.from(new Set(members.map((m) => m.representing).filter(Boolean))) as string[],
    [members]
  )

  const filtered = members.filter((m) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || m.name.toLowerCase().includes(q) || (m.representing ?? '').toLowerCase().includes(q)
    const matchesOutlet = !outlet || m.representing === outlet
    const matchesType = !membershipType || m.membership_type === membershipType
    return matchesQuery && matchesOutlet && matchesType
  })

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
        </select>
      </div>

      {/* Member grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filtered.map((member) => (
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
              <span
                className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide mb-2"
                style={{ backgroundColor: 'rgba(232,25,44,0.08)', color: '#E8192C' }}
              >
                {badgeCopy[member.membership_type] ?? member.membership_type}
              </span>
              {member.representing && (
                <p className="text-xs text-gray-500">{member.representing}</p>
              )}
            </div>
          ))}
        </div>
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
