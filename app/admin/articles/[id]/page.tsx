export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleEditor from '@/components/ArticleEditor'
import Link from 'next/link'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: article } = await supabase.from('articles').select('*').eq('id', params.id).single()

  if (!article) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-3xl font-bold text-navy">Edit Article</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              article.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {article.published ? 'Published' : 'Draft'}
            </span>
            {article.published && (
              <Link
                href={`/news-room/${article.slug}`}
                target="_blank"
                className="text-xs text-red hover:underline"
              >
                View live →
              </Link>
            )}
          </div>
        </div>
        <Link href="/admin/articles" className="text-sm text-gray-400 hover:text-navy">
          ← Back to articles
        </Link>
      </div>
      <ArticleEditor article={article} />
    </div>
  )
}
