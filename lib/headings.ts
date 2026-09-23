import { config } from './config'
import type { Service, ServiceArea } from './config-schema'

/**
 * One H1 per page, containing the service and, where natural, the city. Brand
 * and display lines stay visible as styled non-heading text (see
 * docs/DESIGN-DECISIONS.md, Part 2 semantic heading changes).
 */
const where = () => `${config.primaryCity}, ${config.primaryState}`
const service = () => config.primaryService.name

/**
 * SEO: each page carries one primary search phrase, blended with the client's own
 * term ("permanent architectural lighting") where it reads naturally. Home: permanent
 * Christmas lights. Service page: permanent holiday lighting. Services index:
 * permanent outdoor lighting. Recorded in docs/DESIGN-DECISIONS.md decision 38.
 */
export const pageH1 = {
  home: () => `Permanent Christmas & Architectural Lighting in ${where()}`,
  services: () => `Permanent Outdoor Lighting Services in ${where()}`,
  service: (s: Service) => `Permanent Holiday & ${s.name.replace(/^Permanent /, '')} Installation in ${where()}`,
  how: () => `How Permanent Lighting Installation Works in ${where()}`,
  gallery: () => `${service()} Design Ideas in ${where()}`,
  why: () => `Why ${config.displayName} for ${service()} in ${where()}`,
  serviceAreas: () => `Permanent Lighting Service Areas in the Inland Empire`,
  faq: () => `Permanent Lighting Questions in ${where()}`,
  contact: () => `Contact ${config.displayName} for ${service()} in ${where()}`,
  quote: () => `Request a Permanent Lighting Quote in ${where()}`,
  city: (area: ServiceArea) => `${service()} in ${area.name}, ${config.primaryState}`,
}

/** The first paragraph under every H1: who, what service, where. */
export function pageIntro(): string {
  return `${config.displayName} installs ${service().toLowerCase()} in ${where()} and across the Inland Empire.`
}

/** Same sentence for a city page, naming that city. */
export function cityIntro(area: ServiceArea): string {
  return `${config.displayName} installs ${service().toLowerCase()} in ${area.name}, ${config.primaryState} and across the Inland Empire.`
}
