/** Primary navigation, matching the current site. */
export const NAV = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/why-kalights', label: 'Why Kalights' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/faq', label: 'FAQ' },
] as const

/** Footer quick links: the primary pages plus the template's service and contact pages. */
export const FOOTER_LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/why-kalights', label: 'Why Kalights' },
  { href: '/faq', label: 'FAQ' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
] as const

/** Every quote button on the site. */
export const QUOTE_CTA = { href: '/#quote', label: 'Get a Quote' } as const
