import { createClient } from '@/lib/supabase/server'
import ResourcesClient from './ResourcesClient'

export default async function AdminResourcesPage() {
  const supabase = createClient()
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  return <ResourcesClient resources={resources ?? []} />
}
