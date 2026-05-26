import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import MemberMeter from '@/components/MemberMeter'
import NewsletterForm from '@/components/NewsletterForm'
import HeroSection from '@/components/HeroSection'
import GetInvolved from '@/components/GetInvolved'

export default async function HomePage() {
  const supabase = createClient()

  const [
    { data: latestArticles },
    { data: topNews },
    { data: newsRoom },
    { data: campaigns },
    { data: stats },
  ] = await Promise.all([
    supabase.from('articles').select('*').eq('published', true).eq('category', 'latest').order('published_at', { ascending: false }).limit(4),
    supabase.from('articles').select('*').eq('published', true).eq('category', 'top-news').order('published_at', { ascending: false }).limit(2),
    supabase.from('articles').select('*').eq('published', true).eq('category', 'news-room').order('published_at', { ascending: false }).limit(2),
    supabase.from('campaigns').select('*').eq('published', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('member_stats').select('*').single(),
  ])

  const memberStats = stats
    ? { ...stats, total: stats.local + stats.international + stats.non_member_contributors }
    : { local: 2000, international: 1300, non_member_contributors: 560, total: 3860 }

  const upcomingCampaign = campaigns?.[0]

  return (
    <>
      {/* Hero */}
      <HeroSection campaign={upcomingCampaign} />

      {/* Latest in MJA */}
      {latestArticles && latestArticles.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 py-16">
          <h2 className="font-headline text-3xl font-bold mb-8">
            <span className="text-red">Latest</span> in MJA
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Top News + News Room */}
      <section className="max-w-[1280px] mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          {topNews && topNews.length > 0 && (
            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">
                <span className="text-red">Top</span> News
              </h2>
              <div className="grid grid-cols-2 gap-5">
                {topNews.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
          {newsRoom && newsRoom.length > 0 && (
            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">
                <span className="text-red">News</span> Room
              </h2>
              <div className="grid grid-cols-2 gap-5">
                {newsRoom.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Action buttons */}
      <section className="max-w-[1280px] mx-auto px-6 pb-12 flex flex-wrap gap-3">
        <Link href="/shop" className="bg-navy text-white px-8 py-3 rounded text-sm font-semibold hover:bg-navy-light transition-colors">Our Store</Link>
        <Link href="/join-mja" className="bg-red text-white px-8 py-3 rounded text-sm font-semibold hover:bg-red-dark transition-colors">Donate</Link>
        <Link href="/resource-hub" className="border border-navy text-navy px-8 py-3 rounded text-sm font-semibold hover:bg-navy hover:text-white transition-colors">Resource Hub</Link>
      </section>

      {/* Be the Voice + Membermeter */}
      <section className="bg-offwhite py-16">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-red text-sm font-bold tracking-widest uppercase mb-2">Be the Voice</p>
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase leading-none mb-6">
              For Freedom<br />of Press
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-md">
              Freedom of information is the foundation of any democracy. Yet almost half of the world's population is still denied it. By becoming a member of MJA, you can support the integrity of journalism in every corner of the globe.
            </p>
            <Link href="/join-mja" className="inline-block bg-red text-white px-8 py-3.5 rounded font-semibold hover:bg-red-dark transition-colors">
              Become a Member
            </Link>
          </div>
          <MemberMeter stats={memberStats} />
        </div>
      </section>

      {/* Get Involved */}
      <GetInvolved />

      {/* Newsletter */}
      <section className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-navy mb-8">
            Don't wait for information being deprived<br />
            of you to <span className="text-red">defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>

      {/* Resource Hub Grid */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-3xl font-bold mb-6">
            <span className="text-red">MJA</span> Resource Hub
          </h2>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search resources here..."
              className="flex-1 border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-red"
            />
            <button className="bg-red text-white px-8 py-3 rounded text-sm font-bold tracking-widest uppercase">
              Search
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link href="/resource-hub/publications" className="bg-red text-white rounded-lg p-8 flex items-center justify-center text-lg font-bold font-headline row-span-2 hover:bg-red-dark transition-colors">
              Publications
            </Link>
            <Link href="/resource-hub/photos" className="bg-navy text-white rounded-lg p-6 flex items-center justify-center font-bold font-headline hover:bg-navy-light transition-colors">
              Photos
            </Link>
            <Link href="/the-association/code-of-conduct" className="bg-gray-100 text-navy rounded-lg p-6 flex items-center justify-center font-bold font-headline row-span-2 hover:bg-gray-200 transition-colors">
              Code of Conduct
            </Link>
            <Link href="/resource-hub/videos" className="bg-navy-mid text-white rounded-lg p-6 flex items-center justify-center font-bold font-headline hover:bg-navy-light transition-colors">
              Videos
            </Link>
            <Link href="/campaigns" className="bg-gray-800 text-white rounded-lg p-6 flex items-center justify-center font-bold font-headline hover:bg-gray-900 transition-colors">
              Campaigns
            </Link>
            <Link href="/connect" className="bg-gray-200 text-navy rounded-lg p-6 flex items-center justify-center font-bold font-headline hover:bg-gray-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
