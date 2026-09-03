import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'
import { wrapEmail, button, detailRow } from '@/lib/emailTemplates'

const MEMBERSHIP_TYPES = ['Professional', 'Student', 'Corporate']

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      membership_type,
      full_name,
      common_name,
      id_card_no,
      email,
      mobile_no,
      employment_type,
      nature_of_work,
      workplace_name,
      designation,
      atoll_island,
      message,
      declaration,
      photo_url,
      id_card_url,
      portfolio_url,
    } = body

    // ── Validation ──
    if (!MEMBERSHIP_TYPES.includes(membership_type)) {
      return NextResponse.json({ error: 'Invalid membership type.' }, { status: 400 })
    }
    if (!full_name || !email || !mobile_no || !id_card_no) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }
    if (!declaration) {
      return NextResponse.json({ error: 'The declaration must be accepted.' }, { status: 400 })
    }

    const isCorporate = membership_type === 'Corporate'

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: dbError } = await supabase.from('membership_applications').insert({
      membership_type,
      full_name,
      common_name: common_name || null,
      id_card_no,
      email,
      mobile_no,
      employment_type: isCorporate ? null : employment_type,
      nature_of_work: isCorporate ? null : nature_of_work,
      workplace_name: workplace_name || null,
      designation: designation || null,
      atoll_island: atoll_island || null,
      message: message || null,
      declaration: true,
      photo_url: photo_url || null,
      id_card_url: id_card_url || null,
      portfolio_url: portfolio_url || null,
      status: 'pending',
    })

    if (dbError) {
      console.error('Application insert failed:', dbError)
      return NextResponse.json({ error: 'Could not save your application.' }, { status: 500 })
    }

    // ── Emails (non-blocking: a mail failure must not lose the application) ──
    const mjaEmail = process.env.MJA_EMAIL

    if (mjaEmail) {
      const rows: [string, string | null][] = [
        [isCorporate ? 'Organisation' : 'Full Name', full_name],
        [isCorporate ? 'Contact Person' : 'Common Name', common_name],
        [isCorporate ? 'Registration No.' : 'ID Card No.', id_card_no],
        ['Email', email],
        ['Mobile', mobile_no],
        ['Membership Type', membership_type],
        ['Employment Type', isCorporate ? null : employment_type],
        ['Nature of Work', isCorporate ? null : nature_of_work],
        ['Workplace', workplace_name],
        ['Designation', designation],
        ['Atoll / Island', atoll_island],
      ]

      const detailRows = rows
        .filter(([, value]) => Boolean(value))
        .map(([label, value]) => detailRow(label, value as string))
        .join('')

      // Applicant confirmation
      await sendEmail({
        to: [{ email }],
        subject: 'We received your MJA membership application',
        html: wrapEmail({
          preheader: `Thank you for applying for ${membership_type} membership.`,
          body: `
            <h1 style="margin:0 0 16px 0;font-size:20px;color:#0D1B2A;font-weight:800;">Application Received</h1>
            <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#374151;">
              Thank you for applying for <strong>${membership_type}</strong> membership with the Maldives
              Journalists Association. Our team will review your application and respond
              within 3 business days.
            </p>
            <div style="margin-bottom:24px;">${detailRows}</div>
            <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
              Questions? Contact us at
              <a href="mailto:${mjaEmail}" style="color:#E8192C;text-decoration:none;">${mjaEmail}</a>
            </p>
          `,
        }),
      })

      // Admin notification
      await sendEmail({
        to: [{ email: mjaEmail }],
        subject: `New ${membership_type} Application — ${full_name}`,
        html: wrapEmail({
          preheader: `New ${membership_type} application from ${full_name}`,
          body: `
            <h1 style="margin:0 0 20px 0;font-size:20px;color:#0D1B2A;font-weight:800;">New Membership Application</h1>
            <div style="margin-bottom:20px;">${detailRows}</div>
            ${message ? `<p style="margin:0 0 24px 0;font-size:13px;color:#6B7280;line-height:1.6;">${message}</p>` : ''}
            ${button('Review in Admin', 'https://mja.mv/admin/applications')}
          `,
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Apply route error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
