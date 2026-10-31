import { config } from './config'

/**
 * Every public route on the site, derived from the same config arrays that
 * drive generateStaticParams. sitemap.ts and llms.txt read this, so the
 * sitemap cannot list a route that does not exist or miss one that does.
 * A city page exists only for a city that qualifies (decision 50).
 */
export const STATIC_ROUTES = ['/', '/how-it-works', '/gallery', '/why-kalights', '/service-areas', '/faq', '/services', '/quote', '/contact', '/privacy-policy'] as const

export function serviceRoutes(): string[] {
  return config.services.map((s) => `/services/${s.slug}`)
}

/** Cities that qualify for a page of their own. Everything else is listed on the index only. */
export function citiesWithPages() {
  return config.serviceAreas.filter((a) => a.hasCityPage)
}

export function cityRoutes(): string[] {
  return citiesWithPages().map((a) => `/service-areas/${a.slug}`)
}

export function allRoutes(): string[] {
  return [...STATIC_ROUTES, ...serviceRoutes(), ...cityRoutes()]
}
