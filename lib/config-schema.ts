import { z } from 'zod'

/**
 * The schema every site.config.ts is parsed against.
 *
 * This file deliberately does NOT parse anything at import time, so
 * scripts/verify.ts can import the schema and report a parse failure as a
 * check result instead of crashing. lib/config.ts is the module that parses
 * at load and throws, which is what makes an invalid config fail `next build`.
 */

/**
 * Where every contact form submission goes. Frozen, never an env var.
 * The bare apex (alignandacquire.com without www) answers with a 308 that
 * the platform's own tooling does not follow, so the "www." is load-bearing.
 */
export const CONTACT_ENDPOINT = 'https://www.alignandacquire.com/api/contact' as const

/** The honeypot field name the platform checks. Must match lib/spam-constants.ts there. */
export const HONEYPOT_FIELD = 'hp_7d3a_ref' as const

/**
 * Real schema.org types a site may declare itself as. "LandscapingBusiness" and
 * "LandscapeService" do not exist on schema.org and are not accepted. Landscaping
 * and other outdoor trades use HomeAndConstructionBusiness.
 */
export const SCHEMA_TYPES = [
  'HomeAndConstructionBusiness',
  'Plumber',
  'Electrician',
  'HVACBusiness',
  'RoofingContractor',
  'MovingCompany',
  'AutoRepair',
  'GeneralContractor',
  'LocalBusiness',
  'ProfessionalService',
  'Locksmith',
  'HousePainter',
] as const

export type SchemaType = (typeof SCHEMA_TYPES)[number]

export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

const slug = z.string().regex(SLUG_REGEX, 'must be kebab-case: lowercase letters, digits, single hyphens')

const faq = z.object({
  q: z.string().min(8),
  a: z.string().min(20),
})

const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'must be a 6-digit hex color like #2DD4FF')

/**
 * The color visualizer. Each scene is one real photograph of the same install
 * in a different lighting scene (technique A). Adding a scene is a config edit
 * plus its photo in public/images/originals; the component never changes.
 */
const visualizer = z
  .object({
    defaultScene: slug,
    scenes: z
      .array(
        z.object({
          key: slug,
          name: z.string().min(2),
          /** Short sub-label shown under the scene name. */
          description: z.string().min(2),
          /** Swatch colors. More than one renders a hard-stop multi-color swatch. */
          colors: z.array(hex).min(1),
          /** Glow tint over the photo. null for no glow (for example lights off). */
          glow: hex.nullable(),
          /** Filename in public/images/originals (manifest key). */
          image: z.string().min(1),
        }),
      )
      .min(1),
  })
  .superRefine((v, ctx) => {
    const keys = v.scenes.map((s) => s.key)
    if (new Set(keys).size !== keys.length) ctx.addIssue({ code: 'custom', message: 'scene keys must be unique', path: ['scenes'] })
    const images = v.scenes.map((s) => s.image)
    if (new Set(images).size !== images.length) ctx.addIssue({ code: 'custom', message: 'each scene needs its own photograph', path: ['scenes'] })
    if (!keys.includes(v.defaultScene)) ctx.addIssue({ code: 'custom', message: 'defaultScene must be one of the scene keys', path: ['defaultScene'] })
  })

export const siteConfigSchema = z
  .object({
    /**
     * Sent with every contact form submission and must match a live Business
     * row in the platform database, or every lead from this site is lost.
     * verify.ts confirms it against the platform (check 3) and rejects the
     * shipped sample identity (check 2).
     */
    businessSlug: slug,

    legalName: z.string().min(2),
    displayName: z.string().min(2),
    tagline: z.string().min(10),

    schemaType: z.enum(SCHEMA_TYPES),

    /** E.164. The single source of truth for the phone number; phoneDisplay is derived from it. */
    phone: z.string().regex(/^\+1\d{10}$/, 'must be E.164: +1 followed by 10 digits'),
    email: z.string().email().nullable(),

    /**
     * null when the business does not publish an address. Address-dependent
     * schema properties and the address block do not render.
     */
    address: z
      .object({
        street: z.string().min(3),
        city: z.string().min(2),
        state: z.string().length(2),
        zip: z.string().regex(/^\d{5}$/),
        lat: z.number().nullable(),
        lng: z.number().nullable(),
      })
      .nullable(),

    primaryCity: z.string().min(2),
    /** Two-letter state for titles and area pages. Kept top-level because address may be null. */
    primaryState: z.string().length(2),

    serviceAreas: z
      .array(
        z.object({
          slug,
          name: z.string().min(2),
          county: z.string().nullable(),
        }),
      )
      .min(1),

    services: z
      .array(
        z.object({
          slug,
          name: z.string().min(2),
          shortDescription: z.string().min(40).max(200),
          priceFrom: z.number().nullable(),
          priceNote: z.string().nullable(),
          /** Filename in public/images/originals to use as the page image, or null. */
          image: z.string().nullable(),
          faqs: z.array(faq).min(3).max(6),
        }),
      )
      .min(1),

    /** null means hours are unknown. openingHoursSpecification is omitted entirely. Never guess hours. */
    hours: z
      .array(
        z.object({
          day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
          open: z.string().regex(TIME_REGEX, 'HH:MM 24-hour'),
          close: z.string().regex(TIME_REGEX, 'HH:MM 24-hour'),
        }),
      )
      .nullable(),

    yearsInBusiness: z.number().int().positive().nullable(),
    licenseNumber: z.string().nullable(),
    insured: z.boolean().nullable(),

    /**
     * Review and aggregateRating schema render ONLY when this array is non-empty,
     * and the same reviews render visibly on the page. Empty by default. Only real
     * reviews with a source URL belong here.
     */
    reviews: z
      .array(
        z.object({
          author: z.string().min(2),
          rating: z.number().min(1).max(5),
          text: z.string().min(10),
          source: z.string().min(2),
          url: z.string().url(),
        }),
      )
      .default([]),

    profiles: z
      .object({
        gbp: z.string().url().nullable(),
        facebook: z.string().url().nullable(),
        instagram: z.string().url().nullable(),
        yelp: z.string().url().nullable(),
      })
      .partial(),

    /** Homepage FAQs. FAQPage schema on the homepage renders only when non-empty. */
    faqs: z.array(faq).default([]),

    /** Which processed images go where. Filenames are keys in public/images/manifest.json. */
    images: z.object({
      hero: z.string().nullable(),
      about: z.string().nullable(),
      gallery: z.array(z.string()).default([]),
      crew: z.array(z.string()).default([]),
    }),

    /** null when the site has no visualizer. */
    visualizer: visualizer.nullable(),

    /** Full origin including https:// and www. when www is the primary host. No trailing slash. */
    domain: z
      .string()
      .url()
      .regex(/^https:\/\/[^/]+$/, 'origin only: https://www.example-host.com with no path or trailing slash'),
  })
  .strict()

export type SiteConfigInput = z.input<typeof siteConfigSchema>
export type SiteConfigParsed = z.output<typeof siteConfigSchema>

export type Service = SiteConfigParsed['services'][number]
export type ServiceArea = SiteConfigParsed['serviceAreas'][number]
export type Review = SiteConfigParsed['reviews'][number]
export type Faq = SiteConfigParsed['faqs'][number]
export type Hours = NonNullable<SiteConfigParsed['hours']>
export type Visualizer = NonNullable<SiteConfigParsed['visualizer']>
export type Scene = Visualizer['scenes'][number]

/** Derived fields that are computed, never authored. */
export type SiteConfig = SiteConfigParsed & {
  phoneDisplay: string
  /** The first service in config, used in the home and area page titles. */
  primaryService: Service
}

/** "+15555550123" -> "(555) 555-0123". Authored nowhere; derived from config.phone. */
export function formatPhoneDisplay(e164: string): string {
  const d = e164.replace(/\D/g, '').slice(-10)
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export function deriveConfig(parsed: SiteConfigParsed): SiteConfig {
  const primaryService = parsed.services[0]
  if (!primaryService) throw new Error('services must have at least one entry')
  return { ...parsed, phoneDisplay: formatPhoneDisplay(parsed.phone), primaryService }
}
