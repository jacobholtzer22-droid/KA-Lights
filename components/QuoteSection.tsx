import { homeCopy } from '@/lib/page-content'
import LeadForm from './LeadForm'
import Highlight from './Highlight'
import Section, { type SectionTone } from './Section'

/** Homepage quote form. LeadForm wraps the sealed template form, unmodified, and disables submission in preview builds. */
export default function QuoteSection({ tone = 'base' }: { tone?: SectionTone } = {}) {
  const copy = homeCopy.quote
  return (
    <Section tone={tone} id="quote" labelledBy="quote-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <h2 id="quote-heading" className="text-center font-heading text-section font-bold text-ink">
          <Highlight text={copy.heading.text} highlight={copy.heading.highlight} className="text-warm" />
        </h2>
        {copy.subheading && <p className="mx-auto mt-4 max-w-measure text-center text-step-1 text-ink-soft">{copy.subheading}</p>}
        <div className="mt-10">
          <LeadForm />
        </div>
        {copy.note && <p className="mt-6 text-center text-step--1 text-muted">{copy.note}</p>}
      </div>
    </Section>
  )
}
