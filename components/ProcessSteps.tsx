import Link from 'next/link'
import { homeCopy, howCopy } from '@/lib/page-content'
import { StepIcon } from './icons'
import Section, { type SectionTone } from './Section'

/**
 * Homepage How It Works: the numbered steps from content/pages/how-it-works.json
 * (the same copy as /how-it-works), each with an icon. Steps with held titles do
 * not render; numbering follows the steps shown.
 */
export default function ProcessSteps({ tone = 'base' }: { tone?: SectionTone } = {}) {
  const heading = homeCopy.process.heading
  const steps = howCopy.steps.filter((s): s is typeof s & { title: string } => s.title !== null)
  if (!heading && steps.length === 0) return null
  return (
    <Section tone={tone} labelledBy={heading ? 'process-heading' : undefined} label={heading ? undefined : 'How it works'}>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        {heading && (
          <h2 id="process-heading" className="font-heading text-section font-bold text-ink">
            {heading}
          </h2>
        )}
        <Link href="/how-it-works" className="text-step-0 font-semibold text-accent-ink underline-offset-4 hover:underline">
          See how permanent lighting installation works <span aria-hidden="true">→</span>
        </Link>
      </div>
      {steps.length > 0 && (
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-card border border-line bg-surface p-6">
              <div className="flex items-center justify-between">
                <span aria-hidden="true" className="inline-flex h-11 w-11 items-center justify-center rounded-site border border-line text-accent-ink">
                  {step.icon ? <StepIcon name={step.icon} /> : null}
                </span>
                <span aria-hidden="true" className="font-heading text-step-2 font-bold text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-step-1 font-bold text-ink">{step.title}</h3>
              {step.body && <p className="mt-2 text-ink-soft">{step.body}</p>}
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}
