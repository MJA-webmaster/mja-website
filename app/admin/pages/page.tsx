export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import PagesClient from '@/app/admin/pages/PagesClient'

export default async function AdminPagesPage() {
  const supabase = createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('slug')
  
  return <PagesClient pages={pages ?? []} />
}
