import { z } from 'zod'
import faqRaw from '@/content/pages/faq.json'
import quoteRaw from '@/content/pages/quote.json'
import galleryRaw from '@/content/pages/gallery.json'
import homeRaw from '@/content/pages/home.json'
import howRaw from '@/content/pages/how-it-works.json'
import areasRaw from '@/content/pages/service-areas.json'
import siteRaw from '@/content/pages/site.json'
import whyRaw from '@/content/pages/why-kalights.json'

/**
 * Structured page copy from content/pages/*.json, validated at build.
 *
 * A null slot is copy that is not published yet. Components render nothing
 * for a null slot, so adding copy later is a content edit, never a component
 * change. Unknown keys are stripped.
 */

const slot = z.string().min(1).nullable()

const display = z
  .object({ text: z.string().min(1), highlight: z.string().min(1).nullable() })
  .refine((d) => !d.highlight || d.text.includes(d.highlight), 'highlight must appear in text')

const step = z.object({ title: slot, body: slot })

const home = z.object({
  hero: z.object({ brandLine: display, lead: slot, trustLabels: z.array(z.string().min(1)) }),
  serviceAreas: z.object({ eyebrow: slot }),
  visualizer: z.object({ eyebrow: slot, heading: display, body: slot, hint: slot }),
  features: z.object({
    eyebrow: slot,
    heading: slot,
    headingSecondLine: slot,
    cards: z.array(z.object({ icon: z.enum(['ladder', 'palette', 'eye', 'season']), title: slot, body: slot })),
  }),
  galleryTeaser: z.object({ heading: slot, subheading: slot, cta: z.string().min(1) }),
  crew: z.object({ eyebrow: slot, heading: slot, body: slot }),
  process: z.object({ heading: slot }),
  difference: z.object({
    eyebrow: slot,
    heading: slot,
    headingSecondLine: slot,
    paragraphs: z.array(z.string().min(1)),
    labels: z.array(z.string().min(1)),
  }),
  quote: z.object({ heading: display, subheading: slot, note: slot }),
})

const simplePage = z.object({ display, lead: slot })

function parse<T extends z.ZodTypeAny>(schema: T, raw: unknown, file: string): z.output<T> {
  const result = schema.safeParse(raw)
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    throw new Error(`content/pages/${file} failed validation:\n${lines.join('\n')}`)
  }
  return result.data
}

export type Display = z.output<typeof display>
export type Step = z.output<typeof step>

export const siteCopy = parse(z.object({ footerBlurb: slot }), siteRaw, 'site.json')
export const homeCopy = parse(home, homeRaw, 'home.json')
/** How-it-works steps may carry one real photograph (manifest filename) that shows that step. */
const howStep = step.extend({
  image: z.string().min(1).nullable().default(null),
  icon: z.enum(['quote', 'design', 'install', 'app']).nullable().default(null),
})

export const howCopy = parse(simplePage.extend({ steps: z.array(howStep) }), howRaw, 'how-it-works.json')
export const galleryCopy = parse(simplePage, galleryRaw, 'gallery.json')
export const whyCopy = parse(simplePage.extend({ sections: z.array(z.object({ heading: slot, body: slot })) }), whyRaw, 'why-kalights.json')
export const areasCopy = parse(simplePage.extend({ closing: slot }), areasRaw, 'service-areas.json')
export const faqCopy = parse(simplePage, faqRaw, 'faq.json')
export const quoteCopy = parse(simplePage, quoteRaw, 'quote.json')
