/** Inline SVG icons. Decorative: every icon is aria-hidden and never an <img>. */
type IconProps = { className?: string }

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

export function PhoneIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export function MapPinIcon({ className = 'h-8 w-8' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function FeatureIcon({ name, className = 'h-6 w-6' }: IconProps & { name: 'ladder' | 'palette' | 'eye' | 'season' }) {
  switch (name) {
    case 'ladder':
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M7 2v20M17 2v20M7 6h10M7 10h10M7 14h10M7 18h10" />
        </svg>
      )
    case 'palette':
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-3.5 3H16a2 2 0 0 0-1.5 3.3A2.2 2.2 0 0 1 12 22z" />
          <circle cx="7.5" cy="10.5" r="1" />
          <circle cx="12" cy="7" r="1" />
          <circle cx="16.5" cy="10.5" r="1" />
        </svg>
      )
    case 'eye':
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'season':
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )
  }
}
