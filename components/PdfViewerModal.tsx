'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface Props {
  url: string
  title: string
  onClose: () => void
}

export default function PdfViewerModal({ url, title, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ backgroundColor: '#0D1B2A' }}
      >
        <p className="text-white text-sm font-semibold truncate max-w-xl">{title}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            className="text-white/60 hover:text-white text-xs font-semibold transition-colors"
          >
            Open in new tab ↗
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* PDF iframe — works for PDFs served from public storage */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full h-full border-0"
          title={title}
        />
      </div>
    </div>
  )
}
