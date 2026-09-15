import type { Metadata } from 'next'
import { config } from './config'
import type { Service } from './config-schema'
import { getImage, hasImage } from './images'

/**
 * Title template applied by the root layout. Every builder below already
 * includes the display name, so no suffix is appended, but the template is
 * still applied here so `renderedTitleLength` is the number a browser shows.
 */
export const TITLE_TEMPLATE = '%s'

export function renderTitle(raw: string): string {
  return TITLE_TEMPLATE.replace('%s', raw)
}

export { DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX, TITLE_MIN } from '@/scripts/verify-limits'

export type PageKind = 'home' | 'services' | 'service' | 'how' | 'gallery' | 'why' | 'service-areas' | 'faq' | 'contact' | 'privacy' | 'other'

export interface BuildMetadataArgs {
  kind: PageKind
  path: string
  service?: Service
  /** Overrides the derived title for kind 'other'. */
  title?: string
  /** Page description, 140 to 160 characters. Falls back to a config-derived default. */
  description?: string
  /** Manifest filename for the og:image. Falls back to the hero. */
  image?: string | null
}

export function canonicalUrl(path: string): string {
  return new URL(path, config.domain).toString()
}

const where = () => `${config.primaryCity}, ${config.primaryState}`
const serviceName = () => config.primaryService.name

export function buildTitle(args: Pick<BuildMetadataArgs, 'kind' | 'service' | 'title'>): string {
  const { displayName } = config
  switch (args.kind) {
    case 'home':
      return `${displayName} | ${serviceName()} in ${where()}`
    case 'services':
      return `${serviceName()} Services | ${displayName}`
    case 'service':
      if (!args.service) throw new Error('buildTitle: kind "service" needs a service')
      return `${args.service.name} in ${where()} | ${displayName}`
    case 'how':
      return `How Permanent Lighting Installation Works | ${displayName}`
    case 'gallery':
      return `${serviceName()} Gallery | ${displayName}`
    case 'why':
      return `Why ${displayName} | Permanent Architectural LED Lighting`
    case 'service-areas':
      return `Permanent Lighting Service Areas, Inland Empire | ${displayName}`
    case 'faq':
      return `${serviceName()} Questions | ${displayName}`
    case 'contact':
      return `Contact ${displayName} | Permanent Lighting in ${where()}`
    case 'privacy':
      return `Privacy Policy and Text Message Consent | ${displayName}`
    case 'other':
      if (!args.title) throw new Error('buildTitle: kind "other" needs a title')
      return `${args.title} | ${displayName}`
  }
}

/** Descriptions built from config so a changed city or name can never leave stale copy behind. verify.ts measures each. */
export function defaultDescription(args: Pick<BuildMetadataArgs, 'kind' | 'service'>): string {
  const { displayName } = config
  const lower = serviceName().toLowerCase()
  const cities = config.serviceAreas.map((a) => a.name)
  const cityList = cities.length > 1 ? `${cities.slice(0, -1).join(', ')}, and ${cities.at(-1)}` : (cities[0] ?? '')
  switch (args.kind) {
    case 'home':
      return `${displayName} installs ${lower} in ${where()} and across the Inland Empire: app-controlled warm white and full color. Request a quote.`
    case 'services':
      return `${displayName} offers ${lower} in ${where()} and the Inland Empire. See what the service includes, how pricing works, and common questions.`
    case 'service':
      return `${args.service?.name ?? serviceName()} in ${where()} from ${displayName}: professionally installed and app-controlled, priced by the linear footage of your roofline.`
    case 'how':
      return `How ${displayName} handles ${lower} for homes in ${where()} and the Inland Empire, from custom design to professional installation.`
    case 'gallery':
      return `Gallery of ${lower} from ${displayName} in ${where()} and the Inland Empire, with warm white for everyday and full color for any occasion.`
    case 'why':
      return `Why ${displayName} for ${lower} in ${where()} and the Inland Empire: professionally installed, app-controlled, warm white and full color.`
    case 'service-areas':
      return `${displayName} installs ${lower} in ${cityList}. Don't see your city? Ask us.`
    case 'faq':
      return `Answers about ${lower} from ${displayName} in ${where()}: how pricing works, color options, app control, and which cities we serve.`
    case 'contact':
      return `Contact ${displayName} about ${lower} in ${where()} and the Inland Empire. Call or send the form to request a quote for your home.`
    case 'privacy':
      return `How ${displayName} handles the information you share through this website, including contact form details, text message consent, and how to reach us.`
    case 'other':
      return `${displayName} installs ${lower} in ${where()} and the Inland Empire. Call or send the form to request a quote for your home today.`
  }
}

export interface BuiltMetadata {
  metadata: Metadata
  renderedTitle: string
  /** Length of the title exactly as the browser will render it, template included. */
  renderedTitleLength: number
  description: string
}

export function buildMetadata(args: BuildMetadataArgs): BuiltMetadata {
  const rawTitle = buildTitle(args)
  const renderedTitle = renderTitle(rawTitle)
  const description = args.description ?? defaultDescription(args)
  const url = canonicalUrl(args.path)

  const imageName = args.image ?? config.images.hero
  const ogImage = imageName && hasImage(imageName) ? getImage(imageName) : null

  const metadata: Metadata = {
    title: { absolute: renderedTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: config.displayName,
      title: renderedTitle,
      description,
      url,
      ...(ogImage
        ? { images: [{ url: canonicalUrl(ogImage.src), width: ogImage.width, height: ogImage.height, alt: ogImage.alt }] }
        : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: renderedTitle,
      description,
      ...(ogImage ? { images: [canonicalUrl(ogImage.src)] } : {}),
    },
  }

  return { metadata, renderedTitle, renderedTitleLength: renderedTitle.length, description }
}
