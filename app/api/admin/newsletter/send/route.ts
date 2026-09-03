import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendBulkEmail } from '@/lib/mailer'
import { wrapEmail } from '@/lib/emailTemplates'

export async function POST(request: Request) {
  try {
    // Only a logged-in admin (the same session the /admin pages require) may send.
    const supabaseAuth = createServerClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }

    const { subject, message, recipientIds } = await request.json()

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 })
    }
    if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
      return NextResponse.json({ error: 'Select at least one recipient.' }, { status: 400 })
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('id, email')
      .in('id', recipientIds)

    if (error) {
      console.error('Failed to load recipients:', error)
      return NextResponse.json({ error: 'Could not load recipients.' }, { status: 500 })
    }
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No matching subscribers found.' }, { status: 400 })
    }

    const bodyHtml = String(message)
      .split(/\n{2,}/)
      .map((para) => `<p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;color:#374151;">${para.replace(/\n/g, '<br/>')}</p>`)
      .join('')

    const messages = subscribers.map((s) => ({
      to: [{ email: s.email }],
      subject,
      html: wrapEmail({
        preheader: subject,
        unsubscribeUrl: `https://mja.mv/api/newsletter/unsubscribe?id=${s.id}`,
        body: `
          <h1 style="margin:0 0 20px 0;font-size:20px;color:#0D1B2A;font-weight:800;">${subject}</h1>
          ${bodyHtml}
        `,
      }),
    }))

    const { sent } = await sendBulkEmail(messages)

    return NextResponse.json({ ok: true, sent, total: subscribers.length })
  } catch (err) {
    console.error('Newsletter send error:', err)
    return NextResponse.json({ error: 'Something went wrong sending the newsletter.' }, { status: 500 })
  }
}
