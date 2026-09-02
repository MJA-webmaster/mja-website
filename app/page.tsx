
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ArticleCard from '@/components/ArticleCard'
import MemberMeter from '@/components/MemberMeter'
import NewsletterForm from '@/components/NewsletterForm'
import HeroSection from '@/components/HeroSection'
import GetInvolved from '@/components/GetInvolved'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HomePage() {
  const [data, setData] = useState<any>({
    latestArticles: [], topNews: [], newsRoom: [], campaign: null, stats: null,
  })

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('articles').select('*').eq('published', true).eq('category', 'latest').order('published_at', { ascending: false }).limit(4),
      supabase.from('articles').select('*').eq('published', true).eq('category', 'top-news').order('published_at', { ascending: false }).limit(2),
      supabase.from('articles').select('*').eq('published', true).eq('category', 'news-room').order('published_at', { ascending: false }).limit(2),
      supabase.from('campaigns').select('*').eq('published', true).order('created_at', { ascending: false }).limit(1),
      supabase.from('member_stats').select('*').single(),
    ]).then(([latest, top, room, campaigns, stats]) => {
      setData({
        latestArticles: latest.data ?? [],
        topNews: top.data ?? [],
        newsRoom: room.data ?? [],
        campaign: campaigns.data?.[0] ?? null,
        stats: stats.data,
      })
    })
  }, [])

  const memberStats = data.stats
    ? { ...data.stats, total: data.stats.local + data.stats.international + data.stats.non_member_contributors }
    : { local: 2000, international: 1300, non_member_contributors: 560, total: 3860 }

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection campaign={data.campaign} />

      {/* ── Latest in MJA ── */}
      {data.latestArticles.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-16 pb-10">
          <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-black uppercase" style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', color: '#0D1B2A' }}>
              <span style={{ color: '#E8192C' }}>Latest</span> in MJA
            </h2>
            <Link href="/news-room" className="text-xs font-bold tracking-wider uppercase hover:underline" style={{ color: '#E8192C' }}>
              View all →
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.latestArticles.map((article: any, i: number) => (
              <motion.div key={article.id} {...fadeUp(i * 0.07)}>
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Top News + News Room ── */}
      {(data.topNews.length > 0 || data.newsRoom.length > 0) && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {data.topNews.length > 0 && (
              <div>
                <motion.div {...fadeUp()} className="flex items-center justify-between mb-6">
                  <h2 className="font-headline font-black uppercase" style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', color: '#0D1B2A' }}>
                    <span style={{ color: '#E8192C' }}>Top</span> News
                  </h2>
                  <Link href="/news-room" className="text-xs font-bold tracking-wider uppercase hover:underline" style={{ color: '#E8192C' }}>
                    More →
                  </Link>
                </motion.div>
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  {data.topNews.map((article: any, i: number) => (
                    <motion.div key={article.id} {...fadeUp(i * 0.1)}>
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {data.newsRoom.length > 0 && (
              <div>
                <motion.div {...fadeUp(0.1)} className="flex items-center justify-between mb-6">
                  <h2 className="font-headline font-black uppercase" style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', color: '#0D1B2A' }}>
                    <span style={{ color: '#E8192C' }}>News</span> Room
                  </h2>
                  <Link href="/news-room" className="text-xs font-bold tracking-wider uppercase hover:underline" style={{ color: '#E8192C' }}>
                    More →
                  </Link>
                </motion.div>
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  {data.newsRoom.map((article: any, i: number) => (
                    <motion.div key={article.id} {...fadeUp(i * 0.1 + 0.1)}>
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA bar ── */}
      <section className="border-t border-b border-gray-100 py-5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-3">
          <Link href="/shop"
            className="text-white text-sm font-semibold px-7 py-2.5 rounded transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#0D1B2A' }}>
            Our Store
          </Link>
          <Link href="/join-mja"
            className="text-white text-sm font-semibold px-7 py-2.5 rounded transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#E8192C' }}>
            Donate
          </Link>
          <Link href="/resource-hub"
            className="text-sm font-semibold px-7 py-2.5 rounded transition-colors"
            style={{ border: '1.5px solid #0D1B2A', color: '#0D1B2A', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = '#0D1B2A'; el.style.color = 'white' }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = 'transparent'; el.style.color = '#0D1B2A' }}
          >
            Resource Hub
          </Link>
          <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#E8192C' }} />
            Defending press freedom in the Maldives
          </div>
        </div>
      </section>

      {/* ── Be the Voice + Membermeter ── */}
      <section style={{ backgroundColor: '#F5F4F0' }} className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#E8192C' }}>
              Be the Voice
            </p>
            <h2 className="font-headline font-black uppercase leading-[0.93] mb-6"
              style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', color: '#0D1B2A' }}>
              For Freedom<br />of Press
            </h2>
            <p className="leading-[1.85] mb-8 max-w-md" style={{ fontSize: 15, color: '#6B7280' }}>
              Freedom of information is the foundation of any democracy. Yet almost half of the world's population is still denied it. By becoming a member of MJA, you can support the integrity of journalism in every corner of the globe.
            </p>
            <Link href="/join-mja"
              className="inline-block text-white font-semibold px-8 py-3.5 rounded text-sm transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#E8192C' }}>
              Become a Member
            </Link>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <MemberMeter stats={memberStats} />
          </motion.div>
        </div>
      </section>

      {/* ── Get Involved ── */}
      <GetInvolved />

      {/* ── Newsletter ── */}
      <motion.section {...fadeUp()} className="py-16 md:py-20 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline font-bold leading-tight mb-8"
            style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', color: '#0D1B2A' }}>
            Don't wait for information being deprived<br />
            of you to{' '}
            <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </motion.section>

      {/* ── Resource Hub Grid ── */}
      <section className="py-16 md:py-20 px-4 sm:px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div {...fadeUp()} className="flex items-center justify-between mb-6">
            <h2 className="font-headline font-black uppercase"
              style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', color: '#0D1B2A' }}>
              <span style={{ color: '#E8192C' }}>MJA</span> Resource Hub
            </h2>
            <Link href="/resource-hub" className="text-xs font-bold tracking-wider uppercase hover:underline" style={{ color: '#E8192C' }}>
              Browse all →
            </Link>
          </motion.div>

          {/* Search */}
          <motion.div {...fadeUp(0.05)}>
            <Link href="/resource-hub"
              className="flex gap-0 mb-6 border border-gray-200 rounded-lg overflow-hidden max-w-xl hover:border-gray-300 transition-colors">
              <div className="flex-1 px-5 py-3.5 text-sm text-gray-400">Search publications, reports, videos...</div>
              <div className="text-white px-7 py-3.5 text-xs font-bold tracking-widest uppercase flex-shrink-0"
                style={{ backgroundColor: '#E8192C' }}>
                Search
              </div>
            </Link>
          </motion.div>

          {/* Bento grid */}
          <motion.div {...fadeUp(0.1)}
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Link href="/resource-hub?category=publication"
              className="text-white rounded-xl flex flex-col justify-end p-6 md:p-8 transition-opacity hover:opacity-90 relative overflow-hidden"
              style={{ backgroundColor: '#E8192C', gridRow: 'span 2', minHeight: 220 }}>
              <div className="absolute top-4 right-4 font-headline font-black text-white/10 text-6xl leading-none">P</div>
              <p className="font-headline font-black text-xl relative z-10">Publications</p>
              <p className="text-white/60 text-xs mt-1 relative z-10">Reports & press freedom indexes</p>
            </Link>

            <Link href="/resource-hub?category=photo"
              className="text-white rounded-xl flex flex-col justify-end p-5 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0D1B2A' }}>
              <p className="font-headline font-bold">Photos</p>
              <p className="text-white/50 text-xs mt-0.5">Campaign & event images</p>
            </Link>

            <Link href="/the-association/code-of-conduct"
              className="rounded-xl flex flex-col justify-end p-5 md:p-6 transition-colors hover:bg-gray-200"
              style={{ backgroundColor: '#F3F4F6', color: '#0D1B2A', gridRow: 'span 2', minHeight: 220 }}>
              <div className="font-headline font-black text-gray-200 text-5xl leading-none mb-auto">§</div>
              <p className="font-headline font-bold text-lg">Code of<br />Conduct</p>
              <p className="text-gray-400 text-xs mt-1">MJA journalist standards</p>
            </Link>

            <Link href="/resource-hub?category=video"
              className="text-white rounded-xl flex flex-col justify-end p-5 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1E2F44' }}>
              <p className="font-headline font-bold">Videos</p>
              <p className="text-white/50 text-xs mt-0.5">Documentaries & coverage</p>
            </Link>

            <Link href="/campaigns"
              className="text-white rounded-xl flex flex-col justify-end p-5 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1F2937' }}>
              <p className="font-headline font-bold">Campaigns</p>
              <p className="text-white/50 text-xs mt-0.5">Active & past campaigns</p>
            </Link>

            <Link href="/connect"
              className="rounded-xl flex flex-col justify-end p-5 transition-colors hover:bg-gray-200"
              style={{ backgroundColor: '#E5E7EB', color: '#0D1B2A' }}>
              <p className="font-headline font-bold">Contact</p>
              <p className="text-gray-400 text-xs mt-0.5">Get in touch with MJA</p>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
