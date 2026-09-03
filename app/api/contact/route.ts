import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'
import { wrapEmail, detailRow } from '@/lib/emailTemplates'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const mjaEmail = process.env.MJA_EMAIL || 'info@mja.mv'

    await sendEmail({
      to: [{ email: mjaEmail }],
      replyTo: email,
      subject: `Contact Form: ${subject} — ${name}`,
      html: wrapEmail({
        preheader: `New message from ${name}`,
        body: `
          <h1 style="margin:0 0 20px 0;font-size:20px;color:#0D1B2A;font-weight:800;">New Contact Message</h1>
          <div style="margin-bottom:20px;">
            ${detailRow('Name', name)}
            ${detailRow('Email', email)}
            ${detailRow('Subject', subject)}
          </div>
          <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#9CA3AF;">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;background:#F9FAFB;padding:16px;border-radius:8px;white-space:pre-wrap;">${message}</p>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
