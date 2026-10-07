'use client'

import { useEffect, useState } from 'react'

function getParts(target: number) {
  const diff = target - Date.now()
  if (diff <= 0) return null
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export default function EventCountdown({ eventDate }: { eventDate: string }) {
  const target = new Date(eventDate).getTime()
  const [parts, setParts] = useState<ReturnType<typeof getParts>>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const tick = () => {
      setParts(getParts(target))
      setReady(true)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!ready) return <div className="h-[68px]" />

  if (!parts) {
    return <p className="text-sm font-semibold text-gray-500">This event has passed</p>
  }

  const items = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Min', value: parts.minutes },
    { label: 'Sec', value: parts.seconds },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-0 rounded-lg border border-gray-200 py-2.5 text-center"
        >
          <div
            className="text-xl font-black tabular-nums leading-none"
            style={{ color: '#E8192C' }}
          >
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="mt-1.5 text-[9px] font-bold uppercase tracking-wide text-gray-400">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
