'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EventItem {
  id: string
  title: string
  slug: string | null
  event_date: string
  venue?: string | null
}

export default function EventCalendarWidget({
  currentEventId,
  allEvents,
}: {
  currentEventId: string
  allEvents: EventItem[]
}) {
  const currentEvent = allEvents.find((e) => e.id === currentEventId)
  const initialDate = currentEvent ? new Date(currentEvent.event_date) : new Date()

  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const eventsInMonth = allEvents.filter((e) => {
    const d = new Date(e.event_date)
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth
  })

  const eventsByDay = eventsInMonth.reduce((acc, e) => {
    const day = new Date(e.event_date).getDate()
    if (!acc[day]) acc[day] = []
    acc[day].push(e)
    return acc
  }, {} as Record<number, EventItem[]>)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const sortedMonthEvents = [...eventsInMonth].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-6">
      {/* Calendar grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-navy transition-colors">
            <ChevronLeft size={16} />
          </button>
          <p className="text-sm font-bold text-navy">{monthLabel}</p>
          <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-navy transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i} className="text-[10px] font-bold text-gray-400 pb-1">{d}</span>
          ))}
          {cells.map((day, i) => {
            const dayEvents = day ? eventsByDay[day] : undefined
            const isCurrent = dayEvents?.some((e) => e.id === currentEventId)
            const hasEvent = !!dayEvents?.length

            return (
              <div key={i} className="aspect-square flex items-center justify-center relative">
                {day && (
                  <span
                    className={`w-full h-full flex items-center justify-center rounded-lg text-xs ${
                      isCurrent ? 'text-white font-bold' : hasEvent ? 'font-semibold text-navy' : 'text-gray-500'
                    }`}
                    style={isCurrent ? { backgroundColor: '#E8192C' } : hasEvent ? { backgroundColor: '#FEE2E2', color: '#E8192C' } : {}}
                  >
                    {day}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Event list for the visible month */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
          Events in {new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'short' })}
        </p>
        <div className="space-y-2">
          {sortedMonthEvents.length === 0 && (
            <p className="text-xs text-gray-400">No events this month.</p>
          )}
          {sortedMonthEvents.map((e) => {
            const isCurrent = e.id === currentEventId
            const content = (
              <div
                className="rounded-lg px-3 py-2 transition-colors"
                style={isCurrent ? { backgroundColor: '#E8192C', color: 'white' } : { backgroundColor: '#F9FAFB' }}
              >
                <p className={`text-[10px] font-bold ${isCurrent ? 'text-white/80' : 'text-gray-400'}`}>
                  {new Date(e.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  {' · '}
                  {new Date(e.event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
                <p className={`text-xs font-semibold leading-snug ${isCurrent ? 'text-white' : 'text-navy'}`}>
                  {e.title}
                </p>
              </div>
            )
            return e.slug && !isCurrent ? (
              <Link key={e.id} href={`/the-association/activities/${e.slug}`} className="block hover:opacity-80 transition-opacity">
                {content}
              </Link>
            ) : (
              <div key={e.id}>{content}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
