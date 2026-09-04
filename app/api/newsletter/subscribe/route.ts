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
        subject: "You're subscribed to MJA updates",
        html: wrapEmail({
          preheader: "Thanks for subscribing to MJA updates.",
          unsubscribeUrl,
          body: `
            <h1 style="margin:0 0 16px 0;font-size:20px;color:#0D1B2A;font-weight:800;">You're on the list</h1>
            <p style="margin:0 0 20px 0;font-size:14px;line-height:1.7;color:#374151;">
              Thanks for subscribing to updates from the Maldives Journalists Association (MJA).
            </p>
            <p style="margin:0 0 12px 0;font-size:14px;line-height:1.7;color:#374151;">
              From time to time, you'll hear from us about:
            </p>
            <ul style="margin:0 0 24px 0;padding-left:20px;font-size:14px;line-height:1.9;color:#374151;">
              <li>Journalism workshops and events</li>
              <li>News and updates from the association</li>
              <li>Notices regarding press freedom in the Maldives</li>
            </ul>
            <p style="margin:0 0 28px 0;font-size:14px;line-height:1.7;color:#374151;">
              Interested in joining MJA as a member? You can apply anytime on our website.
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
