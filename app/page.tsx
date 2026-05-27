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
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HomePage() {
  const [data, setData] = useState<any>({
    latestArticles: [], topNews: [], newsRoom: [],
    campaign: null, stats: null,
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
      {/* Hero */}
      <HeroSection campaign={data.campaign} />

      {/* Latest in MJA */}
      {data.latestArticles.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 md:py-20">
          <motion.h2 {...fadeUp()} className="font-headline font-black uppercase mb-8 md:mb-10"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#0D1B2A' }}>
            <span style={{ color: '#E8192C' }}>Latest</span> in MJA
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.latestArticles.map((article: any, i: number) => (
              <motion.div key={article.id} {...fadeUp(i * 0.08)}>
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Top News + News Room */}
      {(data.topNews.length > 0 || data.newsRoom.length > 0) && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-14 md:pb-20">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {data.topNews.length > 0 && (
              <div>
                <motion.h2 {...fadeUp()} className="font-headline font-black uppercase mb-6"
                  style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', color: '#0D1B2A' }}>
                  <span style={{ color: '#E8192C' }}>Top</span> News
                </motion.h2>
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
                <motion.h2 {...fadeUp(0.1)} className="font-headline font-black uppercase mb-6"
                  style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', color: '#0D1B2A' }}>
                  <span style={{ color: '#E8192C' }}>News</span> Room
                </motion.h2>
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

      {/* Action bar */}
      <motion.section {...fadeUp()} className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-10">
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="text-white px-7 py-3 rounded text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#0D1B2A' }}>
            Our Store
          </Link>
          <Link href="/join-mja" className="text-white px-7 py-3 rounded text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ backgroundColor: '#E8192C' }}>
            Donate
          </Link>
          <Link href="/resource-hub"
            className="border-2 text-sm font-semibold px-7 py-3 rounded transition-colors hover:text-white"
            style={{ borderColor: '#0D1B2A', color: '#0D1B2A' }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#0D1B2A'; (e.target as HTMLElement).style.color = 'white' }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = '#0D1B2A' }}
          >
            Resource Hub
          </Link>
        </div>
      </motion.section>

      {/* Be the Voice + Membermeter */}
      <section style={{ backgroundColor: '#F5F4F0' }} className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: '#E8192C' }}>
              Be the Voice
            </p>
            <h2 className="font-headline font-black uppercase leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: '#0D1B2A' }}>
              For Freedom<br />of Press
            </h2>
            <p className="text-gray-500 text-[15px] leading-[1.8] mb-8 max-w-md">
              Freedom of information is the foundation of any democracy. Yet almost half of the world's population is still denied it. By becoming a member of MJA, you can support the integrity of journalism in every corner of the globe.
            </p>
            <Link href="/join-mja"
              className="inline-block text-white font-semibold px-8 py-3.5 rounded transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#E8192C' }}>
              Become a Member
            </Link>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <MemberMeter stats={memberStats} />
          </motion.div>
        </div>
      </section>

      {/* Get Involved */}
      <GetInvolved />

      {/* Newsletter */}
      <motion.section {...fadeUp()} className="py-16 md:py-20 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline font-bold mb-8 leading-tight"
            style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', color: '#0D1B2A' }}>
            Don't wait for information being deprived<br />
            of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </motion.section>

      {/* Resource Hub Grid */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.h2 {...fadeUp()} className="font-headline font-black uppercase mb-6"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#0D1B2A' }}>
            <span style={{ color: '#E8192C' }}>MJA</span> Resource Hub
          </motion.h2>

          {/* Search */}
          <motion.div {...fadeUp(0.05)} className="flex gap-0 mb-6 border border-gray-200 rounded-lg overflow-hidden max-w-2xl">
            <input
              type="text"
              placeholder="Search resources here..."
              className="flex-1 px-5 py-3.5 text-sm text-navy focus:outline-none"
            />
            <Link href="/resource-hub"
              className="text-white px-7 py-3.5 text-xs font-bold tracking-widest uppercase flex-shrink-0"
              style={{ backgroundColor: '#E8192C' }}>
              Search
            </Link>
          </motion.div>

          {/* Grid */}
          <motion.div {...fadeUp(0.1)} className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto' }}>
            {/* Publications — tall */}
            <Link href="/resource-hub?category=publication"
              className="text-white rounded-xl flex items-center justify-center font-headline font-black text-xl transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#E8192C', gridRow: 'span 2', padding: '48px 24px', minHeight: 200 }}>
              Publications
            </Link>
            {/* Photos */}
            <Link href="/resource-hub?category=photo"
              className="text-white rounded-xl flex items-center justify-center font-headline font-bold transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#0D1B2A', padding: '32px 24px' }}>
              Photos
            </Link>
            {/* Code of Conduct — tall */}
            <Link href="/the-association/code-of-conduct"
              className="rounded-xl flex items-center justify-center font-headline font-bold transition-colors hover:bg-gray-200"
              style={{ backgroundColor: '#F3F4F6', color: '#0D1B2A', gridRow: 'span 2', padding: '48px 24px', minHeight: 200 }}>
              Code of Conduct
            </Link>
            {/* Videos */}
            <Link href="/resource-hub?category=video"
              className="text-white rounded-xl flex items-center justify-center font-headline font-bold transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#1E2F44', padding: '32px 24px' }}>
              Videos
            </Link>
            {/* Campaigns — bottom left */}
            <Link href="/campaigns"
              className="text-white rounded-xl flex items-center justify-center font-headline font-bold transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#1F2937', padding: '32px 24px' }}>
              Campaigns
            </Link>
            {/* Contact — bottom right */}
            <Link href="/connect"
              className="rounded-xl flex items-center justify-center font-headline font-bold transition-colors hover:bg-gray-300"
              style={{ backgroundColor: '#E5E7EB', color: '#0D1B2A', padding: '32px 24px' }}>
              Contact
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
