import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import NewsletterForm from '@/components/NewsletterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News Room',
  description: 'Latest news and updates from the Maldives Journalist Association.',
}

export default async function NewsRoomPage() {
  const supabase = createClient()

  const [{ data: featured }, { data: latest }, { data: topNews }] = await Promise.all([
    supabase.from('articles').select('*').eq('published', true).order('published_at', { ascending: false }).limit(1),
    supabase.from('articles').select('*').eq('published', true).eq('category', 'latest').order('published_at', { ascending: false }).limit(5),
    supabase.from('articles').select('*').eq('published', true).eq('category', 'top-news').order('published_at', { ascending: false }).limit(2),
  ])

  const featuredArticle = featured?.[0]

  return (
    <>
      {/* Header */}
      <section className="max-w-[1280px] mx-auto px-6 py-10">
        <h1 className="font-headline text-5xl font-black uppercase mb-8">
          <span className="text-red">News</span> Room
        </h1>

        {/* Featured + sidebar */}
        {featuredArticle && (
          <div className="grid md:grid-cols-[1fr_300px] gap-6 mb-12">
            <ArticleCard article={featuredArticle} variant="featured" />
            <div className="space-y-5">
              {latest?.slice(1).map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        )}

        {/* Latest */}
        <div className="mb-12">
          <h2 className="font-headline text-3xl font-bold mb-6">
            <span className="text-red">Latest</span> in MJA
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latest?.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Top News + Campaign */}
        <div className="grid md:grid-cols-2 gap-12">
          {topNews && topNews.length > 0 && (
            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">
                <span className="text-red">Top</span> News
              </h2>
              <div className="grid grid-cols-2 gap-5">
                {topNews.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 px-6 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-headline text-4xl font-bold text-navy mb-6">
            Don't wait for information being deprived<br />
            of you to <span className="text-red">defend it!</span>
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
