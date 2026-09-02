export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()

  const [
    { count: articleCount },
    { count: campaignCount },
    { count: memberCount },
    { count: subscriberCount },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }),
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('id, title, published, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Articles', count: articleCount ?? 0, href: '/admin/articles', color: 'bg-red' },
    { label: 'Campaigns', count: campaignCount ?? 0, href: '/admin/campaigns', color: 'bg-navy' },
    { label: 'Members', count: memberCount ?? 0, href: '/admin/members', color: 'bg-teal-600' },
    { label: 'Subscribers', count: subscriberCount ?? 0, href: '/admin/newsletter', color: 'bg-amber-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-8 h-1 ${stat.color} rounded mb-4`} />
            <p className="text-3xl font-headline font-bold text-navy">{stat.count}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="font-semibold text-navy mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles/new" className="bg-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-dark transition-colors">
            + New Article
          </Link>
          <Link href="/admin/campaigns/new" className="bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors">
            + New Campaign
          </Link>
          <Link href="/admin/members/new" className="border border-gray-200 text-navy px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            + Add Member
          </Link>
        </div>
      </div>

      {/* Recent articles */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy">Recent Articles</h2>
          <Link href="/admin/articles" className="text-red text-sm hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentArticles?.map((article) => (
            <div key={article.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy">{article.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  article.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {article.published ? 'Published' : 'Draft'}
                </span>
                <Link href={`/admin/articles/${article.id}`} className="text-xs text-red hover:underline">Edit</Link>
              </div>
            </div>
          ))}
          {!recentArticles?.length && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No articles yet. <Link href="/admin/articles/new" className="text-red hover:underline">Create your first one →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
