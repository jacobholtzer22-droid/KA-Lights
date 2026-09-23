/**
 * Shared interaction and measure classes, so every button, link, and swatch on
 * the site has the same hover, focus, and active treatment. Colors come from
 * theme.ts; nothing here introduces a new value.
 *
 * components/ContactForm.tsx is sealed and keeps its own classes.
 */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

/** Solid accent button: header CTA, hero, visualizer, mobile bar. Sizing is per call site. */
export const btnPrimary = `inline-flex items-center justify-center rounded-full bg-accent font-semibold text-on-accent shadow-glow transition-[background-color,transform] hover:bg-accent-dark active:translate-y-px ${focusRing}`

/** Bordered button on a dark ground: phone CTA, gallery link. */
export const btnOutline = `inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface font-semibold text-ink transition-[background-color,border-color,transform] hover:border-muted hover:bg-surface-raised active:translate-y-px ${focusRing}`

/** Square-cornered variant for the mobile bar, where the bar itself is the shape. */
export const btnPrimarySquare = btnPrimary.replace('rounded-full', 'rounded-site')
export const btnOutlineSquare = btnOutline.replace('rounded-full', 'rounded-site')

/** Body and nav links. */
export const linkQuiet = `rounded-site text-ink-soft transition-colors hover:text-ink ${focusRing}`
export const linkAccent = `rounded-site text-accent-ink transition-colors hover:text-ink ${focusRing}`

/** Anything focusable that is not a button or a text link: swatches, summaries, cards. */
export const focusable = `rounded-site ${focusRing}`
