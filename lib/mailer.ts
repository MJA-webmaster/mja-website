// Thin wrapper around the MailerSend API used by the contact form and
// membership application routes. Failures are swallowed by callers
// (email delivery must never block the underlying form submission).

type SendEmailArgs = {
  to: { email: string; name?: string }[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailArgs) {
  const apiKey = process.env.MAILERSEND_API_KEY
  const fromEmail = process.env.MJA_FROM_EMAIL
  const fromName = process.env.MJA_FROM_NAME || 'MJA Website'

  if (!apiKey || !fromEmail) return { skipped: true }

  const body: Record<string, unknown> = {
    from: { email: fromEmail, name: fromName },
    to,
    subject,
    html,
  }
  if (replyTo) body.reply_to = [{ email: replyTo }]

  const res = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('MailerSend error:', res.status, text)
  }

  return { skipped: false, ok: res.ok }
}
