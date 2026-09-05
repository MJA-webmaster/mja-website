'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarPlus } from 'lucide-react'

function formatICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export default function AddToCalendarButton({
  title,
  description,
  location,
  startDate,
}: {
  title: string
  description?: string
  location?: string
  startDate: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const start = new Date(startDate)
  const end = new Date(start.getTime() + 60 * 60 * 1000)

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatICSDate(start)}/${formatICSDate(end)}&details=${encodeURIComponent(description ?? '')}&location=${encodeURIComponent(location ?? '')}`

  function downloadICS() {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `SUMMARY:${title}`,
      description ? `DESCRIPTION:${description.replace(/\n/g, '\\n')}` : '',
      location ? `LOCATION:${location}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^\w-]/g, '_')}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-200 text-navy hover:bg-gray-50 transition-colors w-full justify-center"
      >
        <CalendarPlus size={16} />
        Add to Calendar
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2.5 text-sm text-navy hover:bg-gray-50 transition-colors"
          >
            Google Calendar
          </a>
          <button
            onClick={downloadICS}
            className="block w-full text-left px-4 py-2.5 text-sm text-navy hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  )
}
