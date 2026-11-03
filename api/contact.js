import nodemailer from 'nodemailer'

/**
 * Vercel serverless function: POST /api/contact
 *
 * Validates the contact form submission and emails it to the owner over SMTP
 * (nodemailer). All secrets come from environment variables — see .env.example.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\-\s\d]{7,20}$/

// Best-effort per-instance rate limit. Serverless instances do not share memory, so this only
// slows down trivial abuse; it is not a replacement for a captcha or an edge rate limiter.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  for (const [key, list] of hits) {
    const fresh = list.filter((t) => now - t < WINDOW_MS)
    if (fresh.length) hits.set(key, fresh)
    else hits.delete(key)
  }
  const list = hits.get(ip) ?? []
  if (list.length >= MAX_PER_WINDOW) return true
  list.push(now)
  hits.set(ip, list)
  return false
}

/** Single-line, trimmed, length-capped — safe for headers and subject lines. */
const oneLine = (v, max) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max)

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

function validate(b) {
  const data = {
    name: oneLine(b.name, 120),
    role: oneLine(b.role, 100),
    email: oneLine(b.email, 254),
    phone: oneLine(b.phone, 20),
    inquiry: oneLine(b.inquiry, 100),
    message: String(b.message ?? '').replace(/\r\n/g, '\n').trim(),
  }
  const errors = {}
  if (data.name.length < 2) errors.name = 'Name is required.'
  if (data.role.length < 2) errors.role = 'Role is required.'
  if (!EMAIL_RE.test(data.email)) errors.email = 'A valid email is required.'
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = 'Phone number is not valid.'
  if (!data.inquiry) errors.inquiry = 'Inquiry type is required.'
  if (data.message.length < 10) errors.message = 'Message is too short.'
  else if (data.message.length > 3000) errors.message = 'Message is too long.'
  return { data, errors }
}

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env
  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO_EMAIL'].filter((k) => !process.env[k]?.trim())
  if (missing.length) return { missing }

  const port = Number(SMTP_PORT) || 465
  const secure = SMTP_SECURE ? SMTP_SECURE.trim().toLowerCase() === 'true' : port === 465
  return {
    transporter: nodemailer.createTransport({
      host: SMTP_HOST.trim(),
      port,
      secure,
      auth: { user: SMTP_USER.trim(), pass: SMTP_PASS },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    }),
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = null
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request.' })
  }

  // Honeypot: pretend success so bots learn nothing, but send nothing.
  if (body.company_website) return res.status(200).json({ ok: true })

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim()
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many messages. Please try again later.' })
  }

  const { data, errors } = validate(body)
  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, error: 'Please check the form and try again.', fields: errors })
  }

  const { transporter, missing } = createTransport()
  if (missing) {
    console.error(`[contact] Missing environment variables: ${missing.join(', ')}`)
    return res.status(500).json({ ok: false, error: 'The contact form is not configured yet.' })
  }

  const siteName = process.env.SITE_NAME?.trim() || 'VKS Film Production'
  const authUser = process.env.SMTP_USER.trim()
  const fromAddress = process.env.CONTACT_FROM_EMAIL?.trim() || authUser
  const toAddress = process.env.CONTACT_TO_EMAIL.trim()

  const subject = `Project inquiry: ${data.inquiry} — ${data.name}`
  const rows = [
    ['Name', data.name],
    ['Current role', data.role],
    ['Email', data.email],
    ...(data.phone ? [['Phone', data.phone]] : []),
    ['Inquiry type', data.inquiry],
  ]

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', data.message].join('\n')
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px;font-size:18px">New website inquiry</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
          )
          .join('')}
      </table>
      <div style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:14px">${escapeHtml(data.message)}</div>
      <p style="margin-top:24px;font-size:12px;color:#888">Sent from the ${escapeHtml(siteName)} website contact form. Reply to this email to answer ${escapeHtml(data.name)} directly.</p>
    </div>`

  try {
    await transporter.sendMail({
      from: { name: `${siteName} Website`, address: fromAddress },
      to: toAddress,
      replyTo: { name: data.name.replace(/["<>]/g, ''), address: data.email },
      subject,
      text,
      html,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] Failed to send email:', err?.code ?? '', err?.message ?? err)
    return res.status(502).json({ ok: false, error: 'We could not deliver your message. Please try again.' })
  }
}
