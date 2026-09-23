import { config } from '@/lib/config'
import type { GoogleAds } from '@/lib/config-schema'

/**
 * Google Ads conversion tracking, in one place.
 *
 * Two rules hold everywhere in here:
 *
 * 1. NOTHING LOADS OR FIRES IN A PREVIEW BUILD. `TRACKING_MODE` is fixed at
 *    build time in next.config.mjs from the same PREVIEW flag that disables the
 *    lead form and sets noindex. A preview build does not POST the form at all,
 *    so a conversion fired there would be an invented lead in a real ad account.
 *    verify check 24 fails a preview build that carries the tag and a production
 *    build that does not.
 *
 * 2. NO value AND NO currency, EVER. Google's copy-paste snippet sends
 *    `value: 1.0, currency: 'USD'` on every action, which prices a tel tap and a
 *    completed quote request identically. Nobody knows that ratio yet, so these
 *    conversions are counted and not valued until the client supplies a close
 *    rate and an average job value (docs/DESIGN-DECISIONS.md #46).
 *
 * Enhanced conversions are deliberately NOT here: they send hashed customer data
 * to Google and need their own decision and their own privacy language.
 */
export const TRACKING_LIVE = process.env.TRACKING_MODE === 'live'

/** The tag, or null when this build must not carry one. Read this, never config.googleAds. */
export const ADS: GoogleAds | null = TRACKING_LIVE ? config.googleAds : null

export const GTAG_SRC = (tagId: string) => `https://www.googletagmanager.com/gtag/js?id=${tagId}`

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Report one conversion. `sendTo` is a full "AW-XXXXXXXXX/label" from config,
 * whose tag ID the schema has already proved matches the base tag.
 *
 * Safe to call from anywhere: it is a no-op when the build carries no tag, when
 * it runs on the server, and when gtag.js was blocked or has not loaded yet.
 * Never throws, because every caller is in the middle of something that matters
 * more than the reporting (a submitted form, a tapped phone number).
 */
export function reportConversion(sendTo: string | undefined | null): void {
  if (!ADS || !sendTo || typeof window === 'undefined') return
  try {
    window.gtag?.('event', 'conversion', { send_to: sendTo })
  } catch {
    // Reporting must never break the page.
  }
}
