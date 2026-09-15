import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Panel from '@/components/Panel'
import { pageH1, pageIntro } from '@/lib/headings'
import { howCopy } from '@/lib/page-content'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'How It Works', path: '/how-it-works' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'how', path: '/how-it-works' }).metadata
}

export default function HowItWorksPage() {
  const steps = howCopy.steps.filter((s): s is typeof s & { title: string } => s.title !== null)
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={howCopy.display} title={pageH1.how()} intro={pageIntro()} lead={howCopy.lead} />
      {steps.length > 0 && (
        <Panel>
          <ol className="space-y-10">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-6">
                <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line font-heading text-step-1 font-bold text-accent">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-heading text-step-2 font-bold text-ink">{step.title}</h2>
                  {step.body && <p className="mt-2 text-ink-soft">{step.body}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </>
  )
}
