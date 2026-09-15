import { homeCopy } from '@/lib/page-content'
import Section from './Section'

/** Numbered process. Steps with held titles do not render; numbering follows the steps shown. */
export default function ProcessSteps() {
  const copy = homeCopy.process
  const steps = copy.steps.filter((s): s is typeof s & { title: string } => s.title !== null)
  if (!copy.heading && steps.length === 0) return null
  return (
    <Section labelledBy={copy.heading ? 'process-heading' : undefined} label={copy.heading ? undefined : 'Process'}>
      {copy.heading && (
        <h2 id="process-heading" className="text-center font-heading text-section font-bold text-ink">
          {copy.heading}
        </h2>
      )}
      {steps.length > 0 && (
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:[grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-site border border-line font-heading text-step-1 font-bold text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-heading text-step-1 font-bold text-ink">{step.title}</h3>
              {step.body && <p className="mt-2 text-ink-soft">{step.body}</p>}
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}
