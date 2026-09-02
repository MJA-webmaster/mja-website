export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import MemberStatsClient from './MemberStatsClient'

export default async function AdminMemberStatsPage() {
  const supabase = createClient()
  const { data: stats } = await supabase
    .from('member_stats')
    .select('*')
    .single()

  return <MemberStatsClient stats={stats ?? { local: 0, international: 0, non_member_contributors: 0 }} />
}
