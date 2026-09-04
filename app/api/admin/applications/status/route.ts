import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/mailer'
import { wrapEmail, button } from '@/lib/emailTemplates'

export async function POST(request: Request) {
  try {
    // Only a logged-in admin may change an application's status.
    const supabaseAuth = createServerClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
    }

    const { id, status } = await request.json()
    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: application, error: fetchError } = await supabase
      .from('membership_applications')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('membership_applications')
      .update({ status })
      .eq('id', id)

    if (updateError) {
      console.error('Application status update failed:', updateError)
      return NextResponse.json({ error: 'Could not update application.' }, { status: 500 })
    }

    let member = null

    if (status === 'approved') {
      // A database trigger creates the corresponding `members` row on
      // approval; give it a moment, then look it up.
      if (application.id_card_no) {
        await new Promise((r) => setTimeout(r, 800))
        const { data } = await supabase
          .from('members')
          .select('*')
          .eq('id_card_no', application.id_card_no)
          .single()
        member = data ?? null
      }

      const applicantName = application.full_name || application.common_name || 'there'
      await sendEmail({
        to: [{ email: application.email }],
        subject: 'Welcome to the Maldives Journalists Association',
        html: wrapEmail({
          preheader: 'Your MJA membership registration has been confirmed.',
          body: `
            <h1 style="margin:0 0 16px 0;font-size:20px;color:#0D1B2A;font-weight:800;">Welcome to MJA</h1>
            <p style="margin:0 0 20px 0;font-size:14px;line-height:1.7;color:#374151;">
              Hi ${applicantName}, welcome to the Maldives Journalists Association (MJA). Your ${application.membership_type} membership registration has been confirmed.
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

    return NextResponse.json({ ok: true, member })
  } catch (err) {
    console.error('Application status route error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
