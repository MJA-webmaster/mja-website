export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campaigns',
  description: 'MJA campaigns for press freedom across the Maldives.',
}

export default async function CampaignsPage() {
  const supabase = createClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const featured = campaigns?.[0]
  const rest = campaigns?.slice(1)

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <h1 className="font-headline text-5xl font-black uppercase mb-10" style={{ color: '#0D1B2A' }}>
          <span style={{ color: '#E8192C' }}>MJA</span> Campaigns
        </h1>

        {featured ? (
          <>
            {/* Featured campaign */}
            <Link href={`/campaigns/${featured.slug}`} className="group block mb-12">
              <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden min-h-[360px]">
                <div className="flex flex-col justify-center p-10 text-white" style={{ backgroundColor: '#E8192C' }}>
                  <div className="absolute font-headline font-black text-white/10 text-[180px] leading-none select-none">M</div>
                  <div className="relative z-10">
                    {featured.hashtag && (
                      <p className="text-white/70 text-sm font-bold mb-2">{featured.hashtag}</p>
                    )}
                    <h2 className="font-headline text-3xl md:text-4xl font-black uppercase leading-tight mb-4">
                      {featured.title}
                    </h2>
                    {featured.description && (
                      <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">{featured.description}</p>
                    )}
                    {featured.event_date && (
                      <p className="text-white/60 text-xs mb-6">
                        {new Date(featured.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {featured.event_location && ` — ${featured.event_location}`}
                      </p>
                    )}
                    <div className="flex gap-3">
                      <span className="bg-white font-semibold px-6 py-2.5 rounded text-sm" style={{ color: '#E8192C' }}>
                        Join the Rally
                      </span>
                      <span className="border border-white/40 text-white px-6 py-2.5 rounded text-sm font-semibold">
                        Contribute
                      </span>
                    </div>
                  </div>
                </div>
                {featured.cover_image ? (
                  <div className="relative overflow-hidden">
                    <Image
                      src={featured.cover_image}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="bg-navy-mid flex items-center justify-center" style={{ backgroundColor: '#162234' }}>
                    <span className="font-headline text-white/10 text-[120px] font-black">#</span>
                  </div>
                )}
              </div>
            </Link>

            {/* Rest of campaigns */}
            {rest && rest.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {rest.map((campaign) => (
                  <Link key={campaign.id} href={`/campaigns/${campaign.slug}`} className="group block">
                    <div className="rounded-xl overflow-hidden mb-4 aspect-video bg-gray-100 relative">
                      {campaign.cover_image ? (
                        <Image
                          src={campaign.cover_image}
                          alt={campaign.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#E8192C' }}>
                          <span className="font-headline text-white/20 text-6xl font-black">#</span>
                        </div>
                      )}
                    </div>
                    {campaign.hashtag && (
                      <p className="text-xs font-bold mb-1" style={{ color: '#E8192C' }}>{campaign.hashtag}</p>
                    )}
                    <h3 className="font-headline font-bold text-navy text-lg uppercase leading-snug group-hover:text-red transition-colors">
                      {campaign.title}
                    </h3>
                    {campaign.event_date && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(campaign.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📢</p>
            <p className="font-semibold">No campaigns yet</p>
            <p className="text-sm mt-1">Campaigns will appear here once published</p>
          </div>
        )}
      </div>

      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don't wait for information being deprived<br />
            of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
