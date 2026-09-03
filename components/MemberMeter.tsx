'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Link from 'next/link'
import type { MemberStats } from '@/lib/types'

interface Props {
  stats: MemberStats
}

export default function MemberMeter({ stats }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const rows = [
    { label: 'Members Total', value: stats.total },
    { label: 'Number of Media Outlets', value: stats.media_outlets },
    { label: 'Male', value: stats.male },
    { label: 'Female', value: stats.female },
  ]

  return (
    <div ref={ref} className="bg-navy rounded-xl p-8 text-white">
      <p className="text-[11px] font-bold tracking-widest uppercase text-teal-400 mb-1">MJA</p>
      <p className="font-headline text-2xl font-bold mb-6">Membership</p>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0"
          >
            <span className="text-white/60 text-sm">{row.label}</span>
            <span className="font-headline text-2xl font-black text-white">
              {(row.value ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/members-directory"
        className="mt-6 block text-center border border-white/20 text-white text-sm font-semibold py-2.5 rounded hover:border-teal-400 hover:bg-teal-400/10 transition-colors"
      >
        View Directory →
      </Link>
    </div>
  )
}
