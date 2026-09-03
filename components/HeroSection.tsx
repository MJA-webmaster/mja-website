'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Campaign } from '@/lib/types'

interface Props {
  campaign?: Campaign | null
  dispatch?: string | null
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection({ campaign, dispatch }: Props) {
  const today = new Date().toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase()

  return (
    <section style={{ backgroundColor: '#0A1520', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background photo + dark overlay for text legibility ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.90,
          zIndex: 0,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10,21,32,0.75) 0%, rgba(10,21,32,0.92) 70%, #0A1520 100%)',
          zIndex: 0,
        }}
      />

      {/* ── Grain texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      {/* ── Editorial hairlines ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute left-0 right-0" style={{ top: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute top-0 bottom-0" style={{ left: '33.333%', width: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div className="absolute top-0 bottom-0" style={{ right: '33.333%', width: '1px', backgroundColor: 'rgba(255,255,255,0.04)' }} />
      </div>

      {/* ── Main editorial block ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 pt-16 pb-0">

        {/* Dateline */}
        <motion.div {...fade(0)} className="flex items-center gap-4 mb-10">
          <span
            className="text-[10px] font-bold tracking-[0.25em] uppercase"
            style={{ color: '#E8192C' }}
          >
            Maldives Journalists Association
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Est. 2009
          </span>
        </motion.div>

        {/* Monumental headline */}
        <motion.h1
          {...fade(0.08)}
          className="font-headline font-black uppercase leading-[0.88] mb-8"
          style={{
            fontSize: 'clamp(52px, 9vw, 128px)',
            color: 'white',
            letterSpacing: '-0.02em',
          }}
        >
          {campaign ? (
            <>
              {campaign.hashtag && (
                <span className="block text-[0.3em] tracking-widest font-bold mb-2" style={{ color: '#E8192C', letterSpacing: '0.15em' }}>
                  {campaign.hashtag}
                </span>
              )}
              <span style={{ color: '#E8192C' }}>{campaign.title.split(' ').slice(0, 2).join(' ')}</span>
              <br />
              {campaign.title.split(' ').slice(2).join(' ')}
            </>
          ) : (
            <>
              Defending<br />
              <span style={{ color: '#E8192C' }}>The Truth</span><br />
              Is Not<br />A Crime.
            </>
          )}
        </motion.h1>

        {/* Body copy */}
        <motion.p
          {...fade(0.18)}
          className="max-w-xl mb-10 leading-relaxed"
          style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}
        >
          {campaign?.description ?? (
            'The independent union of working reporters, photojournalists, and editors across the archipelago—standing against censorship, harassment, and legal intimidation since 2009.'
          )}
        </motion.p>

        {/* Action row */}
        <motion.div {...fade(0.26)} className="flex flex-wrap items-center gap-3 mb-14">
          <Link
            href="/join-mja#form"
            className="font-bold text-sm px-8 py-3.5 rounded transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#E8192C', color: 'white', letterSpacing: '0.04em' }}
          >
            {campaign ? 'Join the Campaign' : 'Become a Member'}
          </Link>
          <Link
            href="/connect"
            className="font-semibold text-sm px-8 py-3.5 rounded transition-colors flex items-center gap-2"
            style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            Report an Attack / Legal Hotline
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <path d="M3 13L13 3M13 3H6M13 3v7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          {campaign && (
            <Link
              href={`/campaigns/${campaign.slug}`}
              className="font-semibold text-sm px-8 py-3.5 rounded transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
            >
              Read More →
            </Link>
          )}
        </motion.div>
      </div>

      {/* ── Live dispatch ticker ── */}
      <motion.div
        {...fade(0.35)}
        className="relative z-10 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-3 flex items-center gap-4">
          <span
            className="text-[9px] font-black tracking-[0.2em] uppercase flex-shrink-0 px-2 py-1 rounded"
            style={{ backgroundColor: '#E8192C', color: 'white' }}
          >
            Live
          </span>
          <span className="text-[11px] tracking-wide flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {`MALÉ — ${today}`}
          </span>
          <div className="w-px h-3 flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <p className="text-[12px] truncate flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {dispatch ?? 'MJA monitors press freedom conditions across the Maldives archipelago — reporting threats, supporting journalists, and advocating for the right to inform.'}
          </p>
          <Link
            href="/news-room"
            className="text-[11px] font-bold tracking-widest uppercase flex-shrink-0 hover:opacity-70 transition-opacity"
            style={{ color: '#E8192C' }}
          >
            Read Brief →
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
