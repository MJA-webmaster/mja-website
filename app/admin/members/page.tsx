export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import MembersClient from './MembersClient'

export default async function MembersPage() {
  const supabase = createClient()
  const [{ data: members }, { data: applications }] = await Promise.all([
    supabase.from('members').select('*').order('name', { ascending: true }),
    supabase.from('membership_applications').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <MembersClient
      members={members ?? []}
      applications={applications ?? []}
    />
  )
}
