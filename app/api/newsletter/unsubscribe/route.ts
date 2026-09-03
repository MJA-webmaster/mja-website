import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Simple GET-based unsubscribe link used in newsletter emails. The
// subscriber's row id (a random UUID, never guessable) acts as the token.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const page = (message: string) => new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>MJA Newsletter</title>
      <style>body{font-family:sans-serif;background:#F5F4F0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
      .card{background:white;border-radius:12px;padding:40px;max-width:420px;text-align:center;border:1px solid #E5E7EB;}
      h1{font-size:18px;color:#0D1B2A;margin:0 0 8px 0;} p{color:#6B7280;font-size:14px;margin:0;}
      a{color:#E8192C;text-decoration:none;font-weight:600;font-size:13px;display:inline-block;margin-top:20px;}</style>
    </head><body><div class="card"><h1>${message}</h1><p><a href="https://mja.mv">Return to mja.mv</a></p></div></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )

  if (!id) return page('Invalid unsubscribe link.')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id)

  if (error) {
    console.error('Unsubscribe failed:', error)
    return page('Something went wrong. Please try again later.')
  }

  return page("You've been unsubscribed from MJA updates.")
}
