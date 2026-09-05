'use client'

import { useEffect, useState } from 'react'

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function EventCountdown({ eventDate }: { eventDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(eventDate))

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(eventDate)), 1000)
    return () => clearInterval(interval)
  }, [eventDate])

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide px-4 py-2 rounded-lg bg-gray-100 text-gray-500">
        This event has passed
      </div>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3">
      {units.map((u) => (
        <div key={u.label} className="text-center bg-white rounded-lg border border-gray-200/80 px-4 py-3 min-w-[64px]">
          <p className="font-headline text-2xl font-black" style={{ color: '#E8192C' }}>
            {String(u.value).padStart(2, '0')}
          </p>
          <p className="text-[10px} font-bold uppercase tracking-wide text-gray-400 mt-0.5">{u.label}</p>
        </div>
      ))}
    </div>
  )
}
