/**
 * Visual theme. With app/fonts.ts, the only place design decisions live. No
 * business facts belong here.
 *
 * Kalights is a dark-ground site. Colors are the client's brand colors taken
 * exactly from the current site (audit/REFERENCE-SITE.md), not re-chosen.
 *
 * Token note for dark grounds: components/ContactForm.tsx is sealed and uses
 * text-primary-dark for its success heading, text-primary for phone links,
 * and focus:border-primary. On this site `primary` is therefore the cyan
 * emphasis color and `primaryDark` is the strongest text color, so the sealed
 * form stays legible without being edited. Dark surfaces use `bg` and `surface`.
 */
export type HeroVariant = 'full-bleed' | 'split'

export interface Theme {
  palette: {
    /** Emphasis color: links, focus borders. */
    primary: string
    /** Strongest text color. */
    primaryDark: string
    /** Focus ring tint. */
    primarySoft: string
    accent: string
    accentDark: string
    /** Page ground. */
    bg: string
    /** Cards, panels, form card. */
    surface: string
    /** Raised items on a surface. */
    surfaceRaised: string
    /** Headings and primary text. */
    ink: string
    /** Body text. */
    inkSoft: string
    /** Labels, secondary text. */
    muted: string
    line: string
    onPrimary: string
    onAccent: string
    /** Warm highlight. */
    warm: string
  }
  /** Brand gradient used for highlighted words and divider strips. */
  spectrum: string
  heroVariant: HeroVariant
  /** Inputs, form card, and compact buttons, in rem. Read by the sealed form as var(--radius). */
  radius: number
  /** Cards and images, in rem. */
  radiusCard: number
  /** Large panels, in rem. */
  radiusPanel: number
  shadow: string
  /** Cyan glow used on primary calls to action. */
  shadowGlow: string
}

const theme: Theme = {
  palette: {
    primary: '#2DD4FF',
    primaryDark: '#F4F6FB',
    primarySoft: '#0F3340',
    accent: '#2DD4FF',
    accentDark: '#12A9DA',
    bg: '#0A0B0F',
    surface: '#14171F',
    surfaceRaised: '#1C212C',
    ink: '#F4F6FB',
    inkSoft: '#C6CDDA',
    muted: '#8A93A6',
    line: 'rgba(255, 255, 255, 0.08)',
    onPrimary: '#04121A',
    onAccent: '#04121A',
    warm: '#FFC97A',
  },
  spectrum: 'linear-gradient(90deg, #2DD4FF 0%, #6366F1 34%, #D946EF 64%, #FB923C 100%)',
  heroVariant: 'full-bleed',
  radius: 0.75,
  radiusCard: 1,
  radiusPanel: 1.5,
  shadow: '0 10px 30px -10px rgb(0 0 0 / 0.5)',
  shadowGlow: '0 10px 30px -12px #2DD4FF',
}

export default theme
