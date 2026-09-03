import { createClient } from '@/lib/supabase/server'
import ActivitiesAdminClient from './ActivitiesAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminActivitiesPage() {
  const supabase = createClient()
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .order('year', { ascending: false })
    .order('order', { ascending: true })

  return <ActivitiesAdminClient activities={activities ?? []} />
}
