'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ArticleCard from '@/components/ArticleCard'
import MemberMeter from '@/components/MemberMeter'
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
    campaigns: [],
    stats: null,
    activities: [],
    dispatch: null,
  })

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('articles').select('*').eq('published', true).order('published_at', { ascending: false }).limit(4),
      supabase.from('campaigns').select('*').eq('published', true).order('created_at', { ascending: false }).limit(4),
      supabase.from('member_stats').select('*').single(),
      supabase.from('activities').select('*').eq('year', new Date().getFullYear()).order('order', { ascending: true }).limit(4),
      supabase.from('settings').select('dispatch').single(),
    ]).then(([articles, campaigns, stats, activities, settings]) => {
      setData({
        articles: articles.data ?? [],
        campaign: campaigns.data?.[0] ?? null,
        campaigns: campaigns.data ?? [],
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
            <Link
              href="/news-room"
              className="text-xs font-bold tracking-wider uppercase hover:underline"
              style={{ color: '#E8192C' }}
            >
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

      {/* ── Campaigns ── */}
      {data.campaigns.length > 0 && (
        <section className="border-t border-gray-100 py-16 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
              <h2 className="font-headline font-black uppercase text-2xl md:text-3xl" style={{ color: '#0D1B2A' }}>
                <span style={{ color: '#E8192C' }}>Active</span> Campaigns
              </h2>
              <Link
                href="/campaigns"
                className="text-xs font-bold tracking-wider uppercase hover:underline"
                style={{ color: '#E8192C' }}
              >
                View all →
              </Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {data.campaigns.slice(0, 3).map((c: any, i: number) => (
                <motion.div key={c.id} {...fadeUp(i * 0.07)}>
                  <Link href={`/campaigns/${c.slug}`} className="group block">
                    <div className="rounded-xl overflow-hidden aspect-video mb-3 relative" style={{ backgroundColor: '#0D1B2A' }}>
                      {c.cover_image ? (
                        <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-headline text-white/10 text-6xl font-black">#</span>
                        </div>
                      )}
                    </div>
                    {c.hashtag && <p className="text-xs font-bold mb-1" style={{ color: '#E8192C' }}>{c.hashtag}</p>}
                    <h3 className="font-bold text-navy text-sm uppercase leading-snug group-hover:text-red transition-colors">{c.title}</h3>
                    {c.event_date && (
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(c.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Upcoming Activities ── */}
      {data.activities.length > 0 && (
        <section className="border-t border-gray-100 py-16 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
              <h2 className="font-headline font-black uppercase text-2xl md:text-3xl" style={{ color: '#0D1B2A' }}>
                <span style={{ color: '#E8192C' }}>Upcoming</span> Activities
              </h2>
              <Link
                href="/the-association/activities"
                className="text-xs font-bold tracking-wider uppercase hover:underline"
                style={{ color: '#E8192C' }}
              >
                View all →
              </Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {data.activities.map((activity: any, i: number) => (
                <motion.div
                  key={activity.id}
                  {...fadeUp(i * 0.07)}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#E8192C' }}>
                    {activity.year}
                  </div>
                  <h3 className="font-bold text-navy text-[14px] leading-snug mb-1">
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {activity.description}
                    </p>
                  )}
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
            <h2
              className="font-headline font-black uppercase leading-[0.93] mb-6"
              style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', color: '#0D1B2A' }}
            >
              For Freedom<br />of Press
            </h2>
            <p className="leading-[1.85] mb-8 max-w-md" style={{ fontSize: 15, color: '#6B7280' }}>
              Freedom of information is the foundation of any democracy. By becoming a member of MJA,
              you support the integrity of journalism in every corner of the Maldives.
            </p>
            <Link
              href="/join-mja"
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

    </>
  )
}
