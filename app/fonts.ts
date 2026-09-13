import { Fraunces, Manrope } from 'next/font/google'

/**
 * The two typefaces for this site, loaded through next/font so they are
 * self-hosted and subset at build time. This is the ONE file to edit to change
 * fonts: swap the imports and the two exports, keep the `variable` names, and
 * list only weights the family actually ships.
 *
 * The display face must have character. Never Inter, system-ui, or Arial for
 * headings. See AGENT.md Phase 2 for the pairings per direction.
 */
export const headingFont = Fraunces({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const bodyFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})
