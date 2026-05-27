import { createClient } from '@/lib/supabase/server'
import PagesClient from './PagesClient'

export default async function AdminPagesPage() {
  const supabase = createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('slug')

  return <PagesClient pages={pages ?? []} />
}
