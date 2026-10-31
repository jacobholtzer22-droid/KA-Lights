import { homeCopy } from '@/lib/page-content'
import Eyebrow from './Eyebrow'
import { FeatureIcon } from './icons'
import Section, { type SectionTone } from './Section'

/** "Why permanent lighting" cards. A card with no title (held copy) does not render. */
export default function FeatureCards({ tone = 'base' }: { tone?: SectionTone } = {}) {
  const copy = homeCopy.features
  const cards = copy.cards.filter((c): c is typeof c & { title: string } => c.title !== null)
  if (!copy.heading && cards.length === 0) return null
  return (
    <Section tone={tone} labelledBy={copy.heading ? 'features-heading' : undefined} label={copy.heading ? undefined : 'Why permanent lighting'}>
      <div className="mx-auto max-w-measure text-center">
        {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
        {copy.heading && (
          <h2 id="features-heading" className="mt-4 font-heading text-section font-bold text-ink">
            {copy.heading}
            {copy.headingSecondLine && (
              <>
                <br />
                <span className="text-ink-soft">{copy.headingSecondLine}</span>
              </>
            )}
          </h2>
        )}
      </div>
      {cards.length > 0 && (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:[grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]">
          {cards.map((card) => (
            <li key={card.title} className="relative rounded-card border border-line bg-surface p-8">
              <div aria-hidden="true" className="strip-spectrum absolute inset-x-4 top-0" />
              <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-site border border-line text-accent-ink">
                <FeatureIcon name={card.icon} />
              </span>
              <h3 className="mt-6 font-heading text-step-1 font-bold text-ink">{card.title}</h3>
              {card.body && <p className="mt-2 text-ink-soft">{card.body}</p>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
