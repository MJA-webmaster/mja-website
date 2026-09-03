import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'
import { wrapEmail, button } from '@/lib/emailTemplates'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single()

    // 23505 = unique_violation — already subscribed. Treat as success
    // from the visitor's point of view, but skip re-sending the welcome
    // email since they already got one.
    if (error && error.code !== '23505') {
      console.error('Newsletter subscribe insert failed:', error)
      return NextResponse.json({ error: 'Could not subscribe right now.' }, { status: 500 })
    }

    if (data) {
      const unsubscribeUrl = `https://mja.mv/api/newsletter/unsubscribe?id=${data.id}`
      await sendEmail({
        to: [{ email }],
        subject: 'Welcome to the Maldives Journalists Association',
        html: wrapEmail({
          preheader: 'Your MJA membership registration has been confirmed.',
          unsubscribeUrl,
          body: `
            <h1 style="margin:0 0 16px 0;font-size:20px;color:#0D1B2A;font-weight:800;">Welcome to MJA</h1>
            <p style="margin:0 0 20px 0;font-size:14px;line-height:1.7;color:#374151;">
              Welcome to the Maldives Journalists Association (MJA). Your membership registration has been confirmed.
            </p>
            <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#374151;">
              Here is what you can expect:
            </p>
            <ul style="margin:0 0 24px 0;padding-left:20px;font-size:14px;line-height:1.9;color:#374151;">
              <li>Updates on upcoming journalism workshops and events</li>
              <li>Occasional newsletters and industry updates</li>
              <li>Important notices regarding press freedom and member resources</li>
            </ul>
            <p style="margin:0 0 28px 0;font-size:14px;line-height:1.7;color:#374151;">
              You can manage your membership preferences or view upcoming programs anytime on our website.
            </p>
            ${button('Visit mja.mv', 'https://mja.mv')}
            <p style="margin:28px 0 0 0;font-size:14px;line-height:1.7;color:#374151;">
              Best regards,<br />
              Maldives Journalists Association (MJA)<br />
              Malé, Maldives
            </p>
          `,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
