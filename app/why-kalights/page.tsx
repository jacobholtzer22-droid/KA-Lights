import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Panel from '@/components/Panel'
import { pageH1, pageIntro } from '@/lib/headings'
import { whyCopy } from '@/lib/page-content'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Why Kalights', path: '/why-kalights' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'why', path: '/why-kalights' }).metadata
}

/** The panel renders once its copy exists in content/pages/why-kalights.json. */
export default function WhyPage() {
  const sections = whyCopy.sections.filter((s): s is typeof s & { heading: string } => s.heading !== null)
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={whyCopy.display} title={pageH1.why()} intro={pageIntro()} lead={whyCopy.lead} />
      {sections.length > 0 && (
        <Panel>
          {sections.map((s) => (
            <div key={s.heading} className="mt-10 first:mt-0">
              <h2 className="font-heading text-step-3 font-bold text-ink">{s.heading}</h2>
              {s.body && <p className="mt-4 text-step-1 text-ink-soft">{s.body}</p>}
            </div>
          ))}
        </Panel>
      )}
    </>
  )
}
