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

interface MomentItem {
  id: string
  title: string
  date: string
  parentSlug: string | null
  parentTitle: string
}

export default function EventCalendarWidget({
  currentEventId,
  allEvents,
  moments = [],
}: {
  currentEventId: string
  allEvents: EventItem[]
  moments?: MomentItem[]
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

  const momentsInMonth = moments.filter((m) => {
    const d = new Date(m.date)
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth
  })

  const eventsByDay = eventsInMonth.reduce((acc, e) => {
    const day = new Date(e.event_date).getDate()
    if (!acc[day]) acc[day] = []
    acc[day].push(e)
    return acc
  }, {} as Record<number, EventItem[]>)

  const momentsByDay = momentsInMonth.reduce((acc, m) => {
    const day = new Date(m.date).getDate()
    if (!acc[day]) acc[day] = []
    acc[day].push(m)
    return acc
  }, {} as Record<number, MomentItem[]>)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const combinedList = [
    ...eventsInMonth.map((e) => ({ type: 'event' as const, id: e.id, title: e.title, date: e.event_date, slug: e.slug })),
    ...momentsInMonth.map((m) => ({ type: 'moment' as const, id: m.id, title: m.title, date: m.date, slug: m.parentSlug, parentTitle: m.parentTitle })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-6">
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
            const dayMoments = day ? momentsByDay[day] : undefined
            const isCurrent = dayEvents?.some((e) => e.id === currentEventId)
            const hasEvent = !!dayEvents?.length
            const hasMoment = !!dayMoments?.length

            return (
              <div key={i} className="aspect-square flex flex-col items-center justify-center relative gap-0.5">
                {day && (
                  <>
                    <span
                      className={`w-full h-full flex items-center justify-center rounded-lg text-xs ${
                        isCurrent ? 'text-white font-bold' : hasEvent ? 'font-semibold text-navy' : 'text-gray-500'
                      }`}
                      style={isCurrent ? { backgroundColor: '#E8192C' } : hasEvent ? { backgroundColor: '#FEE2E2', color: '#E8192C' } : {}}
                    >
                      {day}
                    </span>
                    {hasMoment && !isCurrent && (
                      <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0D1B2A' }} />
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E8192C' }} />
            <span className="text-[10px] text-gray-400">Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#0D1B2A' }} />
            <span className="text-[10px] text-gray-400">Related update</span>
          </div>
        </div>
      </div>

      {/* Combined list */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
          Timeline in {new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'short' })}
        </p>
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {combinedList.length === 0 && (
            <p className="text-xs text-gray-400">Nothing this month.</p>
          )}
          {combinedList.map((item) => {
            const isCurrentEvent = item.type === 'event' && item.id === currentEventId
            const content = (
              <div
                className="rounded-lg px-3 py-2 transition-colors"
                style={
                  isCurrentEvent
                    ? { backgroundColor: '#E8192C', color: 'white' }
                    : item.type === 'moment'
                    ? { backgroundColor: '#F1F5F9' }
                    : { backgroundColor: '#F9FAFB' }
                }
              >
                <p className={`text-[10px] font-bold ${isCurrentEvent ? 'text-white/80' : 'text-gray-400'}`}>
                  {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  {item.type === 'moment' && ' · Update'}
                </p>
                <p className={`text-xs font-semibold leading-snug ${isCurrentEvent ? 'text-white' : 'text-navy'}`}>
                  {item.title}
                </p>
                {item.type === 'moment' && (
                  <p className="text-[10px] text-gray-400 mt-0.5">on {item.parentTitle}</p>
                )}
              </div>
            )
            return item.slug && !isCurrentEvent ? (
              <Link key={`${item.type}-${item.id}`} href={`/the-association/activities/${item.slug}`} className="block hover:opacity-80 transition-opacity">
                {content}
              </Link>
            ) : (
              <div key={`${item.type}-${item.id}`}>{content}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
