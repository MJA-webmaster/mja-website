export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import MembersClient from './MembersClient'

export default async function AdminMembersPage() {
  const supabase = createClient()
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .order('name', { ascending: true })

  return <MembersClient members={members ?? []} />
}
