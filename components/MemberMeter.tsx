'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import type { MemberStats } from '@/lib/types'

interface Props {
  stats: MemberStats
}

export default function MemberMeter({ stats }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const total = stats.local + stats.international + stats.non_member_contributors

  const segments = [
    { label: 'Local Members', count: stats.local, color: '#00B5AD', pct: (stats.local / total) * 100 },
    { label: 'International Members', count: stats.international, color: '#60A5FA', pct: (stats.international / total) * 100 },
    { label: 'Non-Member Contributors', count: stats.non_member_contributors, color: '#F59E0B', pct: (stats.non_member_contributors / total) * 100 },
  ]

  return (
    <div ref={ref} className="bg-navy rounded-xl p-8 text-white">
      <p className="text-[11px] font-bold tracking-widest uppercase text-teal-400 mb-1">MJA</p>
      <p className="font-headline text-2xl font-bold mb-6">Membermeter</p>

      {/* Bar */}
      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden flex mb-7">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${seg.pct}%` } : { width: 0 }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
            style={{ background: seg.color }}
            className="h-full"
          />
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-white/60">{seg.label}</span>
            </div>
            <span className="font-bold">{seg.count.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm border-t border-white/10 pt-3 mt-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
            <span className="text-white/60">Total Number of Members</span>
          </div>
          <span className="font-bold">{stats.total.toLocaleString()}</span>
        </div>
      </div>

      <Link
        href="/members-directory"
        className="mt-6 block text-center border border-white/20 text-white text-sm font-semibold py-2.5 rounded hover:border-teal-400 hover:bg-teal-400/10 transition-colors"
      >
        View Details →
      </Link>
    </div>
  )
}
