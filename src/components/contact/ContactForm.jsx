import { useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check, Loader2, Mail, Send } from 'lucide-react'
import { inquiryTypes } from '../../data/services'
import { filmRoleGroups, filmRoles } from '../../data/filmRoles'
import { mailtoHref, siteConfig } from '../../data/siteConfig'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\-\s\d]{7,20}$/

const empty = { name: '', role: '', otherRole: '', email: '', phone: '', inquiry: '', message: '', company_website: '' }

const currentRole = (v) => v.role === 'other' ? v.otherRole.trim() : v.role

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!filmRoles.has(v.role) && v.role !== 'other') e.role = 'Please select your current role.'
  if (v.role === 'other' && v.otherRole.trim().length < 2) e.otherRole = 'Please enter your current role.'
  else if (v.role === 'other' && v.otherRole.length > 100) e.otherRole = 'Please keep your role under 100 characters.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address, like name@example.com.'
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) e.phone = 'Please enter a valid phone number, or leave this blank.'
  if (!v.inquiry) e.inquiry = 'Please choose what your inquiry is about.'
  if (v.message.trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters).'
  else if (v.message.length > 3000) e.message = 'Please keep your message under 3000 characters.'
  return e
}

function composeEmail(v) {
  const label = inquiryTypes.find((t) => t.value === v.inquiry)?.label ?? 'General'
  const subject = `Project inquiry: ${label} — ${v.name.trim()}`
  const body = [
    `Name: ${v.name.trim()}`,
    `Current role: ${currentRole(v)}`,
    `Email: ${v.email.trim()}`,
    v.phone.trim() ? `Phone: ${v.phone.trim()}` : null,
    `Inquiry type: ${label}`,
    '',
    v.message.trim(),
  ]
    .filter((l) => l !== null)
    .join('\n')
  return { subject, body, label }
}

function Field({ id, label, optional, error, hint, children }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="eyebrow flex items-center gap-2 text-[0.66rem] text-soft/75">
        {label}
        {optional && <span className="font-medium normal-case tracking-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-[#ff7aa2]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Contact form — posts JSON to the Vercel serverless function in api/contact.js, which validates
 * the message again server-side and emails it to the owner with nodemailer.
 *
 * Success is only shown when the endpoint responds OK. The honeypot field (company_website) is
 * kept for bots; the server also rate-limits. For stronger spam protection consider a
 * privacy-friendly challenge such as Cloudflare Turnstile or hCaptcha.
 */
export default function ContactForm() {
  const [params] = useSearchParams()
  const preset = inquiryTypes.some((t) => t.value === params.get('inquiry')) ? params.get('inquiry') : ''
  const [values, setValues] = useState({ ...empty, inquiry: preset })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState({ state: 'idle' })
  const formRef = useRef(null)
  const uid = useId()
  const id = (n) => `${uid}-${n}`
  const endpoint = siteConfig.formEndpoint

  const update = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (touched[e.target.name]) setErrors(validate(next))
  }

  const blur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
    setErrors(validate(values))
  }

  const aria = (name) => ({
    id: id(name),
    name,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${id(name)}-error` : undefined,
    onChange: update,
    onBlur: blur,
    value: values[name],
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, role: true, otherRole: true, email: true, phone: true, inquiry: true, message: true })
    if (Object.keys(found).length) {
      setStatus({ state: 'invalid', count: Object.keys(found).length })
      const first = Object.keys(found)[0]
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    // honeypot: silently stop obvious bots
    if (values.company_website) return

    const { subject, body, label } = composeEmail(values)

    setStatus({ state: 'sending' })
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          role: currentRole(values),
          email: values.email.trim(),
          phone: values.phone.trim(),
          inquiry: label,
          message: values.message.trim(),
          company_website: values.company_website,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus({ state: 'sent' })
      setValues(empty)
      setTouched({})
    } catch {
      setStatus({ state: 'error', subject, body })
    }
  }

  const sending = status.state === 'sending'

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={id('how')} className="relative">
      <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-8">
        <Field id={id('name')} label="Full name" error={touched.name && errors.name}>
          <input {...aria('name')} type="text" autoComplete="name" required className="field-input" placeholder="Your name" />
        </Field>
        <Field id={id('role')} label="Current role" error={touched.role && errors.role}>
          <select {...aria('role')} required className="field-input">
            <option value="" disabled>Select your current role</option>
            {filmRoleGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </optgroup>
            ))}
            <option value="other">Other — please specify</option>
          </select>
        </Field>
        {values.role === 'other' && (
          <div className="sm:col-span-2">
            <Field id={id('otherRole')} label="Specify your current role" error={touched.otherRole && errors.otherRole}>
              <input {...aria('otherRole')} type="text" required maxLength={100} className="field-input" placeholder="Enter your role" />
            </Field>
          </div>
        )}
        <Field id={id('email')} label="Email address" error={touched.email && errors.email}>
          <input {...aria('email')} type="email" autoComplete="email" inputMode="email" required className="field-input" placeholder="you@example.com" />
        </Field>
        <Field id={id('phone')} label="Phone number" optional error={touched.phone && errors.phone}>
          <input {...aria('phone')} type="tel" autoComplete="tel" inputMode="tel" className="field-input" placeholder="+91" />
        </Field>
        <Field id={id('inquiry')} label="Project / inquiry type" error={touched.inquiry && errors.inquiry}>
          <select {...aria('inquiry')} required className="field-input">
            <option value="" disabled>
              Select one
            </option>
            {inquiryTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field id={id('message')} label="Your message" error={touched.message && errors.message}>
            <textarea
              {...aria('message')}
              required
              rows={5}
              maxLength={3000}
              className="field-input resize-y"
              placeholder="Tell us about your idea, timeline and anything else we should know."
            />
          </Field>
        </div>
      </div>

      {/* honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={id('company_website')}>Leave this field empty</label>
        <input id={id('company_website')} name="company_website" tabIndex={-1} autoComplete="off" value={values.company_website} onChange={update} />
      </div>

      <p id={id('how')} className="mt-9 flex items-start gap-3 text-sm leading-relaxed text-muted">
        <Mail className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
        <span>Your message is emailed straight to our team. We&rsquo;ll only use your details to reply to you.</span>
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={sending}
          aria-disabled={sending}
          className="group relative isolate inline-flex min-h-14 items-center gap-4 overflow-hidden rounded-full bg-soft pl-7 pr-2 text-[0.76rem] font-bold uppercase tracking-[0.2em] text-obsidian transition-colors duration-500 hover:text-soft focus-visible:text-soft disabled:cursor-wait disabled:opacity-80"
        >
          <span aria-hidden="true" className="absolute inset-0 -z-10 translate-y-[101%] bg-aurora transition-transform duration-500 ease-cinema group-hover:translate-y-0 group-focus-visible:translate-y-0" />
          {sending ? 'Sending…' : 'Send message'}
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-obsidian text-soft">
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
          </span>
        </button>
      </div>

      <div role="status" aria-live="polite" className="mt-6 min-h-6">
        <AnimatePresence mode="wait">
          {status.state === 'invalid' && (
            <motion.p key="invalid" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-[#ff7aa2]">
              Please fix the {status.count === 1 ? 'highlighted field' : `${status.count} highlighted fields`} and try again.
            </motion.p>
          )}
          {status.state === 'sent' && (
            <motion.p
              key="sent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-2xl border border-cyan/30 bg-cyan/[0.06] p-5 text-sm font-semibold"
            >
              <Check className="size-4 text-cyan" aria-hidden="true" /> Thank you &mdash; your message was received. We&rsquo;ll be in touch soon.
            </motion.p>
          )}
          {status.state === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-magenta/40 bg-magenta/[0.07] p-5 text-sm">
              <p className="font-semibold">Sorry &mdash; your message couldn&rsquo;t be delivered.</p>
              <p className="mt-2 text-muted">
                Please try again, or{' '}
                <a className="text-cyan underline underline-offset-4" href={mailtoHref(status.subject, status.body)}>
                  send it from your email app
                </a>{' '}
                instead.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
