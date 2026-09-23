/**
 * Visual theme. With app/fonts.ts, the only place design decisions live. No
 * business facts belong here.
 *
 * Kalights is a LIGHT site with dark bands (decision 44). `palette` is the light
 * ground used everywhere; `dark` overrides the same tokens inside a `.theme-dark`
 * section: the hero, the visualizer, and the Design Ideas grids, all of which sit
 * under night photography. Colors are the client's brand colors from the current
 * site (audit/REFERENCE-SITE.md); the light values are the same hues darkened
 * only as far as contrast requires.
 *
 * Token notes:
 * - components/ContactForm.tsx is sealed: it uses text-primary-dark for its
 *   success heading, text-primary for phone links, focus:border-primary,
 *   bg-accent / hover:bg-accent-dark with text-on-accent for its button, and
 *   text-accent-dark for error text. So `primary` is the emphasis color that
 *   must read as text, `primaryDark` is the strongest text color, and
 *   `accentDark` has to stay a fill that dark text sits on (the button hover).
 *   That leaves the sealed form's error text below AA on light; flagged in
 *   docs/CLIENT-TODO.md rather than edited here.
 * - `accent` is the bright brand cyan and is only ever a fill or a border.
 *   `accentInk` is the accent color for TEXT, dark enough for AA on light and
 *   the same bright cyan inside a dark band.
 */
export type HeroVariant = 'full-bleed' | 'split'

export interface Palette {
  /** Emphasis color: links, focus borders. Must read as text on `surface`. */
  primary: string
  /** Strongest text color. */
  primaryDark: string
  /** Focus ring tint. */
  primarySoft: string
  /** Brand cyan. Fills and borders only, never text. */
  accent: string
  /** Hover fill for accent buttons. Dark text sits on it. */
  accentDark: string
  /** Accent color for text and icons. */
  accentInk: string
  /** Page ground. */
  bg: string
  /** Alternate section ground, one step from bg, for section rhythm. */
  bgAlt: string
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

export interface Theme {
  palette: Palette
  /** Overrides applied inside `.theme-dark` sections. */
  dark: Palette
  /** Brand gradient for highlighted words and divider strips. */
  spectrum: string
  darkSpectrum: string
  /** Soft tint behind interior page headers. */
  pageGlow: string
  darkPageGlow: string
  /** Hero and visualizer overlays. Both live inside dark bands, so they do not change. */
  heroScrimFlat: string
  heroScrimSide: string
  heroScrimBottom: string
  stageScrim: string
  heroVariant: HeroVariant
  /** Inputs, form card, and compact buttons, in rem. Read by the sealed form as var(--radius). */
  radius: number
  /** Cards and images, in rem. */
  radiusCard: number
  /** Large panels, in rem. */
  radiusPanel: number
  shadow: string
  darkShadow: string
  /** Lift under primary calls to action. A neutral shadow on light, the cyan glow inside dark bands. */
  shadowGlow: string
  darkShadowGlow: string
}

const theme: Theme = {
  palette: {
    primary: '#0B6E86',
    primaryDark: '#0D1117',
    primarySoft: '#A7DEEE',
    accent: '#2DD4FF',
    accentDark: '#12A9DA',
    accentInk: '#0B6E86',
    bg: '#F6F8FB',
    bgAlt: '#EAEFF6',
    surface: '#FCFDFF',
    surfaceRaised: '#E4EAF3',
    ink: '#0D1117',
    inkSoft: '#33414F',
    muted: '#566677',
    line: 'rgba(13, 17, 23, 0.45)',
    onPrimary: '#F8FBFF',
    onAccent: '#04121A',
    warm: '#8A5100',
  },
  dark: {
    primary: '#2DD4FF',
    primaryDark: '#F4F6FB',
    primarySoft: '#0F3340',
    accent: '#2DD4FF',
    accentDark: '#12A9DA',
    accentInk: '#2DD4FF',
    bg: '#0A0B0F',
    bgAlt: '#0F1117',
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
  spectrum: 'linear-gradient(90deg, #0E7490 0%, #4F46E5 34%, #A21CAF 64%, #C2410C 100%)',
  darkSpectrum: 'linear-gradient(90deg, #2DD4FF 0%, #6366F1 34%, #D946EF 64%, #FB923C 100%)',
  pageGlow: 'radial-gradient(ellipse at top, rgba(11, 110, 134, 0.10), transparent 60%)',
  darkPageGlow: 'radial-gradient(ellipse at top, rgba(45, 212, 255, 0.08), transparent 60%)',
  heroScrimFlat: 'rgba(10, 11, 15, 0.45)',
  heroScrimSide: 'linear-gradient(90deg, #0A0B0F 0%, rgba(10, 11, 15, 0.8) 45%, rgba(10, 11, 15, 0) 100%)',
  heroScrimBottom: 'linear-gradient(0deg, #0A0B0F 0%, rgba(10, 11, 15, 0) 40%)',
  stageScrim:
    'linear-gradient(90deg, rgba(8, 9, 14, 0.9) 0%, rgba(8, 9, 14, 0.5) 34%, rgba(8, 9, 14, 0) 62%), linear-gradient(0deg, rgba(8, 9, 14, 0.75) 0%, rgba(8, 9, 14, 0) 42%)',
  heroVariant: 'full-bleed',
  radius: 0.75,
  radiusCard: 1,
  radiusPanel: 1.5,
  shadow: '0 10px 30px -12px rgb(13 17 23 / 0.18)',
  darkShadow: '0 10px 30px -10px rgb(0 0 0 / 0.5)',
  shadowGlow: '0 10px 24px -12px rgb(13 17 23 / 0.28)',
  darkShadowGlow: '0 10px 30px -12px #2DD4FF',
}

export default theme
