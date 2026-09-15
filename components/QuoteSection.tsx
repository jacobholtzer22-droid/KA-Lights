import { homeCopy } from '@/lib/page-content'
import LeadForm from './LeadForm'
import Highlight from './Highlight'
import Section from './Section'

/** Homepage quote form. LeadForm wraps the sealed template form, unmodified, and disables submission in preview builds. */
export default function QuoteSection() {
  const copy = homeCopy.quote
  return (
    <Section id="quote" labelledBy="quote-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-3xl">
        <h2 id="quote-heading" className="text-center font-heading text-section font-bold text-ink">
          <Highlight text={copy.heading.text} highlight={copy.heading.highlight} className="text-warm" />
        </h2>
        {copy.subheading && <p className="mt-4 text-center text-step-1 text-ink-soft">{copy.subheading}</p>}
        <div className="mt-10">
          <LeadForm />
        </div>
        {copy.note && <p className="mt-6 text-center text-step--1 text-muted">{copy.note}</p>}
      </div>
    </Section>
  )
}
