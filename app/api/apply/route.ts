import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'

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
        .map(
          ([label, value]) => `
            <div style="display:flex;padding:8px 0;border-bottom:1px solid #f3f4f6;">
              <span style="color:#9CA3AF;font-size:13px;width:150px;flex-shrink:0;">${label}</span>
              <span style="color:#0D1B2A;font-size:13px;font-weight:500;">${value}</span>
            </div>`
        )
        .join('')

      // Applicant confirmation
      await sendEmail({
        to: [{ email }],
        subject: 'We received your MJA membership application',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0D1B2A;padding:28px;border-radius:8px 8px 0 0;">
              <h1 style="color:white;margin:0;font-size:20px;">Application Received</h1>
            </div>
            <div style="background:#f9fafb;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
              <p style="color:#0D1B2A;font-size:14px;line-height:1.6;margin-top:0;">
                Thank you for applying for ${membership_type} membership with the Maldives
                Journalists Association. Our team will review your application and respond
                within 3 business days.
              </p>
              <div style="margin-top:20px;">${detailRows}</div>
              <p style="color:#9CA3AF;font-size:12px;margin-top:24px;line-height:1.6;">
                Questions? Contact us at
                <a href="mailto:${mjaEmail}" style="color:#E8192C;">${mjaEmail}</a>
              </p>
            </div>
            <p style="text-align:center;color:#9CA3AF;font-size:11px;margin-top:20px;">
              © ${new Date().getFullYear()} Maldives Journalists Association · mja.mv
            </p>
          </div>`,
      })

      // Admin notification
      await sendEmail({
        to: [{ email: mjaEmail }],
        subject: `New ${membership_type} Application — ${full_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#E8192C;padding:24px;border-radius:8px 8px 0 0;">
              <h1 style="color:white;margin:0;font-size:20px;">New Membership Application</h1>
            </div>
            <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
              ${detailRows}
              ${message ? `<p style="color:#6B7280;font-size:13px;margin-top:16px;">${message}</p>` : ''}
              <p style="margin-top:24px;">
                <a href="https://mja.mv/admin/applications"
                   style="background:#E8192C;color:white;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;">
                  Review in Admin
                </a>
              </p>
            </div>
          </div>`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Apply route error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
