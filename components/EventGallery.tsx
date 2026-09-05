'use client'

import { useRef } from 'react'
import Image from 'next/image'

export default function EventGallery({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  if (images.length === 0) return null

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
      style={{ scrollbarWidth: 'none' }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative shrink-0 w-[78%] sm:w-[320px] aspect-[4/3] rounded-xl overflow-hidden snap-start bg-gray-100">
          <Image src={src} alt={`Gallery image ${i + 1}`} fill className="object-cover" sizes="320px" />
        </div>
      ))}
    </div>
  )
}
