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
