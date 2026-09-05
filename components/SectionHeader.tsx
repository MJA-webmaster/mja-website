import Link from 'next/link'

interface Props {
  eyebrow: string
  title: React.ReactNode
  href: string
  linkLabel?: string
}

export default function SectionHeader({ eyebrow, title, href, linkLabel = 'View all' }: Props) {
  return (
    <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8192C] block mb-1">
          {eyebrow}
        </span>
        <h2 className="font-headline font-black uppercase text-2xl md:text-3xl text-[#0D1B2A]">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="text-xs font-bold tracking-wider uppercase text-[#E8192C] hover:text-[#c91424] transition-colors"
      >
        {linkLabel} →
      </Link>
    </div>
  )
}
