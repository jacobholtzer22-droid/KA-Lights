import type { Config } from 'tailwindcss'

// Colors, radii, and shadows resolve to CSS variables that app/layout.tsx sets
// from theme.ts. Alpha modifiers (bg-surface/50) do not work with CSS-variable
// colors; use explicit tokens instead.
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.{mdx,json}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--c-primary)',
        'primary-dark': 'var(--c-primary-dark)',
        'primary-soft': 'var(--c-primary-soft)',
        accent: 'var(--c-accent)',
        'accent-dark': 'var(--c-accent-dark)',
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        'surface-raised': 'var(--c-surface-raised)',
        ink: 'var(--c-ink)',
        'ink-soft': 'var(--c-ink-soft)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        'on-primary': 'var(--c-on-primary)',
        'on-accent': 'var(--c-on-accent)',
        warm: 'var(--c-warm)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        site: 'var(--radius)',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
      },
      boxShadow: {
        site: 'var(--shadow)',
        glow: 'var(--shadow-glow)',
      },
      backgroundImage: {
        spectrum: 'var(--spectrum)',
      },
      // One modular scale, ratio 1.25 (major third) on a 16px base. See docs/DESIGN-DECISIONS.md.
      fontSize: {
        'step--1': ['0.8rem', { lineHeight: '1.5' }],
        'step-0': ['1rem', { lineHeight: '1.6' }],
        'step-1': ['1.25rem', { lineHeight: '1.55' }],
        'step-2': ['1.5625rem', { lineHeight: '1.3' }],
        'step-3': ['1.953rem', { lineHeight: '1.15' }],
        'step-4': ['2.441rem', { lineHeight: '1.05' }],
        'step-5': ['3.052rem', { lineHeight: '1.02' }],
        'step-6': ['3.815rem', { lineHeight: '1' }],
        // Fluid steps that land exactly on scale values at 375px and 1440px.
        display: ['clamp(3.052rem, 1.6rem + 5.2vw, 5.96rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        page: ['clamp(2.441rem, 1.5rem + 3vw, 3.815rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        section: ['clamp(2.441rem, 1.9rem + 1.6vw, 3.052rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
      },
      maxWidth: { page: '87.5rem' },
    },
  },
  plugins: [],
}

export default config
