import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/types'

interface Props {
  article: Article
  variant?: 'default' | 'featured' | 'compact'
}

export default function ArticleCard({ article, variant = 'default' }: Props) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  // 1. Compact Variant (For sidebars, lists, or widgets)
  if (variant === 'compact') {
    return (
      <Link href={`/news-room/${article.slug}`} className="group flex items-start gap-3.5 py-1">
        <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              sizes="80px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <span className="font-headline font-black text-xs text-slate-300">MJA</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <time className="block text-[10px] font-bold uppercase tracking-wider text-[#E8192C] mb-1">
            {date}
          </time>
          <h4 className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#E8192C] transition-colors">
            {article.title}
          </h4>
        </div>
      </Link>
    )
  }

  // 2. Featured Variant (Full background image with typography overlay)
  if (variant === 'featured') {
    return (
      <Link
        href={`/news-room/${article.slug}`}
        className="group relative block rounded-2xl overflow-hidden min-h-[360px] md:min-h-[420px] bg-slate-950 shadow-sm hover:shadow-md transition-shadow"
      >
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-[#0D1B2A] flex items-center justify-center">
            <span className="font-headline text-white/5 text-8xl font-black">MJA</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

        <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="bg-[#E8192C] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded">
              Featured
            </span>
            <time className="text-white/80 text-xs font-semibold">{date}</time>
          </div>
          <h3 className="font-headline text-white font-bold text-xl sm:text-2xl md:text-3xl leading-tight group-hover:text-red-100 transition-colors max-w-2xl">
            {article.title}
          </h3>
        </div>
      </Link>
    )
  }

  // 3. Default Grid Variant (Card with rounded image and metadata)
  return (
    <Link href={`/news-room/${article.slug}`} className="group flex flex-col h-full">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3.5 bg-slate-100 border border-slate-200/60">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
            <span className="font-headline font-black text-2xl text-slate-200 tracking-wider">MJA</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <time className="block text-[11px] font-bold uppercase tracking-wider text-[#E8192C] mb-1.5">
            {date}
          </time>
          <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-[#E8192C] transition-colors">
            {article.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
