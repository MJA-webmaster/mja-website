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
          <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0">
            <Image
              src={article.cover_image}
              alt={article.title}
              width={80}
              height={64}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div>
          <p className="text-[13px] font-semibold text-navy group-hover:text-red transition-colors line-clamp-2 leading-snug">
            {article.title}
          </p>
          <p className="text-[11px] text-red mt-1">{date}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/news-room/${article.slug}`} className="relative block rounded-xl overflow-hidden group h-full min-h-[300px]">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-navy-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-red text-[11px] font-bold tracking-wider uppercase mb-2">{date}</p>
          <h3 className="font-headline text-white text-xl font-bold leading-snug">{article.title}</h3>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/news-room/${article.slug}`} className="group block">
      {article.cover_image && (
        <div className="rounded-lg overflow-hidden mb-3 aspect-video">
          <Image
            src={article.cover_image}
            alt={article.title}
            width={400}
            height={225}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <p className="text-[11px] text-red font-bold tracking-wide mb-1.5">{date}</p>
      <h3 className="font-semibold text-navy group-hover:text-red transition-colors text-[14px] leading-snug line-clamp-3">
        {article.title}
      </h3>
    </Link>
  )
}
