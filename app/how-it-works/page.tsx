import type { Metadata } from 'next'
import Img from '@/components/Img'
import { StepIcon } from '@/components/icons'
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
                <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-accent-ink">
                  {step.icon ? <StepIcon name={step.icon} /> : <span className="font-heading text-step-1 font-bold">{i + 1}</span>}
                </span>
                <div className="min-w-0">
                  <h2 className="font-heading text-step-2 font-bold text-ink">{step.title}</h2>
                  {step.body && <p className="mt-2 text-ink-soft">{step.body}</p>}
                  {step.image && (
                    <div className="mt-6 max-w-sm overflow-hidden rounded-card border border-line">
                      <Img name={step.image} sizes="(min-width: 640px) 24rem, 80vw" className="aspect-[4/5] h-auto w-full object-cover" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </>
  )
}
