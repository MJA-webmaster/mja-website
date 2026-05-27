import { createClient } from '@/lib/supabase/server'
import ExecutiveClient from './ExecutiveClient'

export default async function AdminExecutivePage() {
  const supabase = createClient()
  const { data: members } = await supabase
    .from('executive_committee')
    .select('*')
    .order('order', { ascending: true })

  return <ExecutiveClient members={members ?? []} />
}
