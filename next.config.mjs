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
  // Lead form mode, fixed at build time from the same PREVIEW flag the gate uses.
  // Only a production build without PREVIEW=1 may write leads; preview builds and
  // `next dev` never POST (components/LeadForm.tsx, verify check 20).
  const leadFormMode = production && process.env.PREVIEW !== '1' ? 'live' : 'preview-disabled'
  return { ...nextConfig, env: { LEAD_FORM_MODE: leadFormMode } }
}
