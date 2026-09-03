// Thin wrapper around the MailerSend API used by the contact form,
// membership application routes, and the newsletter. Failures are
// swallowed by callers where delivery must never block the underlying
// form submission (contact/apply); the newsletter send route surfaces
// them instead so the admin knows a blast failed.

type Recipient = { email: string; name?: string }

type SendEmailArgs = {
  to: Recipient[]
  subject: string
  html: string
  replyTo?: string
}

function mailerConfig() {
  const apiKey = process.env.MAILERSEND_API_KEY
  const fromEmail = process.env.MJA_FROM_EMAIL
  const fromName = process.env.MJA_FROM_NAME || 'MJA Website'
  return { apiKey, fromEmail, fromName }
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailArgs) {
  const { apiKey, fromEmail, fromName } = mailerConfig()
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

type BulkMessage = {
  to: Recipient[]
  subject: string
  html: string
}

/**
 * Sends a batch of individually-addressed emails (each recipient only
 * sees their own address, and each message can carry its own
 * personalized content, e.g. a per-subscriber unsubscribe link) via
 * MailerSend's bulk endpoint. Used for newsletter blasts. Throws if
 * MailerSend isn't configured or a batch is rejected — callers should
 * surface that to the admin rather than silently swallowing it.
 */
export async function sendBulkEmail(messages: BulkMessage[]) {
  const { apiKey, fromEmail, fromName } = mailerConfig()
  if (!apiKey || !fromEmail) {
    throw new Error('MailerSend is not configured (missing MAILERSEND_API_KEY or MJA_FROM_EMAIL).')
  }
  if (messages.length === 0) return { sent: 0 }

  // MailerSend's bulk endpoint accepts up to 500 messages per request.
  const chunks: BulkMessage[][] = []
  for (let i = 0; i < messages.length; i += 500) {
    chunks.push(messages.slice(i, i + 500))
  }

  let sent = 0
  for (const chunk of chunks) {
    const requests = chunk.map((msg) => ({
      from: { email: fromEmail, name: fromName },
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
    }))

    const res = await fetch('https://api.mailersend.com/v1/bulk-email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requests),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('MailerSend bulk error:', res.status, text)
      throw new Error(`MailerSend rejected the send (status ${res.status}).`)
    }

    sent += chunk.length
  }

  return { sent }
}
