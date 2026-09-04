export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import NewsletterClient from './NewsletterClient'

export default async function AdminNewsletterPage() {
  const supabase = createClient()
  const [{ data: subscribers, count }, { data: articles }, { data: publications }, { data: drafts }] = await Promise.all([
    supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
      .order('subscribed_at', { ascending: false }),
    supabase
      .from('articles')
      .select('id, title, slug, excerpt, cover_image')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(50),
    supabase
      .from('resources')
      .select('id, title, description, cover_image, file_url, external_url')
      .eq('published', true)
      .eq('category', 'publications')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('newsletter_drafts')
      .select('*')
      .order('updated_at', { ascending: false }),
  ])

  return (
    <NewsletterClient
      subscribers={subscribers ?? []}
      count={count ?? 0}
      articles={articles ?? []}
      publications={publications ?? []}
      drafts={drafts ?? []}
    />
  )
}
