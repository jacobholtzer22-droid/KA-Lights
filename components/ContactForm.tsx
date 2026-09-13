'use client'

/**
 * SEALED COMPONENT. CHECKSUM-VERIFIED. DO NOT MODIFY PER CLIENT.
 *
 * scripts/verify.ts hashes this file and compares it to
 * scripts/contact-form.sha256. Any edit fails the build gate. If the platform
 * contract genuinely changes, update the form, run `npm run seal-contact-form`
 * to re-baseline, and commit both files together in the template repo.
 *
 * What is fixed here and why:
 * - The endpoint is the frozen CONTACT_ENDPOINT constant, never an env var and
 *   never a literal typed here. The www host is load-bearing (308 on the apex).
 * - The payload shape { name, phone, email, message, smsConsent, businessSlug }
 *   plus the honeypot is what the platform parses. businessSlug comes from
 *   config, so a wrong slug is caught by verify, not discovered as lost leads.
 * - smsConsent is bound to a real checkbox. It is never hardcoded true.
 * - The honeypot uses a nonsense field name inside a `hidden` wrapper. Chrome
 *   autofills off-screen inputs and anything named "company", which silently
 *   killed real leads before, so neither technique is used.
 * - Success messaging is a generic thank-you regardless of status. The endpoint
 *   returns 200 even when a downstream write fails, so no claim beyond
 *   "we received it" is honest.
 */

import { useState, type FormEvent } from 'react'
import { config, CONTACT_ENDPOINT, HONEYPOT_FIELD } from '@/lib/config'

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [smsConsent, setSmsConsent] = useState(false)
  const [validation, setValidation] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidation('')
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const honeypot = String(data.get(HONEYPOT_FIELD) ?? '')

    if (!name) {
      setValidation('Please enter your name.')
      return
    }
    if (!phone) {
      setValidation('Please enter a phone number so we can reach you.')
      return
    }

    setStatus('sending')
    try {
      await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          message,
          smsConsent,
          businessSlug: config.businessSlug,
          [HONEYPOT_FIELD]: honeypot,
        }),
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-[var(--radius)] border border-line bg-surface p-8 text-center" role="status">
        <h2 className="font-heading text-2xl font-bold text-primary-dark">Thanks, we received your message.</h2>
        <p className="mt-2 text-muted">
          Someone from {config.displayName} will follow up. If it is urgent, call{' '}
          <a href={`tel:${config.phone}`} className="font-semibold text-primary">
            {config.phoneDisplay}
          </a>
          .
        </p>
      </div>
    )
  }

  const field =
    'mt-1 w-full rounded-[var(--radius)] border border-line bg-surface px-3 py-2 text-base text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft'

  return (
    <form
      onSubmit={handleSubmit}
      data-endpoint={CONTACT_ENDPOINT}
      noValidate
      className="rounded-[var(--radius)] border border-line bg-surface p-6 sm:p-8"
    >
      <div hidden>
        <label htmlFor={`${HONEYPOT_FIELD}-input`}>Leave this field empty</label>
        <input id={`${HONEYPOT_FIELD}-input`} type="text" name={HONEYPOT_FIELD} autoComplete="off" tabIndex={-1} aria-hidden="true" defaultValue="" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-semibold text-ink">
            Name
          </label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="contact-phone" className="text-sm font-semibold text-ink">
            Phone
          </label>
          <input id="contact-phone" name="phone" type="tel" required autoComplete="tel" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-email" className="text-sm font-semibold text-ink">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="contact-email" name="email" type="email" autoComplete="email" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="text-sm font-semibold text-ink">
            What do you need done?
          </label>
          <textarea id="contact-message" name="message" rows={4} className={field} />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          name="smsConsent"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span>
          Yes, {config.displayName} may text me about my request. Message and data rates may apply. Reply STOP to opt out at any time.
        </span>
      </label>

      {validation && (
        <p className="mt-4 text-sm font-semibold text-accent-dark" role="alert">
          {validation}
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-sm font-semibold text-accent-dark" role="alert">
          We could not send your message. Please call{' '}
          <a href={`tel:${config.phone}`} className="underline">
            {config.phoneDisplay}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 w-full rounded-[var(--radius)] bg-accent px-6 py-3 text-base font-semibold text-on-accent hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? 'Sending' : 'Send Message'}
      </button>
    </form>
  )
}
