// Shared branded HTML wrapper for all outgoing MJA emails.
// Every email (contact notifications, application confirmations, the
// newsletter welcome email, and admin newsletter blasts) is built by
// passing its inner content through wrapEmail() so they all share the
// same header, footer, and look.

const SITE_URL = 'https://mja.mv'
const LOGO_URL = `${SITE_URL}/mjalogo.png`

export function wrapEmail({
  preheader,
  body,
  unsubscribeUrl,
}: {
  /** Short hidden preview text shown in inbox lists (optional). */
  preheader?: string
  /** Inner HTML — the email-specific content. */
  body: string
  /** If present, adds an unsubscribe line to the footer. */
  unsubscribeUrl?: string
}) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Maldives Journalists Association</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F5F4F0;font-family:Helvetica,Arial,sans-serif;">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F4F0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">

            <!-- Header -->
            <tr>
              <td style="background-color:#0D1B2A;padding:28px 32px;text-align:center;">
                <img src="${LOGO_URL}" alt="MJA" height="40" style="height:40px;width:auto;display:inline-block;" />
              </td>
            </tr>

            <!-- Red accent bar -->
            <tr>
              <td style="background-color:#E8192C;height:4px;line-height:4px;font-size:0;">&nbsp;</td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 32px;">
                ${body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#F9FAFB;padding:24px 32px;border-top:1px solid #F3F4F6;">
                <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;color:#0D1B2A;letter-spacing:0.03em;">
                  MALDIVES JOURNALISTS ASSOCIATION
                </p>
                <p style="margin:0 0 12px 0;font-size:12px;color:#9CA3AF;">
                  Malé, Maldives &nbsp;·&nbsp;
                  <a href="${SITE_URL}" style="color:#E8192C;text-decoration:none;">mja.mv</a>
                </p>
                ${
                  unsubscribeUrl
                    ? `<p style="margin:0;font-size:11px;color:#B0B6BE;">
                        You're receiving this because you subscribed to MJA updates.
                        <a href="${unsubscribeUrl}" style="color:#9CA3AF;text-decoration:underline;">Unsubscribe</a>
                      </p>`
                    : ''
                }
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background-color:#E8192C;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;">${label}</a>`
}

export function detailRow(label: string, value: string) {
  return `<div style="display:flex;padding:8px 0;border-bottom:1px solid #F3F4F6;">
    <span style="color:#9CA3AF;font-size:13px;width:140px;flex-shrink:0;">${label}</span>
    <span style="color:#0D1B2A;font-size:13px;font-weight:500;">${value}</span>
  </div>`
}
