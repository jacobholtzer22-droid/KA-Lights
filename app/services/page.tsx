import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import ServiceGrid from '@/components/ServiceGrid'
import { pageH1, pageIntro } from '@/lib/headings'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'services', path: '/services' }).metadata
}

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={{ text: 'Services', highlight: null }} title={pageH1.services()} intro={pageIntro()} />
      <ServiceGrid heading="What we install" />
    </>
  )
}
