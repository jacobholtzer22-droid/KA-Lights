import type { CSSProperties } from 'react'
import theme, { type Palette } from '@/theme'

/**
 * theme.ts as CSS custom properties. app/layout.tsx puts `lightVars` on <html>,
 * so the whole site is light; a section that stays dark puts `darkVars` on its
 * own element, and every token is redefined for that subtree by the cascade.
 *
 * Nothing here decides a color. Both objects read the same palette shape out of
 * theme.ts, so a token added there is added to both scopes at once, and a
 * component never needs a hex value or a dark-mode variant.
 */
const paletteVars = (p: Palette): Record<string, string> => ({
  '--c-primary': p.primary,
  '--c-primary-dark': p.primaryDark,
  '--c-primary-soft': p.primarySoft,
  '--c-accent': p.accent,
  '--c-accent-dark': p.accentDark,
  '--c-accent-ink': p.accentInk,
  '--c-bg': p.bg,
  '--c-bg-alt': p.bgAlt,
  '--c-surface': p.surface,
  '--c-surface-raised': p.surfaceRaised,
  '--c-ink': p.ink,
  '--c-ink-soft': p.inkSoft,
  '--c-muted': p.muted,
  '--c-line': p.line,
  '--c-on-primary': p.onPrimary,
  '--c-on-accent': p.onAccent,
  '--c-warm': p.warm,
})

export const lightVars = {
  ...paletteVars(theme.palette),
  '--spectrum': theme.spectrum,
  '--page-glow': theme.pageGlow,
  '--hero-scrim-flat': theme.heroScrimFlat,
  '--hero-scrim-side': theme.heroScrimSide,
  '--hero-scrim-bottom': theme.heroScrimBottom,
  '--stage-scrim': theme.stageScrim,
  '--radius': `${theme.radius}rem`,
  '--radius-card': `${theme.radiusCard}rem`,
  '--radius-panel': `${theme.radiusPanel}rem`,
  '--shadow': theme.shadow,
  '--shadow-glow': theme.shadowGlow,
} as CSSProperties

/** Put this on any section that keeps the night-photo treatment (decision 44). */
export const darkVars = {
  ...paletteVars(theme.dark),
  '--spectrum': theme.darkSpectrum,
  '--page-glow': theme.darkPageGlow,
  '--shadow': theme.darkShadow,
  '--shadow-glow': theme.darkShadowGlow,
} as CSSProperties
