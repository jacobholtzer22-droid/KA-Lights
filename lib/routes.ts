import { config } from './config'

/**
 * Every public route on the site, derived from the same config arrays that
 * drive generateStaticParams. sitemap.ts and llms.txt read this, so the
 * sitemap cannot list a route that does not exist or miss one that does.
 * There are no per-city pages: service areas live on /service-areas.
 */
export const STATIC_ROUTES = ['/', '/how-it-works', '/gallery', '/why-kalights', '/service-areas', '/faq', '/services', '/contact', '/privacy-policy'] as const

export function serviceRoutes(): string[] {
  return config.services.map((s) => `/services/${s.slug}`)
}

export function allRoutes(): string[] {
  return [...STATIC_ROUTES, ...serviceRoutes()]
}
