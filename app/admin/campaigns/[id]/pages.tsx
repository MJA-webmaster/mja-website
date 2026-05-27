import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CampaignEditor from '@/components/CampaignEditor'
import Link from 'next/link'

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: campaign } = await supabase.from('campaigns').select('*').eq('id', params.id).single()
  if (!campaign) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl font-bold text-navy">Edit Campaign</h1>
        <Link href="/admin/campaigns" className="text-sm text-gray-400 hover:text-navy">← Back</Link>
      </div>
      <CampaignEditor campaign={campaign} />
    </div>
  )
}
