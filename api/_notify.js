/**
 * Sends admin notification emails via Resend.
 * Requires env: RESEND_API_KEY, ADMIN_NOTIFY_EMAIL, EMAIL_FROM
 * Skips silently if not configured.
 */
async function sendEmail({ subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ADMIN_NOTIFY_EMAIL
  const from = process.env.EMAIL_FROM || 'TM Beauty <onboarding@resend.dev>'

  if (!apiKey || !to) {
    console.warn('[notify] Skipping email — set RESEND_API_KEY and ADMIN_NOTIFY_EMAIL')
    return { skipped: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend ${res.status}: ${body}`)
  }

  return res.json()
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function notifyAdminNewConsultation(row) {
  const name = escapeHtml(row.name)
  const contact = escapeHtml(row.contact)
  const service = escapeHtml(row.service || 'Not specified')
  const notes = escapeHtml(row.notes || '—')
  const photo = row.photo_url
    ? `<p><strong>Media:</strong> <a href="${escapeHtml(row.photo_url)}">${escapeHtml(row.photo_url)}</a></p>`
    : '<p><strong>Media:</strong> None</p>'

  const subject = `New consultation request — ${row.name || 'Client'}`
  const text = [
    'New consultation request',
    `Name: ${row.name || ''}`,
    `Contact: ${row.contact || ''}`,
    `Service: ${row.service || 'Not specified'}`,
    `Notes: ${row.notes || '—'}`,
    `Media: ${row.photo_url || 'None'}`,
  ].join('\n')

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #6B4E3D;">New consultation request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Notes:</strong><br/>${notes.replace(/\n/g, '<br/>')}</p>
      ${photo}
      <p style="margin-top: 24px; color: #888; font-size: 13px;">Open your TM Beauty admin dashboard to review this request.</p>
    </div>
  `

  return sendEmail({ subject, html, text })
}

module.exports = { sendEmail, notifyAdminNewConsultation }
