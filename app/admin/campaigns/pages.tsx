import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminCampaignsPage() {
  const supabase = createClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Campaigns</h1>
          <p className="text-gray-400 text-sm mt-1">{campaigns?.length ?? 0} total campaigns</p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#E8192C' }}
        >
          + New Campaign
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_120px_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
          <span>Campaign</span>
          <span>Event Date</span>
          <span>Created</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-gray-50">
          {campaigns?.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/admin/campaigns/${campaign.id}`}
              className="grid grid-cols-[1fr_140px_120px_80px] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              <div>
                <p className="text-sm font-semibold text-navy">{campaign.title}</p>
                {campaign.hashtag && <p className="text-xs mt-0.5" style={{ color: '#E8192C' }}>{campaign.hashtag}</p>}
              </div>
              <span className="text-xs text-gray-500">
                {campaign.event_date
                  ? new Date(campaign.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${campaign.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {campaign.published ? 'Live' : 'Draft'}
              </span>
            </Link>
          ))}
          {!campaigns?.length && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No campaigns yet. <Link href="/admin/campaigns/new" className="hover:underline" style={{ color: '#E8192C' }}>Create your first →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
