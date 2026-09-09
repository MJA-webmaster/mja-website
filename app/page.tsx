'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Clock } from 'lucide-react'
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
    total: 0,
    media_outlets: 0,
    male: 0,
    female: 0,
    local: 0,
    international: 0,
    non_member_contributors: 0,
  }

  return (
    <>
      {/* ── Hero — always default, campaign shown via popup only ── */}
      <HeroSection campaign={null} dispatch={data.dispatch} />

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

      {/* ── Activities ── */}
      {data.activities.length > 0 && (
        <section className="border-t border-gray-100 py-16 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
              <h2 className="font-headline font-black uppercase text-2xl md:text-3xl" style={{ color: '#0D1B2A' }}>
                Activities
              </h2>
              <Link
                href="/the-association/activities"
                className="text-xs font-bold tracking-wider uppercase hover:underline"
                style={{ color: '#E8192C' }}
              >
                View all →
              </Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
              {data.activities.map((activity: any, i: number) => {
                const eventDate = activity.event_date ? new Date(activity.event_date) : null

                return (
                  <motion.div key={activity.id} {...fadeUp(i * 0.07)} className="flex">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col w-full">
                      {/* Cover Image Area */}
                      <div className="relative w-full h-44 bg-[#0D1B2A] overflow-hidden flex-shrink-0">
                        {activity.image_url || activity.cover_image ? (
                          <Image
                            src={activity.image_url ?? activity.cover_image}
                            alt={activity.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center relative">
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: 'radial-gradient(circle at 70% 50%, rgba(232,25,44,0.15) 0%, transparent 70%)',
                              }}
                            />
                            <span
                              className="font-headline font-black text-6xl select-none pointer-events-none tracking-wider"
                              style={{ color: 'rgba(255,255,255,0.06)' }}
                            >
                              MJA
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Title (fixed height for 2 lines) */}
                        <h3 className="font-bold text-[#0D1B2A] text-base leading-snug line-clamp-2 h-[2.75rem] mb-2">
                          {activity.title}
                        </h3>

                        {/* Description (fixed height for 2 lines) */}
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 h-[2.5rem] mb-4">
                          {activity.description || ''}
                        </p>

                        {/* Details Row: Aligned across cards */}
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-start gap-4 min-h-[58px]">
                          {eventDate ? (
                            <div className="flex flex-col items-center justify-center min-w-[48px] text-center">
                              <span className="text-3xl font-black leading-none text-[#0D1B2A]">
                                {String(eventDate.getDate()).padStart(2, '0')}
                              </span>
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 mt-1">
                                {eventDate.toLocaleDateString('en-GB', { month: 'short' })}
                              </span>
                            </div>
                          ) : (
                            <div className="min-w-[48px]" />
                          )}

                          <div className="space-y-1.5 flex-1 min-w-0">
                            {activity.event_location && (
                              <div className="flex items-start gap-1.5">
                                <MapPin size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
                                <span className="text-xs text-gray-500 leading-snug truncate block">
                                  {activity.event_location}
                                </span>
                              </div>
                            )}

                            {activity.event_time && (
                              <div className="flex items-center gap-1.5">
                                <Clock size={14} className="flex-shrink-0 text-gray-400" />
                                <span className="text-xs text-gray-500 truncate block">
                                  {activity.event_time}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Button */}
                        <div className="pt-5 flex justify-end">
                          <Link
                            href={activity.link || `/the-association/activities/${activity.slug || activity.id}`}
                            className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold rounded-full border border-[#0D1B2A]/20 text-[#0D1B2A] hover:border-[#E8192C] hover:text-[#E8192C] hover:bg-red-50/50 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
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
      <motion.section
        {...fadeUp()}
        className="py-16 md:py-20 px-4 sm:px-6 border-t border-gray-100"
      >
        <div className="max-w-[1280px] mx-auto">
          <h2
            className="font-headline font-bold leading-tight mb-8"
            style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', color: '#0D1B2A' }}
          >
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
