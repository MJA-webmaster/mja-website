export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ShareButtons from '@/components/ShareButtons'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('articles').select('title, excerpt, cover_image').eq('slug', params.slug).single()
  return {
    title: data?.title ?? 'Article',
    description: data?.excerpt ?? '',
    openGraph: {
      title: data?.title ?? 'Article',
      description: data?.excerpt ?? '',
      images: data?.cover_image ? [{ url: data.cover_image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data?.title ?? 'Article',
      description: data?.excerpt ?? '',
      images: data?.cover_image ? [data.cover_image] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const supabase = createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!article) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      })
    : ''

  const articleUrl = `https://mja.mv/news-room/${article.slug}`

  return (
    <>
      <article className="max-w-[800px] mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-red">Home</Link>
          <span>/</span>
          <Link href="/news-room" className="hover:text-red">News Room</Link>
          <span>/</span>
          <span className="text-navy">{article.title}</span>
        </div>

        {/* Category + date */}
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-red text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
            {article.category}
          </span>
          <span className="text-sm text-gray-400">{date}</span>
        </div>

        {/* Title */}
        <h1 className="font-headline text-4xl md:text-5xl font-black text-navy leading-tight mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-gray-500 leading-relaxed mb-8 border-l-4 border-red pl-5">
            {article.excerpt}
          </p>
        )}

        {/* Cover image */}
        {article.cover_image && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <Image
              src={article.cover_image}
              alt={article.title}
              width={800}
              height={450}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-base max-w-none
            prose-headings:font-headline prose-headings:text-navy
            prose-h1:text-3xl prose-h1:font-black
            prose-h2:text-2xl prose-h2:font-bold
            prose-h3:text-xl prose-h3:font-bold
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-3
            prose-a:text-red prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-red prose-blockquote:text-gray-500
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:my-1 prose-li:text-gray-700
            prose-img:rounded-xl prose-img:my-6
            prose-strong:text-navy prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
        />

        {/* Share buttons */}
        <ShareButtons url={articleUrl} title={article.title} />
      </article>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="border-t border-gray-100 py-12 px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline text-2xl font-bold text-navy mb-6">More from MJA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <div key={r.id}>
                  {r.cover_image && (
                    <Image
                      src={r.cover_image}
                      alt={r.title}
                      width={400}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                  )}
                  <p className="text-xs text-red font-bold mb-1">
                    {r.published_at
                      ? new Date(r.published_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })
                      : ''}
                  </p>
                  <Link
                    href={`/news-room/${r.slug}`}
                    className="font-semibold text-navy hover:text-red transition-colors text-sm line-clamp-2"
                  >
                    {r.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  )
}
