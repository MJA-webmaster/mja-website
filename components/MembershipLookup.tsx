'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Result = {
  member_id: string | null
  name: string
  membership_type: string | null
  fee_status: string | null
  fee_paid_until: string | null
  member_since: string | null
  is_active: boolean
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none text-navy'
const labelClass =
  'block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5'

export default function MembershipLookup() {
  const [idCard, setIdCard] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setNotFound(false)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.rpc('lookup_member', {
      p_id_card: idCard,
      p_last_name: lastName,
    })

    setLoading(false)

    if (error) {
      setError('Could not complete the search. Please try again.')
      return
    }

    const row = Array.isArray(data) ? data[0] : data
    if (!row) {
      setNotFound(true)
      return
    }

    setResult(row as Result)
  }

  function reset() {
    setResult(null)
    setNotFound(false)
    setError('')
    setIdCard('')
    setLastName('')
  }

  if (result) {
    const paid = result.fee_status === 'paid'
    return (
      <div>
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6" style={{ backgroundColor: '#0D1B2A' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#E8192C' }}>
              Membership ID
            </p>
            <p className="text-white font-headline text-3xl font-black">
              {result.member_id || 'Not yet issued'}
            </p>
            <p className="text-white/50 text-sm mt-1">{result.name}</p>
          </div>

          <div className="p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Membership Fee
              </span>
              <span
                className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{
                  backgroundColor: paid ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.12)',
                  color: paid ? '#059669' : '#D97706',
                }}
              >
                {paid ? 'Paid' : 'Unpaid'}
              </span>
            </div>

            {result.membership_type && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Type</span>
                <span className="text-sm text-navy">{result.membership_type}</span>
              </div>
            )}

            {paid && result.fee_paid_until && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Paid Until</span>
                <span className="text-sm text-navy">
                  {new Date(result.fee_paid_until).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {result.member_since && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Member Since</span>
                <span className="text-sm text-navy">
                  {new Date(result.member_since).toLocaleDateString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {!result.is_active && (
              <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                This membership is currently inactive. Please contact MJA for details.
              </p>
            )}
          </div>
        </div>

        {!paid && (
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            To settle your membership fee, contact MJA at{' '}
            <a href="mailto:info@mja.mv" style={{ color: '#E8192C' }}>info@mja.mv</a>.
          </p>
        )}

        <button
          onClick={reset}
          className="mt-6 text-sm font-semibold"
          style={{ color: '#E8192C' }}
        >
          Search again
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>ID Card No.</label>
        <input
          type="text"
          value={idCard}
          onChange={(e) => setIdCard(e.target.value)}
          required
          placeholder="e.g. A123456"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          minLength={3}
          placeholder="e.g. Didi"
          className={inputClass}
        />
        <p className="text-xs text-gray-400 mt-1.5">
          The last part of your name as registered with MJA.
        </p>
      </div>

      {notFound && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{
            color: '#D97706',
            backgroundColor: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          No matching membership found. Check the details and try again, or contact MJA at{' '}
          <a href="mailto:info@mja.mv" style={{ color: '#D97706', fontWeight: 600 }}>info@mja.mv</a>.
        </p>
      )}

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{
            color: '#E8192C',
            backgroundColor: 'rgba(232,25,44,0.08)',
            border: '1px solid rgba(232,25,44,0.2)',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white py-4 rounded-lg font-bold text-sm tracking-wide transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#E8192C' }}
      >
        {loading ? 'Searching...' : 'Check Membership'}
      </button>
    </form>
  )
}
