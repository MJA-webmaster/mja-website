import { createClient } from '@/lib/supabase/server'
import NewsletterForm from '@/components/NewsletterForm'
import ResourceHubClient from '@/app/resource-hub/ResourceHubClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resource Hub',
  description: 'Access MJA publications, annual reports, photos and videos.',
}

export const CATEGORIES = [
  {
    slug: 'publications',
    label: 'Publications',
    blurb: 'Reports, guidelines and books',
    subcategories: ['Reports', 'Guidelines', 'Books'],
  },
  {
    slug: 'annual-reports',
    label: 'Annual Reports & Financials',
    blurb: 'Yearly reports and audited accounts',
    subcategories: ['Annual Report', 'Financial Statement'],
  },
  {
    slug: 'multimedia',
    label: 'Multimedia',
    blurb: 'Photo and video',
    subcategories: ['Photo', 'Video'],
  },
]

export default async function ResourceHubPage({
  searchParams,
}: {
  searchParams: { category?: string; sub?: string; q?: string }
}) {
  const supabase = createClient()

  const valid = CATEGORIES.map((c) => c.slug)
  const category =
    searchParams.category && [...valid, 'all'].includes(searchParams.category)
      ? searchParams.category
      : 'publications'

  let query = supabase
    .from('resources')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (category !== 'all') {
    query = query.eq('category', category)
  }
  if (searchParams.sub) {
    query = query.eq('subcategory', searchParams.sub)
  }
  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }

  const { data: resources } = await query

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <h1 className="font-headline text-5xl font-black uppercase mb-8" style={{ color: '#0D1B2A' }}>
          <span style={{ color: '#E8192C' }}>MJA</span> Resource Hub
        </h1>
        <ResourceHubClient
          resources={resources ?? []}
          categories={CATEGORIES}
          currentCategory={category}
          currentSub={searchParams.sub ?? ''}
          currentSearch={searchParams.q ?? ''}
        />
      </div>

      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold mb-6" style={{ color: '#0D1B2A' }}>
            Don&apos;t wait for information being deprived<br />
            of you to <span style={{ color: '#E8192C' }}>defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
