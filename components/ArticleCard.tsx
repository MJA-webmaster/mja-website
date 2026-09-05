'use client'

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
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : ''
  if (variant === 'compact') {
    return (
      <Link href={`/news-room/${article.slug}`} className="flex gap-3 group">
        {article.cover_image && (
          <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={article.cover_image}
              alt={article.title}
              width={80}
              height={64}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-snug line-clamp-2 transition-colors"
            style={{ color: '#0D1B2A' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#E8192C'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#0D1B2A'}>
            {article.title}
          </p>
          <p className="text-[11px] mt-1 font-semibold" style={{ color: '#E8192C' }}>{date}</p>
        </div>
      </Link>
    )
  }
  if (variant === 'featured') {
    return (
      <Link href={`/news-room/${article.slug}`}
        className="relative block rounded-xl overflow-hidden group"
        style={{ minHeight: 300 }}>
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: '#162234' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: '#E8192C' }}>{date}</p>
          <h3 className="font-headline text-white font-bold leading-snug" style={{ fontSize: 'clamp(16px, 2vw, 22px)' }}>
            {article.title}
          </h3>
        </div>
      </Link>
    )
  }
  return (
    <Link href={`/news-room/${article.slug}`} className="group block">
      {article.cover_image && (
        <div className="rounded-lg overflow-hidden mb-3" style={{ aspectRatio: '16/9' }}>
          <Image
            src={article.cover_image}
            alt={article.title}
            width={400}
            height={225}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {!article.cover_image && (
        <div className="rounded-lg mb-3 flex items-center justify-center"
          style={{ aspectRatio: '16/9', backgroundColor: '#F3F4F6' }}>
          <span className="font-headline font-black text-4xl" style={{ color: '#E8192C', opacity: 0.3 }}>MJA</span>
        </div>
      )}
      <p className="text-[11px] font-bold tracking-wide mb-1.5" style={{ color: '#E8192C' }}>{date}</p>
      <h3 className="font-semibold text-[14px] leading-snug line-clamp-3 transition-colors"
        style={{ color: '#0D1B2A' }}
        onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#E8192C'}
        onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#0D1B2A'}>
        {article.title}
      </h3>
    </Link>
  )
}
