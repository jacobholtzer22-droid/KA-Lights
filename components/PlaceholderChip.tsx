/**
 * Marks a placeholder frame in the page itself, so the label stays legible at
 * every breakpoint even where page copy sits over the image or the crop hides
 * the label inside the graphic. Decorative: the image alt already says the same.
 */
export default function PlaceholderChip({ position = 'bottom-right' }: { position?: 'bottom-right' | 'top-right' | 'below-header' }) {
  const place = position === 'below-header' ? 'right-4 top-20' : position === 'top-right' ? 'right-4 top-4' : 'bottom-4 right-4'
  return (
    <p
      aria-hidden="true"
      className={`pointer-events-none absolute ${place} z-10 rounded-full border border-line bg-bg px-3 py-1 text-step--1 font-semibold uppercase tracking-[0.16em] text-accent-ink`}
    >
      Photo pending
    </p>
  )
}
