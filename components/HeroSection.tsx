'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Campaign } from '@/lib/types'

interface Props {
  campaign?: Campaign | null
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const fadeRight = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
}

export default function HeroSection({ campaign }: Props) {
  return (
    <section className="grid md:grid-cols-2" style={{ minHeight: 'clamp(400px, 55vh, 560px)' }}>
      {/* Campaign panel */}
      <div className="relative flex flex-col justify-between p-10 md:p-14 overflow-hidden text-white"
        style={{ backgroundColor: '#E8192C' }}>
        {/* Big decorative M */}
        <div className="absolute bottom-0 left-0 font-headline font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(160px, 22vw, 280px)', color: 'rgba(0,0,0,0.12)', lineHeight: 0.85 }}>
          M
        </div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col h-full justify-between"
        >
          <div>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 mb-4"
            >
              Upcoming Campaigns
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-headline font-black uppercase leading-[0.95] mb-5"
              style={{ fontSize: 'clamp(28px, 3.5vw, 46px)' }}
            >
              {campaign ? (
                <>
                  {campaign.hashtag && (
                    <span className="block text-white/75 text-[0.7em] mb-1">{campaign.hashtag}</span>
                  )}
                  {campaign.title}
                </>
              ) : (
                <>
                  <span className="block text-white/75 text-[0.7em] mb-1">#FreedomForPress</span>
                  MV of Press Rally
                </>
              )}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="text-white/65 text-sm leading-relaxed mb-4 max-w-xs"
            >
              {campaign?.description ?? 'Walking towards the freedom of press and undeniable truth. Join us in defending freedom of information.'}
            </motion.p>

            {campaign?.event_date && (
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="text-white/50 text-xs mb-6"
              >
                {new Date(campaign.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                {campaign.event_location && ` — ${campaign.event_location}`}
              </motion.p>
            )}
          </div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-3 flex-wrap mt-6"
          >
            <Link
              href={campaign ? `/campaigns/${campaign.slug}` : '/campaigns'}
              className="bg-white font-bold px-7 py-3 rounded text-sm hover:bg-white/90 transition-colors"
              style={{ color: '#E8192C' }}
            >
              Join the Rally
            </Link>
            <Link
              href="/join-mja"
              className="border border-white/35 text-white px-7 py-3 rounded text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Contribute
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Be the Voice panel */}
      <div className="relative flex flex-col justify-center p-10 md:p-14 overflow-hidden text-white"
        style={{ backgroundColor: '#0D1B2A' }}>
        {/* Mic decoration */}
        <div className="absolute right-6 bottom-0 opacity-[0.07] pointer-events-none select-none">
          <svg viewBox="0 0 160 240" className="w-40 h-56" fill="none">
            <rect x="50" y="10" width="60" height="110" rx="30" fill="white"/>
            <line x1="80" y1="120" x2="80" y2="165" stroke="white" strokeWidth="7"/>
            <line x1="48" y1="165" x2="112" y2="165" stroke="white" strokeWidth="7" strokeLinecap="round"/>
            <path d="M30 95 Q20 110 30 125" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M130 95 Q140 110 130 125" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        <motion.div
          variants={fadeRight}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-5"
          >
            Maldives Journalists Association
          </motion.p>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="font-headline font-black leading-[0.95] mb-7"
            style={{ fontSize: 'clamp(36px, 4.5vw, 58px)' }}
          >
            Be the{' '}
            <em className="not-italic" style={{ color: '#E8192C' }}>voice</em>
            <br />for freedom
            <br />of press
          </motion.h2>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link
              href="/join-mja"
              className="inline-block text-white font-semibold px-8 py-3.5 rounded transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#E8192C' }}
            >
              Become a Member
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
