import type { Metadata } from 'next'
import ContactDetails from '@/components/ContactDetails'
import JsonLd from '@/components/JsonLd'
import LeadForm from '@/components/LeadForm'
import PageHeader from '@/components/PageHeader'
import { pageH1, pageIntro } from '@/lib/headings'
import { quoteCopy } from '@/lib/page-content'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Get a Quote', path: '/quote' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'quote', path: '/quote' }).metadata
}

/** Dedicated lead page. Every "Get a Quote" button on the site points here. */
export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={quoteCopy.display} title={pageH1.quote()} intro={pageIntro()} lead={quoteCopy.lead} />
      <div className="mx-auto grid max-w-page gap-10 px-4 pb-16 md:pb-24 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <LeadForm />
        </div>
        <aside>
          <ContactDetails />
        </aside>
      </div>
    </>
  )
}
