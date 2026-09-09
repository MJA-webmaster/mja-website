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
    articles: [],
    campaign: null,
    stats: null,
    activities: [],
    dispatch: null,
  })

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('articles').select('*').eq('published', true).order('published_at', { ascending: false }).limit(4),
      supabase.from('campaigns').select('*').eq('published', true).order('created_at', { ascending: false }).limit(1),
      supabase.from('member_stats').select('*').single(),
      supabase.from('activities').select('*').eq('year', new Date().getFullYear()).order('order', { ascending: true }).limit(4),
      supabase.from('settings').select('dispatch').single(),
    ]).then(([articles, campaigns, stats, activities, settings]) => {
      setData({
        articles: articles.data ?? [],
        campaign: campaigns.data?.[0] ?? null,
        stats: stats.data,
        activities: activities.data ?? [],
        dispatch: settings.data?.dispatch ?? null,
      })
    })
  }, [])

  const memberStats = data.stats ?? {
    total: 0, media_outlets: 0, male: 0, female: 0,
    local: 0, international: 0, non_member_contributors: 0,
  }

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection campaign={data.campaign} dispatch={data.dispatch} />

      {/* ── Latest News ── */}
      {data.articles.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
          <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-black uppercase text-2xl md:text-3xl" style={{ color: '#0D1B2A' }}>
              <span style={{ color: '#E8192C' }}>Latest</span> News
            </h2>
            <Link href="/news-room" className="text-xs font-bold tracking-wider uppercase hover:underline" style={{ color: '#E8192C' }}>
              View all →
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.articles.map((article: any, i: number) => (
              <motion.div key={article.id} {...fadeUp(i * 0.07)}>
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Activities ── */}
      {data.activities.length > 0 && (
        <section className="border-t border-gray-100 py-16 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
              <h2 className="font-headline font-black uppercase text-2xl md:text-3xl" style={{ color: '#0D1B2A' }}>
                Activities
              </h2>
              <Link href="/the-association/activities" className="text-xs font-bold tracking-wider uppercase hover:underline" style={{ color: '#E8192C' }}>
                View all →
              </Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {data.activities.map((activity: any, i: number) => (
                <motion.div
                  key={activity.id}
                  {...fadeUp(i * 0.07)}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full" style={{ backgroundColor: '#E8192C' }} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="font-bold text-navy text-[14px] leading-snug mb-3">
                      {activity.title}
                    </h3>

                    {/* Meta */}
                    <div className="space-y-1.5 mb-3">
                      {activity.event_date && (
                        <div className="flex items-center gap-2">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E8192C' }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span className="text-[11px] text-gray-500 font-medium">
                            {new Date(activity.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {activity.event_time && ` · ${activity.event_time}`}
                          </span>
                        </div>
                      )}
                      {activity.event_location && (
                        <div className="flex items-center gap-2">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E8192C' }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          <span className="text-[11px] text-gray-500">{activity.event_location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {activity.description && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-auto">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Membership ── */}
      <section style={{ backgroundColor: '#F5F4F0' }} className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#E8192C' }}>
              Be the Voice
            </p>
            <h2 className="font-headline font-black uppercase leading-[0.93] mb-6" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', color: '#0D1B2A' }}>
              For Freedom<br />of Press
            </h2>
            <p className="leading-[1.85] mb-8 max-w-md" style={{ fontSize: 15, color: '#6B7280' }}>
              Freedom of information is the foundation of any democracy. By becoming a member of MJA,
              you support the integrity of journalism in every corner of the Maldives.
            </p>
            <Link
              href="/join-mja#form"
              className="inline-block text-white font-semibold px-8 py-3.5 rounded text-sm transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#E8192C' }}
            >
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
          <h2 className="font-headline font-bold leading-tight mb-8" style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', color: '#0D1B2A' }}>
            Don&apos;t wait for information being deprived<br />
            of you to{' '}
            <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </motion.section>
    </>
  )
}
