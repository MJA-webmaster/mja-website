'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Campaign } from '@/lib/types'

interface Props {
  campaign?: Campaign | null
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection({ campaign }: Props) {
  return (
    <section className="grid md:grid-cols-2" style={{ minHeight: 'clamp(460px, 58vh, 580px)' }}>

      {/* ── Campaign panel ── */}
      <div className="relative flex flex-col justify-between p-10 md:p-14 overflow-hidden text-white"
        style={{ backgroundColor: '#E8192C' }}>

        {/* Decorative M — bottom right so it doesn't clip */}
        <div className="absolute bottom-0 right-0 font-headline font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(200px, 28vw, 340px)', color: 'rgba(0,0,0,0.1)', lineHeight: 0.8, transform: 'translateX(20%)' }}>
          M
        </div>

        <div className="relative z-10">
          <motion.p {...fadeUp(0)} className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/60 mb-5">
            Upcoming Campaigns
          </motion.p>

          <motion.h1 {...fadeUp(0.08)}
            className="font-headline font-black uppercase leading-[0.92] mb-5"
            style={{ fontSize: 'clamp(30px, 3.8vw, 48px)' }}>
            {campaign ? (
              <>
                {campaign.hashtag && (
                  <span className="block mb-1" style={{ fontSize: '0.65em', color: 'rgba(255,255,255,0.75)' }}>
                    {campaign.hashtag}
                  </span>
                )}
                {campaign.title}
              </>
            ) : (
              <>
                <span className="block mb-1" style={{ fontSize: '0.65em', color: 'rgba(255,255,255,0.75)' }}>
                  #FreedomForPress
                </span>
                MV of Press Rally
              </>
            )}
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="text-sm leading-relaxed mb-2 max-w-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {campaign?.description ?? 'Walking towards the freedom of press and undeniable truth. Join us in defending freedom of information.'}
          </motion.p>

          {campaign?.event_date && (
            <motion.p {...fadeUp(0.2)} className="text-xs mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {new Date(campaign.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              {campaign.event_location && ` — ${campaign.event_location}`}
            </motion.p>
          )}
        </div>

        <motion.div {...fadeUp(0.28)} className="relative z-10 flex gap-3 flex-wrap mt-8">
          <Link
            href={campaign ? `/campaigns/${campaign.slug}` : '/campaigns'}
            className="font-bold px-7 py-3 rounded text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: 'white', color: '#E8192C' }}
          >
            Join the Rally
          </Link>
          <Link
            href="/join-mja"
            className="font-semibold px-7 py-3 rounded text-sm transition-all"
            style={{ border: '1.5px solid rgba(255,255,255,0.4)', color: 'white' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
          >
            Contribute
          </Link>
        </motion.div>
      </div>

      {/* ── Be the Voice panel ── */}
      <div className="relative flex flex-col justify-center p-10 md:p-14 overflow-hidden text-white"
        style={{ backgroundColor: '#0D1B2A' }}>

        {/* Mic decoration */}
        <div className="absolute right-8 bottom-4 pointer-events-none select-none" style={{ opacity: 0.06 }}>
          <svg viewBox="0 0 140 220" className="w-36 h-52" fill="none">
            <rect x="40" y="8" width="60" height="110" rx="30" fill="white"/>
            <line x1="70" y1="118" x2="70" y2="160" stroke="white" strokeWidth="7"/>
            <line x1="40" y1="160" x2="100" y2="160" stroke="white" strokeWidth="7" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="relative z-10">
          <motion.p {...fadeUp(0.1)}
            className="text-[10px] font-bold tracking-[0.22em] uppercase mb-5"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            Maldives Journalists Association
          </motion.p>

          <motion.h2 {...fadeUp(0.18)}
            className="font-headline font-black leading-[0.92] mb-8"
            style={{ fontSize: 'clamp(38px, 5vw, 62px)' }}>
            Be the{' '}
            <span style={{ color: '#E8192C' }}>voice</span>
            <br />for freedom
            <br />of press
          </motion.h2>

          <motion.div {...fadeUp(0.28)}>
            <Link
              href="/join-mja"
              className="inline-block text-white font-semibold px-8 py-3.5 rounded text-sm transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#E8192C' }}
            >
              Become a Member
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
