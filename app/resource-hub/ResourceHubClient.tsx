import { createClient } from '@/lib/supabase/server'
import ResourceHubClient from './ResourceHubClient'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resource Hub',
  description: 'Access MJA publications, photos, videos, and resources for journalists.',
}

export default async function ResourceHubPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string }
}) {
  const supabase = createClient()
  const category = searchParams.category || 'publication'

  let query = supabase
    .from('resources')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (category !== 'all') {
    query = query.eq('category', category)
  }

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }

  const { data: resources } = await query

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        {/* Header */}
        <h1 className="font-headline text-5xl font-black uppercase mb-8" style={{ color: '#0D1B2A' }}>
          <span style={{ color: '#E8192C' }}>MJA</span> Resource Hub
        </h1>

        <ResourceHubClient
          resources={resources ?? []}
          currentCategory={category}
          currentSearch={searchParams.q ?? ''}
        />
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
