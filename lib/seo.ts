import type { Metadata } from 'next'
import { config } from './config'
import type { Service, ServiceArea } from './config-schema'
import { getImage, shareableImage } from './images'

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

export type PageKind = 'home' | 'services' | 'service' | 'how' | 'gallery' | 'why' | 'service-areas' | 'city' | 'faq' | 'quote' | 'contact' | 'privacy' | 'other'

export interface BuildMetadataArgs {
  kind: PageKind
  path: string
  service?: Service
  area?: ServiceArea
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

export function buildTitle(args: Pick<BuildMetadataArgs, 'kind' | 'service' | 'area' | 'title'>): string {
  const { displayName } = config
  switch (args.kind) {
    case 'home':
      return `Permanent Christmas & Architectural Lighting | ${displayName}`
    case 'services':
      return `Permanent Outdoor Lighting Services in ${where()} | ${displayName}`
    case 'service':
      if (!args.service) throw new Error('buildTitle: kind "service" needs a service')
      return `Permanent Holiday Lighting in ${where()} | ${displayName}`
    case 'how':
      return `How Permanent Lighting Installation Works | ${displayName}`
    case 'gallery':
      return `${serviceName()} Design Ideas | ${displayName}`
    case 'why':
      return `Why ${displayName} | Permanent Architectural LED Lighting`
    case 'service-areas':
      return `Permanent Lighting Service Areas, Inland Empire | ${displayName}`
    case 'city':
      if (!args.area) throw new Error('buildTitle: kind "city" needs an area')
      return `${serviceName()} in ${args.area.name}, ${config.primaryState} | ${displayName}`
    case 'faq':
      return `Permanent Lighting Questions and Answers | ${displayName}`
    case 'quote':
      return `Request a Permanent Lighting Quote in ${where()} | ${displayName}`
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
export function defaultDescription(args: Pick<BuildMetadataArgs, 'kind' | 'service' | 'area'>): string {
  const { displayName } = config
  const lower = serviceName().toLowerCase()
  const cities = config.serviceAreas.map((a) => a.name)
  const cityList = cities.length > 1 ? `${cities.slice(0, -1).join(', ')}, and ${cities.at(-1)}` : (cities[0] ?? '')
  switch (args.kind) {
    case 'home':
      return `${displayName} installs permanent Christmas and architectural lighting in ${where()} and the Inland Empire: app-controlled warm white and full color all year.`
    case 'services':
      return `Permanent outdoor lighting from ${displayName} in ${where()} and the Inland Empire: roofline lights in app-controlled warm white and full color. See what is included.`
    case 'service':
      return `Permanent holiday lighting in ${where()} from ${displayName}: how the track mounts, app control, what affects cost, HOA rules, and permanent versus seasonal lights.`
    case 'how':
      return `How permanent lighting installation works with ${displayName} in ${where()}: request a quote, get a custom design, have the track mounted, and control it by phone.`
    case 'gallery':
      return `${serviceName()} design ideas for ${where()} homes: concept renderings of warm white and full color rooflines, not photos of completed jobs.`
    case 'why':
      return `Why ${displayName} for ${lower} in ${where()} and the Inland Empire: professionally installed, app-controlled, warm white and full color.`
    case 'service-areas':
      return `${displayName} installs ${lower} in ${cityList}. Don't see your city? Ask us.`
    case 'city':
      return `${displayName} installs ${lower} in ${args.area?.name ?? where()}, ${config.primaryState} and across the Inland Empire. See work in ${args.area?.name ?? where()} and request a quote.`
    case 'quote':
      return `Request a permanent lighting quote from ${displayName} in ${where()} and the Inland Empire. Send a few details about your home and we will follow up.`
    case 'faq':
      return `Answers about permanent Christmas and holiday lights from ${displayName} in ${where()}: cost, mounting, daytime look, app control, HOA rules, and cities we serve.`
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

  // Renderings never become the share image (see shareableImage).
  const imageName = shareableImage([args.image, config.images.hero, ...config.images.crew])
  const ogImage = imageName ? getImage(imageName) : null

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
