/**
 * Primary navigation. No "Quote" text link: the Get a Quote button in the header covers it.
 *
 * Home is first and explicit. The wordmark also links to /, but a wordmark is a
 * convention rather than a label, and it is the one thing a visitor who does not
 * know the convention cannot find (decision 49).
 */
export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/gallery', label: 'Design Ideas' },
  { href: '/why-kalights', label: 'Why Kalights' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/faq', label: 'FAQ' },
] as const

/** Footer quick links: the primary pages plus the template's service and contact pages. */
export const FOOTER_LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/gallery', label: 'Design Ideas' },
  { href: '/why-kalights', label: 'Why Kalights' },
  { href: '/faq', label: 'FAQ' },
  { href: '/services', label: 'Services' },
  { href: '/quote', label: 'Request a Permanent Lighting Quote' },
  { href: '/contact', label: 'Contact' },
] as const

/** Every quote button on the site. */
export const QUOTE_CTA = { href: '/quote', label: 'Get a Quote' } as const
