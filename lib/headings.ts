import { config } from './config'
import type { Service } from './config-schema'

/**
 * One H1 per page, containing the service and, where natural, the city. Brand
 * and display lines stay visible as styled non-heading text (see
 * docs/DESIGN-DECISIONS.md, Part 2 semantic heading changes).
 */
const where = () => `${config.primaryCity}, ${config.primaryState}`
const service = () => config.primaryService.name

export const pageH1 = {
  home: () => `${service()} in ${where()}`,
  services: () => `${service()} Services in ${where()}`,
  service: (s: Service) => `${s.name} Installation in ${where()}`,
  how: () => `How ${service()} Is Installed in ${where()}`,
  gallery: () => `${service()} Gallery in ${where()}`,
  why: () => `Why ${config.displayName} for ${service()} in ${where()}`,
  serviceAreas: () => `${service()} Service Areas in the Inland Empire`,
  faq: () => `${service()} Questions in ${where()}`,
  contact: () => `Contact ${config.displayName} for ${service()} in ${where()}`,
}

/** The first paragraph under every H1: who, what service, where. */
export function pageIntro(): string {
  return `${config.displayName} installs ${service().toLowerCase()} in ${where()} and across the Inland Empire.`
}
