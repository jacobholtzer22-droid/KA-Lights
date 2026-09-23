import { config } from '@/lib/config'
import { homeCopy } from '@/lib/page-content'
import { eyebrowClass } from './Eyebrow'
import Section, { type SectionTone } from './Section'

/**
 * The real city list in crawlable text. On the current site this is a
 * scrolling marquee; motion arrives in Phase 4, so it renders static here. The
 * eyebrow is promoted to the section's <h2> with no visual change.
 */
export default function ServiceAreaStrip({ tone = 'base' }: { tone?: SectionTone } = {}) {
  const eyebrow = homeCopy.serviceAreas.eyebrow
  if (config.serviceAreas.length === 0) return null
  return (
    <Section tone={tone} tight labelledBy={eyebrow ? 'service-areas-heading' : undefined} label={eyebrow ? undefined : 'Service areas'}>
      {eyebrow && (
        <h2 id="service-areas-heading" className={`text-center ${eyebrowClass}`}>
          {eyebrow}
        </h2>
      )}
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10">
        {config.serviceAreas.map((area, i) => (
          <li key={area.slug} className="flex items-center gap-6 font-heading text-step-2 font-semibold uppercase text-ink md:gap-10">
            {i > 0 && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent shadow-glow" />}
            {area.name}
          </li>
        ))}
      </ul>
    </Section>
  )
}
