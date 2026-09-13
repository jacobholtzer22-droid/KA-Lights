/**
 * Visual theme. This is the one file (with app/fonts.ts) where the agent has
 * real freedom: pick a direction, a palette, and a hero layout so two client
 * sites do not look like the same site with different words. No business facts
 * belong here.
 *
 * Rules the palette must satisfy (AGENT.md Phase 2c): one dark neutral, one
 * warm or cool off-white, exactly one accent used on under 5% of any page. No
 * pure #000000 or #FFFFFF. `onPrimary` sits on `primary`, `onAccent` on
 * `accent`, `ink` on `bg` and `surface`. One radius and one shadow for the
 * whole site; components read them as CSS variables and nothing else.
 */
export type HeroVariant = 'full-bleed' | 'split'

export interface Theme {
  palette: {
    /** The dark neutral. Also the full-dark section background. */
    primary: string
    primaryDark: string
    primarySoft: string
    /** The single accent. Buttons, the call bar, small marks. Under 5% of any page. */
    accent: string
    accentDark: string
    /** The off-white page ground. */
    bg: string
    surface: string
    /** Body text. Never pure black. */
    ink: string
    muted: string
    line: string
    onPrimary: string
    onAccent: string
  }
  /**
   * 'full-bleed': client photo behind a dark scrim, headline and phone CTA
   * left-aligned in the lower third. Needs a photo that can carry it.
   * 'split': large photo one side, oversized type the other. For weaker photos.
   */
  heroVariant: HeroVariant
  /** The ONE corner radius for the site, in rem. 0 for hard edges. */
  radius: number
  /** The ONE shadow for the site, as a CSS box-shadow value. 'none' is valid. */
  shadow: string
}

// Shipped default follows the "Cultivated" direction for the lawn-care sample:
// deep green, warm off-white, one muted cedar accent, serif display (app/fonts.ts).
const theme: Theme = {
  palette: {
    primary: '#1E3D2C',
    primaryDark: '#152B1F',
    primarySoft: '#E9EFE8',
    accent: '#A8623A',
    accentDark: '#8B4E2C',
    bg: '#F6F3EC',
    surface: '#FDFBF7',
    ink: '#1A1F1B',
    muted: '#5C6660',
    line: '#DCD8CE',
    onPrimary: '#F6F3EC',
    onAccent: '#F6F3EC',
  },
  heroVariant: 'full-bleed',
  radius: 0.375,
  shadow: '0 1px 2px rgb(20 30 24 / 0.08)',
}

export default theme
