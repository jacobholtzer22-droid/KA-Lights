'use client'

import { useCallback, useRef, useState } from 'react'
import { CONTACT_ENDPOINT } from '@/lib/config'
import { ADS, reportConversion } from '@/lib/tracking'
import ContactForm from './ContactForm'

/**
 * Wraps the sealed ContactForm (which is never edited) and decides whether it
 * may write leads.
 *
 * LEAD_FORM_MODE is fixed at build time by next.config.mjs: "live" only for a
 * production build without PREVIEW=1. Every preview build and `next dev` gets
 * "preview-disabled", and anything unexpected falls back to disabled.
 *
 * Preview-disabled:
 * 1. A native capture-phase submit listener on this wrapper runs before the
 *    event reaches the form, stops it, and runs the same checks the sealed
 *    form runs (name, then phone). The sealed handler never runs, so it never
 *    POSTs.
 * 2. Defense in depth: fetch is refused for the contact endpoint on any host
 *    under alignandacquire.com, so no code path can send a lead.
 * 3. A notice says submissions are disabled until launch.
 *
 * scripts/verify.ts check 20 fails a production build whose built HTML still
 * carries data-lead-form-mode="preview-disabled", and fails a PREVIEW build
 * whose form is live.
 */
const MODE: 'live' | 'preview-disabled' = process.env.LEAD_FORM_MODE === 'live' ? 'live' : 'preview-disabled'

function isContactEndpoint(input: RequestInfo | URL): boolean {
  try {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const url = new URL(raw, window.location.href)
    const expected = new URL(CONTACT_ENDPOINT)
    return /(^|\.)alignandacquire\.com$/.test(url.hostname) && url.pathname.replace(/\/$/, '') === expected.pathname
  } catch {
    return false
  }
}

if (MODE !== 'live' && typeof window !== 'undefined') {
  const guarded = window as Window & { __leadFetchGuard?: true }
  if (!guarded.__leadFetchGuard) {
    guarded.__leadFetchGuard = true
    const original = window.fetch.bind(window)
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
      isContactEndpoint(input) ? Promise.reject(new Error('Lead submission is disabled in preview builds.')) : original(input, init)
  }
}

/**
 * Quote Form Submit conversion, live builds only.
 *
 * THE SUCCESS MESSAGE IS NOT EVIDENCE OF A LEAD. The sealed ContactForm never
 * reads the response status: it renders "Thanks, we received your message." on a
 * 500 exactly as it does on a 200 (logged as B3 / T-1). Hanging the conversion
 * off that message, or off the submit event, would report failed submissions to
 * Google as leads and quietly poison the account's optimization data.
 *
 * So the conversion keys on the only honest signal available without opening the
 * sealed file: the HTTP response itself. The same interception the preview guard
 * uses is extended here to inspect the contact endpoint's response and report
 * ONLY on a 2xx. Everything else reports nothing: 4xx, 5xx, a network failure, a
 * CORS rejection, and an opaque (no-cors) response, whose status is 0 and whose
 * `ok` is false.
 *
 * The response object is returned untouched, and a rejection still rejects, so
 * the sealed form behaves exactly as it does with no tracking present.
 */
if (MODE === 'live' && ADS && typeof window !== 'undefined') {
  const ads = ADS
  const guarded = window as Window & { __leadConversionGuard?: true }
  if (!guarded.__leadConversionGuard) {
    guarded.__leadConversionGuard = true
    const original = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await original(input, init)
      if (response.ok && isContactEndpoint(input)) reportConversion(ads.quoteFormSubmitLabel)
      return response
    }
  }
}

type Message = { kind: 'error' | 'notice'; text: string }

function PreviewLeadForm() {
  const [message, setMessage] = useState<Message | null>(null)
  const node = useRef<HTMLDivElement | null>(null)

  const onSubmit = useCallback((event: Event) => {
    const form = event.target
    if (!(form instanceof HTMLFormElement)) return
    event.preventDefault()
    event.stopPropagation()
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    if (!name) return setMessage({ kind: 'error', text: 'Please enter your name.' })
    if (!phone) return setMessage({ kind: 'error', text: 'Please enter a phone number so we can reach you.' })
    setMessage({ kind: 'notice', text: 'Preview build: submissions are disabled until launch. Your entries passed the checks, and nothing was sent.' })
  }, [])

  // Callback ref: the listener is attached in the same commit that hydrates the form.
  const attach = useCallback(
    (el: HTMLDivElement | null) => {
      node.current?.removeEventListener('submit', onSubmit, true)
      node.current = el
      el?.addEventListener('submit', onSubmit, true)
    },
    [onSubmit],
  )

  return (
    <div ref={attach} data-lead-form-mode="preview-disabled">
      <p className="mb-4 max-w-measure rounded-site border border-warm px-4 py-3 text-step--1 text-ink">
        Preview build: this form checks your entries but does not send them. Submissions open at launch.
      </p>
      <ContactForm />
      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={`mt-4 text-step--1 font-semibold ${message.kind === 'error' ? 'text-accent-dark' : 'text-warm'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}

export default function LeadForm() {
  if (MODE === 'live') {
    return (
      <div data-lead-form-mode="live">
        <ContactForm />
      </div>
    )
  }
  return <PreviewLeadForm />
}
