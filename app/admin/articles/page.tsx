import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminArticlesPage() {
  const supabase = createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Articles</h1>
          <p className="text-gray-400 text-sm mt-1">{articles?.length ?? 0} total articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-dark transition-colors"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
          <span>Title</span>
          <span>Category</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-gray-50">
          {articles?.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}`}
              className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              <div>
                <p className="text-sm font-medium text-navy">{article.title}</p>
                {article.excerpt && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{article.excerpt}</p>
                )}
              </div>
              <span className="text-xs text-gray-500 capitalize">{article.category}</span>
              <span className="text-xs text-gray-400">
                {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${
                article.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {article.published ? 'Live' : 'Draft'}
              </span>
            </Link>
          ))}
          {!articles?.length && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No articles yet. <Link href="/admin/articles/new" className="text-red hover:underline">Write your first article →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
