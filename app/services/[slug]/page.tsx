import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FaqAccordion from '@/components/FaqAccordion'
import Img from '@/components/Img'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import ServiceGrid from '@/components/ServiceGrid'
import { config, getService } from '@/lib/config'
import { loadContent, readFrontmatter } from '@/lib/content'
import { pageH1, pageIntro } from '@/lib/headings'
import { breadcrumbList, faqPage, service as serviceSchema } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

// No `dynamicParams = false` here: with output: 'export' the static build only
// ever serves these params anyway, and the flag makes `next dev` refuse the route.
export function generateStaticParams() {
  return config.services.map((s) => ({ slug: s.slug }))
}

function crumbsFor(name: string, slug: string) {
  return [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name, path: `/services/${slug}` },
  ]
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug)
  if (!service) return {}
  const fm = readFrontmatter(`services/${service.slug}.mdx`)
  return buildMetadata({ kind: 'service', service, path: `/services/${service.slug}`, description: fm.description, image: fm.image ?? service.image }).metadata
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug)
  if (!service) notFound()
  const { content } = await loadContent(`services/${service.slug}.mdx`, { service })
  const crumbs = crumbsFor(service.name, service.slug)

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqPage(service.faqs)} />
      <JsonLd data={breadcrumbList(crumbs)} />

      <PageHeader display={{ text: service.name, highlight: null }} title={pageH1.service(service)} intro={pageIntro()} />

      <div className="mx-auto grid max-w-page gap-10 px-4 pb-16 lg:grid-cols-3 lg:px-8">
        <article className="lg:col-span-2">{content}</article>
        <aside className="space-y-6">
          {service.image && (
            <div className="max-w-sm overflow-hidden rounded-card lg:max-w-none">
              <Img name={service.image} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 24rem, 100vw" className="h-auto w-full" />
            </div>
          )}
          {(service.priceFrom !== null || service.priceNote) && (
            <div className="rounded-card border border-line bg-surface p-6">
              <p className="text-step--1 font-semibold uppercase tracking-wide text-muted">Pricing</p>
              {service.priceFrom !== null && <p className="mt-2 font-heading text-step-4 font-bold text-ink">From ${service.priceFrom}</p>}
              {service.priceNote && <p className="mt-2 text-ink-soft">Pricing is {service.priceNote}.</p>}
            </div>
          )}
        </aside>
      </div>

      <FaqAccordion faqs={service.faqs} heading={`${service.name} Questions`} />
      <ServiceGrid heading="Other Services" exclude={service.slug} />
    </>
  )
}
