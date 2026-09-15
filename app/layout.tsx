import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileCallBar from '@/components/MobileCallBar'
import indexing from '@/indexing.json'
import { config } from '@/lib/config'
import { buildTitle, renderTitle, TITLE_TEMPLATE } from '@/lib/seo'
import theme from '@/theme'
import { bodyFont, headingFont } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(config.domain),
  title: {
    default: renderTitle(buildTitle({ kind: 'home' })),
    template: TITLE_TEMPLATE,
  },
  applicationName: config.displayName,
  // Preview state lives in indexing.json, together with the vercel.json X-Robots-Tag header.
  // The launch gate blocks production builds while noindex is true.
  robots: indexing.noindex ? { index: false, follow: false } : { index: true, follow: true },
}

const cssVars = {
  '--c-primary': theme.palette.primary,
  '--c-primary-dark': theme.palette.primaryDark,
  '--c-primary-soft': theme.palette.primarySoft,
  '--c-accent': theme.palette.accent,
  '--c-accent-dark': theme.palette.accentDark,
  '--c-bg': theme.palette.bg,
  '--c-surface': theme.palette.surface,
  '--c-surface-raised': theme.palette.surfaceRaised,
  '--c-ink': theme.palette.ink,
  '--c-ink-soft': theme.palette.inkSoft,
  '--c-muted': theme.palette.muted,
  '--c-line': theme.palette.line,
  '--c-on-primary': theme.palette.onPrimary,
  '--c-on-accent': theme.palette.onAccent,
  '--c-warm': theme.palette.warm,
  '--spectrum': theme.spectrum,
  '--radius': `${theme.radius}rem`,
  '--radius-card': `${theme.radiusCard}rem`,
  '--radius-panel': `${theme.radiusPanel}rem`,
  '--shadow': theme.shadow,
  '--shadow-glow': theme.shadowGlow,
} as CSSProperties

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`} style={cssVars}>
      <body className="flex min-h-screen flex-col pb-[4.5rem] lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-site focus:bg-surface focus:px-3 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileCallBar />
      </body>
    </html>
  )
}
