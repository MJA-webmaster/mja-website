import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import MemberMeter from '@/components/MemberMeter'
import HeroSection from '@/components/HeroSection'
import GetInvolved from '@/components/GetInvolved'
import SectionHeader from '@/components/SectionHeader'
import { getCampaignStatus, STATUS_BADGE_STYLE } from '@/lib/campaigns'

export default async function HomePage() {
  const supabase = createClient()

  const [articlesRes, campaignsRes, statsRes, activitiesRes, settingsRes] = await Promise.all([
    supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(4),
    supabase
      .from('campaigns')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('member_stats')
      .select('*')
      .maybeSingle(),
    supabase
      .from('activities')
      .select('*')
      .order('year', { ascending: false })
      .order('order', { ascending: true })
      .limit(4),
    supabase
      .from('settings')
      .select('dispatch')
      .maybeSingle(),
  ])

  const articles = articlesRes.data ?? []
  const recentCampaigns = campaignsRes.data ?? []
  const activities = activitiesRes.data ?? []
  const dispatch = settingsRes.data?.dispatch ?? null

  const heroCampaign =
    recentCampaigns.find((c: any) => c.is_hero_featured && getCampaignStatus(c) === 'active') ?? null

  const memberStats = statsRes.data ?? {
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
      {/* ── Hero ── */}
      <HeroSection campaign={heroCampaign} dispatch={dispatch} />

      {/* ── Latest News ── */}
      {articles.length > 0 && (
        <section className="border-t border-gray-100 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <SectionHeader
              eyebrow="Dispatches & Updates"
              title={<><span className="text-[#E8192C]">Latest</span> News</>}
              href="/news-room"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Our Campaigns (most recent, any status) ── */}
      {recentCampaigns.length > 0 && (
        <section className="border-t border-gray-100 bg-slate-50/50 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <SectionHeader
              eyebrow="Press Freedom in Action"
              title={<>Our <span className="text-[#E8192C]">Campaigns</span></>}
              href="/campaigns"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {recentCampaigns.map((c: any) => {
                const status = getCampaignStatus(c)
                const badge = STATUS_BADGE_STYLE[status]
                return (
                  <Link
                    key={c.id}
                    href={`/campaigns/${c.slug}`}
                    className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="aspect-video relative bg-[#0D1B2A] overflow-hidden">
                      {c.cover_image ? (
                        <Image
                          src={c.cover_image}
                          alt={c.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-headline text-white/10 text-5xl font-black">#</span>
                        </div>
                      )}
                      <span
                        className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shadow-xs"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="p-4">
                      {c.hashtag && (
                        <p className="text-[11px] font-bold text-[#E8192C] mb-1">{c.hashtag}</p>
                      )}
                      <h3 className="font-bold text-[#0D1B2A] text-sm leading-snug group-hover:text-[#E8192C] transition-colors line-clamp-2">
                        {c.title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Activities & Initiatives ── */}
      {activities.length > 0 && (
        <section className="border-t border-gray-100 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <SectionHeader
              eyebrow="On the Ground"
              title={<>Recent <span className="text-[#E8192C]">Activities</span></>}
              href="/the-association/activities"
              linkLabel="View full archive"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {activities.map((activity: any, idx: number) => (
                <div
                  key={activity.id}
                  className="group bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-slate-600 font-mono">
                        {activity.year}
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-300 group-hover:text-[#E8192C] transition-colors">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0D1B2A] text-sm leading-snug mb-2 group-hover:text-[#E8192C] transition-colors">
                      {activity.title}
                    </h3>
                    {activity.description && (
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Membership ── */}
      <section style={{ backgroundColor: '#F5F4F0' }} className="border-t border-gray-100 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-[#E8192C]">
              Be the Voice
            </p>
            <h2
              className="font-headline font-black uppercase leading-[0.93] mb-6 text-[#0D1B2A]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 54px)' }}
            >
              For Freedom<br />of Press
            </h2>
            <p className="leading-[1.85] mb-8 max-w-md text-[15px] text-gray-600">
              Freedom of information is the foundation of any democracy. By becoming a member of MJA,
              you support the integrity of journalism in every corner of the Maldives.
            </p>
            <Link
              href="/join-mja"
              className="inline-block text-white font-semibold px-8 py-3.5 rounded text-sm transition-opacity hover:opacity-90 bg-[#E8192C]"
            >
              Become a Member
            </Link>
          </div>
          <div>
            <MemberMeter stats={memberStats} />
          </div>
        </div>
      </section>

      {/* ── Get Involved ── */}
      <GetInvolved />
    </>
  )
}
