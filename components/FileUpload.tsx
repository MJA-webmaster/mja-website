'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'

interface Props {
  value: string
  onChange: (url: string, size: string) => void
  onClear: () => void
  folder?: string
  label?: string
  accept?: string
}

export default function FileUpload({
  value,
  onChange,
  onClear,
  folder = 'misc',
  label,
  accept = 'application/pdf,image/*',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  async function upload(file: File) {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setError('Only PDF or image files are accepted.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File must be under 20MB.')
      return
    }

    setUploading(true)
    setError('')

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: upErr } = await supabase.storage.from('resources').upload(path, file)

    if (upErr) {
      setError(upErr.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('resources').getPublicUrl(path)
    onChange(data.publicUrl, formatSize(file.size))
    setUploading(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  const isPdf = value && !value.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const filename = value ? value.split('/').pop() ?? 'file' : ''

  return (
    <div>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(232,25,44,0.08)' }}
          >
            {isPdf
              ? <FileText size={16} style={{ color: '#E8192C' }} />
              : <ImageIcon size={16} style={{ color: '#E8192C' }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-navy truncate">{filename}</p>
            
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px]"
              style={{ color: '#E8192C' }}
            >
              View file ↗
            </a>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 flex-shrink-0"
            aria-label="Remove file"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="w-full h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors"
          style={{
            borderColor: dragging ? '#E8192C' : '#E5E7EB',
            backgroundColor: dragging ? 'rgba(232,25,44,0.03)' : '#FAFAFA',
          }}
        >
          <Upload size={18} strokeWidth={1.75} className="text-gray-300 mb-1.5" />
          <p className="text-xs text-gray-400">
            {uploading ? 'Uploading...' : 'Click or drag a file here'}
          </p>
          <p className="text-[10px] text-gray-300 mt-0.5">PDF or image, max 20MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file)
          e.target.value = ''
        }}
      />

      {error && <p className="text-xs mt-1.5" style={{ color: '#E8192C' }}>{error}</p>}
    </div>
  )
}
