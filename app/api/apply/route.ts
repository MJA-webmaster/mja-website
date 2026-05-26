import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, name, email, phone, outlet, years, message } = body

    if (!name || !email || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('membership_applications')
      .insert({
        type,
        name,
        email,
        phone: phone || null,
        outlet: outlet || null,
        years_in_journalism: years ? parseInt(years) : null,
        message: message || null,
      })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
    }

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY
    const mjaEmail = process.env.MJA_EMAIL || 'info@mja.mv'

    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'MJA Website <onboarding@resend.dev>',
          to: [mjaEmail],
          subject: `New Membership Application — ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #E8192C; padding: 24px; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Membership Application</h1>
              </div>
              <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 140px;">Membership Type</td>
                    <td style="padding: 8px 0; color: #0D1B2A; font-weight: 600; text-transform: capitalize;">${type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Full Name</td>
                    <td style="padding: 8px 0; color: #0D1B2A; font-weight: 600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                    <td style="padding: 8px 0; color: #0D1B2A;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Phone</td>
                    <td style="padding: 8px 0; color: #0D1B2A;">${phone || '—'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Media Outlet</td>
                    <td style="padding: 8px 0; color: #0D1B2A;">${outlet || '—'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Years in Journalism</td>
                    <td style="padding: 8px 0; color: #0D1B2A;">${years || '—'}</td>
                  </tr>
                  ${message ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message</td>
                    <td style="padding: 8px 0; color: #0D1B2A;">${message}</td>
                  </tr>
                  ` : ''}
                </table>
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://mja-website-gilt.vercel.app'}/admin"
                     style="display: inline-block; margin-top: 12px; background: #0D1B2A; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
                    View in Admin Panel →
                  </a>
                </div>
              </div>
            </div>
          `,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Apply error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
