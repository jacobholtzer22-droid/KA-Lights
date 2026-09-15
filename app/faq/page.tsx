import type { Metadata } from 'next'
import FaqAccordion from '@/components/FaqAccordion'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { config } from '@/lib/config'
import { pageH1, pageIntro } from '@/lib/headings'
import { faqCopy } from '@/lib/page-content'
import { breadcrumbList, faqPage } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'FAQ', path: '/faq' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'faq', path: '/faq' }).metadata
}

export default function FaqPage() {
  const faqs = [...config.services.flatMap((s) => s.faqs), ...config.faqs]
  return (
    <>
      <JsonLd data={faqPage(faqs)} />
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={faqCopy.display} title={pageH1.faq()} intro={pageIntro()} lead={faqCopy.lead} />
      <FaqAccordion faqs={faqs} heading={null} />
    </>
  )
}
