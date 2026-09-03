export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import ResourceHubClient from '@/app/resource-hub/ResourceHubClient'
import { RESOURCE_CATEGORIES } from '@/lib/resource-categories'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resource Hub',
  description: 'Access MJA publications, annual reports, photos and videos.',
}

export default async function ResourceHubPage({
  searchParams,
}: {
  searchParams: { category?: string; sub?: string; q?: string }
}) {
  const supabase = createClient()

  const valid = [...RESOURCE_CATEGORIES.map((c) => c.slug), 'all']
  const category =
    searchParams.category && valid.includes(searchParams.category)
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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-headline text-5xl font-black uppercase mb-8" style={{ color: '#0D1B2A' }}>
          Resource Archive & Publications
        </h1>
        <ResourceHubClient
          resources={resources ?? []}
          categories={RESOURCE_CATEGORIES}
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
        </div>
      </section>
    </>
  )
}
