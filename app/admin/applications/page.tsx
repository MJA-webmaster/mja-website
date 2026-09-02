export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import ApplicationsClient from './ApplicationsClient'

export default async function ApplicationsPage() {
  const supabase = createClient()
  const { data: applications } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false })

  return <ApplicationsClient applications={applications ?? []} />
}
