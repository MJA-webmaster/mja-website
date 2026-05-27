import { createClient } from '@/lib/supabase/server'

export default async function AdminNewsletterPage() {
  const supabase = createClient()
  const { data: subscribers, count } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .order('subscribed_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold text-navy">Newsletter</h1>
        <p className="text-gray-400 text-sm mt-1">{count ?? 0} subscribers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4" style={{ backgroundColor: '#E8192C' }} />
          <p className="text-3xl font-headline font-bold text-navy">{count ?? 0}</p>
          <p className="text-sm text-gray-400 mt-1">Total Subscribers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4 bg-teal-500" />
          <p className="text-3xl font-headline font-bold text-navy">
            {subscribers?.filter(s => {
              const date = new Date(s.subscribed_at)
              const thirtyDaysAgo = new Date()
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
              return date > thirtyDaysAgo
            }).length ?? 0}
          </p>
          <p className="text-sm text-gray-400 mt-1">Last 30 Days</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="w-8 h-1 rounded mb-4 bg-amber-500" />
          <p className="text-3xl font-headline font-bold text-navy">
            {subscribers?.filter(s => {
              const date = new Date(s.subscribed_at)
              const sevenDaysAgo = new Date()
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
              return date > sevenDaysAgo
            }).length ?? 0}
          </p>
          <p className="text-sm text-gray-400 mt-1">Last 7 Days</p>
        </div>
      </div>

      {/* Export button */}
      <div className="flex justify-end mb-4">
        <a
          href={`data:text/csv;charset=utf-8,Email,Subscribed At\n${subscribers?.map(s => `${s.email},${s.subscribed_at}`).join('\n')}`}
          download="mja-subscribers.csv"
          className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#0D1B2A' }}
        >
          Export CSV
        </a>
      </div>

      {/* Subscribers list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_160px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
          <span>Email</span>
          <span>Subscribed</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
          {subscribers?.map((sub) => (
            <div key={sub.id} className="grid grid-cols-[1fr_160px] gap-4 px-6 py-3.5 items-center">
              <p className="text-sm text-navy">{sub.email}</p>
              <p className="text-xs text-gray-400">
                {new Date(sub.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}
          {!subscribers?.length && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">No subscribers yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
