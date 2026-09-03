import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('campaigns').select('title, description').eq('slug', params.slug).single()
  return { title: data?.title ?? 'Campaign', description: data?.description ?? '' }
}

export default async function CampaignPage({ params }: Props) {
  const supabase = createClient()
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!campaign) notFound()

  const { data: related } = await supabase
    .from('campaigns')
    .select('*')
    .eq('published', true)
    .neq('id', campaign.id)
    .limit(3)

  return (
    <>
      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[400px]">
        <div className="flex flex-col justify-center p-12 text-white relative overflow-hidden" style={{ backgroundColor: '#E8192C' }}>
          <div className="absolute font-headline font-black text-white/10 text-[200px] leading-none -bottom-8 -left-4 select-none">M</div>
          <div className="relative z-10">
            {campaign.hashtag && (
              <p className="text-white/70 text-sm font-bold tracking-wider mb-2">{campaign.hashtag}</p>
            )}
            <h1 className="font-headline text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
              {campaign.title}
            </h1>
            {campaign.description && (
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">{campaign.description}</p>
            )}
            {campaign.event_date && (
              <div className="mb-6">
                <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Event Date</p>
                <p className="text-white font-semibold text-sm">
                  {new Date(campaign.event_date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                {campaign.event_location && (
                  <p className="text-white/60 text-sm">{campaign.event_location}</p>
                )}
              </div>
            )}
            <div className="flex gap-3 flex-wrap">
              <Link href="/join-mja" className="bg-white font-semibold px-7 py-3 rounded text-sm hover:bg-white/90 transition-colors" style={{ color: '#E8192C' }}>
                Join the Rally
              </Link>
              <Link href="/join-mja" className="border border-white/40 text-white px-7 py-3 rounded text-sm font-semibold hover:bg-white/10 transition-colors">
                Contribute
              </Link>
            </div>
          </div>
        </div>

        {campaign.cover_image ? (
          <div className="relative overflow-hidden min-h-[300px]">
            <Image src={campaign.cover_image} alt={campaign.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
            <span className="font-headline text-white/5 text-[160px] font-black">#</span>
          </div>
        )}
      </section>

      {/* Content */}
      {campaign.content && (
        <section className="max-w-[800px] mx-auto px-6 py-14">
          <div
            className="article-content prose max-w-none text-[15px] leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{ __html: campaign.content }}
          />
        </section>
      )}

      {/* Related campaigns */}
      {related && related.length > 0 && (
        <section className="border-t border-gray-100 py-12 px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline text-2xl font-bold text-navy mb-6">More Campaigns</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((c) => (
                <Link key={c.id} href={`/campaigns/${c.slug}`} className="group">
                  <div className="rounded-xl overflow-hidden aspect-video mb-3 relative" style={{ backgroundColor: '#E8192C' }}>
                    {c.cover_image && <Image src={c.cover_image} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                  </div>
                  {c.hashtag && <p className="text-xs font-bold mb-1" style={{ color: '#E8192C' }}>{c.hashtag}</p>}
                  <h3 className="font-bold text-navy text-sm uppercase leading-snug group-hover:text-red transition-colors">{c.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
