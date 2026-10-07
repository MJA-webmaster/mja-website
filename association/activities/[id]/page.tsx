import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AssociationSidebar from '@/components/AssociationSidebar'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('activities')
    .select('title, description')
    .eq('id', params.id)
    .maybeSingle()

  return {
    title: data?.title ?? 'Activity',
    description: data?.description ?? '',
  }
}

export default async function ActivityDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: activity } = await supabase
    .from('activities')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!activity) notFound()

  const { data: related } = await supabase
    .from('activities')
    .select('id, title, year')
    .eq('year', activity.year)
    .neq('id', activity.id)
    .order('order', { ascending: true })
    .limit(5)

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="md:flex md:gap-16">
          <AssociationSidebar />

          <div className="flex-1 min-w-0 max-w-[720px]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link href="/the-association" className="hover:text-red">The Association</Link>
              <span>/</span>
              <Link href="/the-association/activities" className="hover:text-red">Activities</Link>
              <span>/</span>
              <span className="text-navy">{activity.year}</span>
            </div>

            <span
              className="inline-block text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-4"
              style={{ backgroundColor: '#E8192C' }}
            >
              {activity.year}
            </span>

            <h1
              className="font-headline font-black leading-tight mb-6"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#0D1B2A' }}
            >
              {activity.title}
            </h1>

            {activity.description ? (
              <p className="text-gray-600 text-[15px] leading-[1.85] whitespace-pre-wrap">
                {activity.description}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">No further details have been added for this activity.</p>
            )}

            <Link
              href="/the-association/activities"
              className="inline-block mt-10 text-sm font-semibold hover:underline"
              style={{ color: '#E8192C' }}
            >
              ← All activities
            </Link>

            {related && related.length > 0 && (
              <div className="mt-14 pt-8 border-t border-gray-100">
                <h2 className="font-headline font-bold text-navy text-lg mb-4">
                  More from {activity.year}
                </h2>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/the-association/activities/${r.id}`}
                      className="block text-sm font-semibold text-navy hover:text-red transition-colors"
                    >
                      {r.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="py-14 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don't wait for information being deprived<br className="hidden md:block" />
            {' '}of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
