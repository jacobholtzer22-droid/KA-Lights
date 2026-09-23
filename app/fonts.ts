import { Fraunces, Hanken_Grotesk } from 'next/font/google'

/**
 * PREVIEW TYPOGRAPHY, NOT REPRESENTATIVE.
 *
 * The client's heading face is Clash Display, which is not committed yet: Will
 * must download the official package himself (launch blocker B5.3), and it will
 * load through next/font/local from unmodified files. Until then headings use
 * the template's heading face, Fraunces, which looks nothing like Clash Display.
 *
 * Body text uses Hanken Grotesk, the client's body face.
 */
export const headingFont = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const bodyFont = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
