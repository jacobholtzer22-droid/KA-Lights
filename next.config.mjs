import { PHASE_PRODUCTION_BUILD } from 'next/constants.js'
import { enforceLaunchGate } from './scripts/launch-gate.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static. `next build` writes the finished site to ./out and
  // scripts/verify.ts inspects those HTML files directly.
  output: 'export',
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are pre-processed by scripts/process-images.ts into WebP with
  // explicit srcsets, so the Next image optimizer is not used.
  images: { unoptimized: true },
  transpilePackages: ['next-mdx-remote'],
  // No headers() here: with output 'export' Next does not apply them to the
  // deployed files. The preview noindex header lives in vercel.json.
}

export default function config(phase) {
  const production = phase === PHASE_PRODUCTION_BUILD
  // Every production build passes the launch gate first (scripts/launch-gate.mjs).
  if (production) enforceLaunchGate()
  // One flag, two consumers, so they can never disagree: a build either writes
  // real leads and reports real conversions, or it does neither. It is the same
  // PREVIEW flag the launch gate and the noindex state use.
  //
  // - LEAD_FORM_MODE gates the POST itself (components/LeadForm.tsx, check 20).
  // - TRACKING_MODE gates the Google Ads tag and both conversion events
  //   (lib/tracking.ts, check 24). A preview build does not POST at all, so any
  //   conversion fired there would be a fabricated lead in the client's account.
  const live = production && process.env.PREVIEW !== '1'
  return { ...nextConfig, env: { LEAD_FORM_MODE: live ? 'live' : 'preview-disabled', TRACKING_MODE: live ? 'live' : 'disabled' } }
}
