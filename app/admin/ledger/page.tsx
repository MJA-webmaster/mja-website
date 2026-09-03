export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import LedgerClient from './LedgerClient'

export default async function AdminLedgerPage() {
  const supabase = createClient()
  const { data: entries } = await supabase
    .from('ledger_entries')
    .select('*')
    .order('entry_date', { ascending: false })

  return <LedgerClient entries={entries ?? []} />
}
