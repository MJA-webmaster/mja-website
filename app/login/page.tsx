
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/mjalogo.png" alt="MJA" className="h-14 w-auto mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage content</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-white text-sm focus:outline-none placeholder:text-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="admin@mja.mv"
              required
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-white text-sm focus:outline-none placeholder:text-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm px-4 py-2.5 rounded-lg" style={{ color: '#E8192C', backgroundColor: 'rgba(232,25,44,0.1)', border: '1px solid rgba(232,25,44,0.2)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3.5 rounded-lg font-semibold transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#E8192C' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
