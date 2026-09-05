'use client'

import Link from 'next/link'

interface EventItem {
  id: string
  title: string
  slug: string | null
  event_date: string
}

export default function EventCalendarWidget({ current, upcoming }: { current: EventItem; upcoming: EventItem[] }) {
  const date = new Date(current.event_date)
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const eventDatesInMonth = new Set(
    upcoming
      .filter((e) => {
        const d = new Date(e.event_date)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .map((e) => new Date(e.event_date).getDate())
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5">
      <p className="text-sm font-bold text-navy mb-3">
        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-gray-400">{d}</span>
        ))}
        {cells.map((day, i) => {
          const isEventDay = day === date.getDate()
          const hasEvent = day && eventDatesInMonth.has(day)
          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs relative ${
                isEventDay ? 'text-white font-bold' : 'text-gray-600'
              }`}
              style={isEventDay ? { backgroundColor: '#E8192C' } : {}}
            >
              {day ?? ''}
              {hasEvent && !isEventDay && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ backgroundColor: '#E8192C' }} />
              )}
            </div>
          )
        })}
      </div>

      {upcoming.length > 0 && (
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Upcoming</p>
          {upcoming.slice(0, 3).map((e) => (
            <Link key={e.id} href={e.slug ? `/the-association/activities/${e.slug}` : '#'} className="block group">
              <p className="text-xs font-semibold text-navy group-hover:text-[#E8192C] transition-colors leading-snug">{e.title}</p>
              <p className="text-[11px] text-gray-400">
                {new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
