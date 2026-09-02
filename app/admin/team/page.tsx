export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import TeamClient from './TeamClient'

export default async function AdminTeamPage() {
  const supabase = createClient()
  const { data: team } = await supabase
    .from('team_members')
    .select('*')
    .order('order', { ascending: true })

  return <TeamClient team={team ?? []} />
}
