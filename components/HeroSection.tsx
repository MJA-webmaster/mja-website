'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Campaign } from '@/lib/types'

interface Props {
  campaign?: Campaign | null
}

export default function HeroSection({ campaign }: Props) {
  return (
    <section className="grid md:grid-cols-2 min-h-[480px]">
      {/* Campaign panel */}
      <div className="bg-red text-white p-10 flex flex-col justify-between relative overflow-hidden">
        {/* BG decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="font-headline font-black text-[200px] leading-none text-white absolute -bottom-8 -left-4">M</div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-white/70 mb-3">Upcoming Campaigns</p>
          {campaign ? (
            <>
              <h1 className="font-headline text-3xl md:text-4xl font-black uppercase leading-tight mb-4">
                {campaign.hashtag && <span className="block text-white/80">{campaign.hashtag}</span>}
                {campaign.title}
              </h1>
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                {campaign.description}
              </p>
              {campaign.event_date && (
                <p className="text-white/60 text-xs mb-6">
                  {new Date(campaign.event_date).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                  {campaign.event_location && ` — ${campaign.event_location}`}
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="font-headline text-3xl md:text-4xl font-black uppercase leading-tight mb-4">
                <span className="block text-white/80">#FreedomForPress</span>
                MV of Press Rally
              </h1>
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                Walking towards the freedom of press and undeniable truth. Join us in defending freedom of information for every journalist.
              </p>
            </>
          )}
          <div className="flex gap-3 flex-wrap">
            <Link
              href={campaign ? `/campaigns/${campaign.slug}` : '/campaigns'}
              className="bg-white text-red px-6 py-2.5 rounded text-sm font-bold hover:bg-white/90 transition-colors"
            >
              Join the Rally
            </Link>
            <Link
              href="/join-mja"
              className="border border-white/40 text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-white/10 transition-colors"
            >
              Contribute
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Be the Voice panel */}
      <div className="bg-navy text-white p-10 flex flex-col justify-center relative overflow-hidden">
        {/* Mic SVG decoration */}
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg viewBox="0 0 200 280" className="w-48 h-64" fill="none">
            <rect x="70" y="20" width="60" height="120" rx="30" fill="white"/>
            <line x1="100" y1="140" x2="100" y2="190" stroke="white" strokeWidth="8"/>
            <line x1="65" y1="190" x2="135" y2="190" stroke="white" strokeWidth="8" strokeLinecap="round"/>
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">Maldives Journalist Association</p>
          <h2 className="font-headline text-4xl md:text-5xl font-black leading-tight mb-6">
            Be the <span className="text-red">voice</span><br />
            for freedom<br />
            of press
          </h2>
          <Link
            href="/join-mja"
            className="inline-block bg-red text-white px-8 py-3.5 rounded font-semibold hover:bg-red-dark transition-colors"
          >
            Become a Member
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
