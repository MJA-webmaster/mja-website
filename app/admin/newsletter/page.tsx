export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import NewsletterClient from './NewsletterClient'

export default async function AdminNewsletterPage() {
  const supabase = createClient()
  const { data: subscribers, count } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .order('subscribed_at', { ascending: false })

  return <NewsletterClient subscribers={subscribers ?? []} count={count ?? 0} />
}
