import { config } from './config'
import type { LocalDetail, ServiceArea } from './config-schema'

/** The service name, same source the headings use. */
const service = () => config.primaryService.name


/**
 * The copy on a city page, built from that city's own verified facts.
 *
 * Every sentence in here is either a fact from `localDetail` (county,
 * neighborhoods, ZIPs, distance, each with a source URL in site.config.ts) or a
 * line that already exists in the client's own copy. Nothing claims the client
 * has worked in the city, how many jobs he has done, what the housing stock is
 * like, or how fast anyone can get there. When he supplies a real project per
 * city, `cityPage.note` renders above all of this and the page stops being thin
 * (the client checklist in docs/, B7).
 *
 * "Corona" appears only as a distance reference. It is the chosen primary SEO
 * geo, not a confirmed place of business (decision 47), so no sentence here
 * calls it a base, a shop, or a home city.
 */

const listWithAnd = (items: readonly string[]): string =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`

/** "about 8 miles from Corona via I-15, roughly 12 minutes in light traffic" */
export function distancePhrase(detail: LocalDetail): string | null {
  const d = detail.driveFromPrimary
  if (!d) return null
  const base = `about ${d.miles} miles from ${config.primaryCity} via ${d.via}`
  return d.minutes ? `${base}, roughly ${d.minutes} minutes in light traffic` : base
}

/** The body paragraphs, in order. Each one is a real sentence, not a list with a label. */
export function cityParagraphs(area: ServiceArea, detail: LocalDetail): string[] {
  const lower = service().toLowerCase()
  const paras: string[] = []

  paras.push(
    // The generic "how the track works" sentence used to sit here. It was identical on all
    // seven pages and it already has a home on the service page, so it was cut: seven copies
    // of the same paragraph is the thing that makes city pages worthless.
    `${config.displayName} installs ${lower} across ${area.name}, in ${detail.county} County, ` +
      `including ${listWithAnd(detail.neighborhoods)}.`,
  )

  const zips =
    detail.zips.length === 1
      ? `${area.name} is served by ZIP code ${detail.zips[0]}`
      : `${area.name} addresses fall under ZIP codes ${listWithAnd(detail.zips)}`
  paras.push(`${zips}. Don't see your ZIP? Contact us to see if we service your area.`)

  const distance = distancePhrase(detail)
  if (distance) {
    paras.push(
      `${area.name} is ${distance}, and it is one of the ${config.serviceAreas.length} Inland Empire cities on our service area list.`,
    )
  }

  return paras
}

/**
 * Two or three questions per city. The first two are answerable only for this
 * city; the third names the actual neighbouring cities we serve. No shared
 * boilerplate answer is repeated across the seven pages.
 */
export function cityFaqs(area: ServiceArea, detail: LocalDetail): { q: string; a: string }[] {
  const lower = service().toLowerCase()
  const distance = distancePhrase(detail)
  const nearbyNames = detail.nearby
    .map((slug) => config.serviceAreas.find((a) => a.slug === slug)?.name)
    .filter((n): n is string => Boolean(n))

  const faqs = [
    {
      q: `Do you install permanent lights in ${area.name}?`,
      a:
        `Yes. ${area.name} is one of the ${config.serviceAreas.length} Inland Empire cities ${config.displayName} serves, ` +
        `and that covers ${listWithAnd(detail.neighborhoods)} along with the rest of the city.` +
        (distance ? ` ${area.name} is ${distance}.` : ''),
    },
    {
      q: `Which ${area.name} ZIP codes do you cover?`,
      a:
        `We install ${lower} across ${listWithAnd(detail.zips)}, which ${detail.zips.length === 1 ? 'is the ZIP code' : 'are the ZIP codes'} ` +
        `covering ${area.name} in ${detail.county} County. Don't see your ZIP? Contact us to see if we service your area.`,
    },
  ]

  if (nearbyNames.length > 0) {
    faqs.push({
      q: `Do you serve the cities around ${area.name}?`,
      a:
        `Yes. Next to ${area.name} we also install in ${listWithAnd(nearbyNames)}, and each of those has its own page. ` +
        `The full list of cities is on our service areas page.`,
    })
  }

  return faqs
}
