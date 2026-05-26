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
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <svg viewBox="0 0 36 36" fill="none" className="w-10 h-10 mx-auto mb-3">
            <path d="M4 28V10L14 24L24 10V28" stroke="#E8192C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M27 12L33 12" stroke="#E8192C" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M27 18L33 18" stroke="#E8192C" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <h1 className="font-headline text-white text-2xl font-bold">MJA Admin</h1>
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red placeholder:text-white/20"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-red placeholder:text-white/20"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red text-sm bg-red/10 border border-red/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red text-white py-3.5 rounded-lg font-semibold hover:bg-red-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
