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

const statusStyles: Record<string, { bg: string; label: string }> = {
  active: { bg: '#16A34A', label: 'Active' },
  upcoming: { bg: '#2563EB', label: 'Upcoming' },
  past: { bg: '#6B7280', label: 'Past' },
}

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
      const campaignList = campaigns.data ?? []
      setData({
        articles: articles.data ?? [],
        campaign: campaignList[0] ?? null,
        campaigns: campaignList,
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

      {/* ── Our Campaigns ── */}
      {data.campaigns.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">
          <motion.div {...fadeUp()} className="flex items-center justify-between mb-8">
            <h2 className="font-headline font-black uppercase text-2xl md:text-3xl" style={{ color: '#0D1B2A' }}>
              Our Campaigns
            </h2>
            <Link
              href="/campaigns"
              className="text-xs font-bold tracking-wider uppercase hover:underline"
              style={{ color: '#E8192C' }}
            >
              View all →
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.campaigns.map((campaign: any, i: number) => {
              const badge = campaign.status ? statusStyles[campaign.status] : null
              const eventDate = campaign.event_date
                ? new Date(campaign.event_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : ''
              const label = campaign.hashtag || eventDate

              return (
                <motion.div key={campaign.id} {...fadeUp(i * 0.07)} className="flex flex-col h-full">
                  <Link href={`/campaigns/${campaign.slug}`} className="group flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3.5 bg-slate-100 border border-slate-200/60">
                      {campaign.cover_image ? (
                        <Image
                          src={campaign.cover_image}
                          alt={campaign.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                          <span className="font-headline font-black text-2xl text-slate-200 tracking-wider">MJA</span>
                        </div>
                      )}

                      {badge && (
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white"
                          style={{ backgroundColor: badge.bg }}
                        >
                          {badge.label}
                        </div>
                      )}
                    </div>

                    {label && (
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#E8192C] mb-1.5">
                        {label}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-[#E8192C] transition-colors mb-1">
                      {campaign.title}
                    </h3>

                    {campaign.description && (
                      <p className="text-xs text-slate-500 leading-snug line-clamp-2 mb-1.5">
                        {campaign.description}
                      </p>
                    )}

                    {campaign.event_location && (
                      <div className="flex items-start gap-1.5">
                        <MapPin size={12} className="flex-shrink-0 mt-0.5 text-slate-400" />
                        <span className="text-xs text-slate-500 leading-snug line-clamp-1">
                          {campaign.event_location}
                        </span>
                      </div>
                    )}
                  </Link>

                  {campaign.cta_primary_label && campaign.cta_primary_url && (
                    <Link
                      href={campaign.cta_primary_url}
                      className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-85 w-fit"
                      style={{ backgroundColor: '#E8192C' }}
                    >
                      {campaign.cta_primary_label}
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Activities ── */}
      {data.activities.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 border-t border-gray-100">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.activities.map((activity: any, i: number) => {
              const eventDate = activity.event_date ? new Date(activity.event_date) : null
              const href = activity.link || `/the-association/activities/${activity.slug || activity.id}`

              return (
                <motion.div key={activity.id} {...fadeUp(i * 0.07)}>
                  <Link href={href} className="group flex flex-col h-full">
                    {/* Image */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3.5 bg-slate-100 border border-slate-200/60">
                      {activity.image_url || activity.cover_image ? (
                        <Image
                          src={activity.image_url ?? activity.cover_image}
                          alt={activity.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
                          <span className="font-headline font-black text-2xl text-slate-200 tracking-wider">MJA</span>
                        </div>
                      )}

                      {/* Date badge overlay */}
                      {eventDate && (
                        <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-white shadow-md">
                          <span className="text-2xl font-black leading-none" style={{ color: '#0D1B2A' }}>
                            {String(eventDate.getDate()).padStart(2, '0')}
                          </span>
                          <span
                            className="text-[10px] font-extrabold uppercase tracking-wider mt-0.5"
                            style={{ color: '#E8192C' }}
                          >
                            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-[#E8192C] transition-colors mb-1">
                          {activity.title}
                        </h3>

                        {activity.description && (
                          <p className="text-xs text-slate-500 leading-snug line-clamp-2 mb-1.5">
                            {activity.description}
                          </p>
                        )}

                        {(activity.event_location || activity.event_time) && (
                          <div className="space-y-1">
                            {activity.event_location && (
                              <div className="flex items-start gap-1.5">
                                <MapPin size={12} className="flex-shrink-0 mt-0.5 text-slate-400" />
                                <span className="text-xs text-slate-500 leading-snug line-clamp-1">
                                  {activity.event_location}
                                </span>
                              </div>
                            )}
                            {activity.event_time && (
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="flex-shrink-0 text-slate-400" />
                                <span className="text-xs text-slate-500">{activity.event_time}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
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
