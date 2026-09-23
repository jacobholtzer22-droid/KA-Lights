import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FaqAccordion from '@/components/FaqAccordion'
import Img from '@/components/Img'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Panel from '@/components/Panel'
import PlaceholderChip from '@/components/PlaceholderChip'
import { config, getArea } from '@/lib/config'
import { cityFaqs, cityParagraphs } from '@/lib/city-copy'
import { cityIntro, pageH1 } from '@/lib/headings'
import { isPlaceholder } from '@/lib/images'
import { QUOTE_CTA } from '@/lib/navigation'
import { citiesWithPages } from '@/lib/routes'
import { breadcrumbList, cityService } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { btnPrimary, linkAccent } from '@/lib/ui'

/**
 * One page per city, generated ONLY for cities that qualify: a filled
 * `localDetail` block in site.config.ts (decision 50). A city without one gets
 * no page, is not in the sitemap, and is not linked from the index. Seven
 * near-identical pages with the city name swapped are still not built; what
 * changed is the definition of what makes a city worth a page, not whether
 * there is a gate. verify check 22 fails the build if the route and the config
 * disagree in either direction.
 *
 * Everything on the page comes from that city's own verified facts
 * (lib/city-copy.ts) or from the client's existing copy. These pages are thin
 * until Will supplies a real project or photo per city; `hasProjectContent`
 * tracks which ones have graduated (the client checklist in docs/, B7).
 */
export function generateStaticParams() {
  return citiesWithPages().map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = getArea(params.slug)
  if (!area?.cityPage?.localDetail) return {}
  return buildMetadata({ kind: 'city', area, path: `/service-areas/${area.slug}` }).metadata
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const area = getArea(params.slug)
  const detail = area?.cityPage?.localDetail
  if (!area || !detail) notFound()

  const { note, image } = area.cityPage ?? { note: null, image: null }
  const paragraphs = cityParagraphs(area, detail)
  const faqs = cityFaqs(area, detail)
  const nearby = detail.nearby
    .map((slug) => config.serviceAreas.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a?.hasCityPage))

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Service Areas', path: '/service-areas' },
    { name: `${area.name}, ${config.primaryState}`, path: `/service-areas/${area.slug}` },
  ]

  return (
    <>
      <JsonLd data={cityService(area)} />
      <JsonLd data={breadcrumbList(crumbs)} />
      <PageHeader display={{ text: area.name, highlight: null }} title={pageH1.city(area)} intro={cityIntro(area)} />

      <Panel>
        {/* The client's own project note, when there is one, leads. Until then the page
            opens on the city facts, which is the honest order: what we can verify first. */}
        {note && <p className="max-w-measure text-step-1 text-ink-soft">{note}</p>}
        {image && (
          <div className={`relative overflow-hidden rounded-card ${note ? 'mt-8' : ''}`}>
            <Img name={image} sizes="(min-width: 1024px) 60vw, 100vw" className="h-auto w-full" />
            {isPlaceholder(image) && <PlaceholderChip />}
          </div>
        )}

        <h2 className={`font-heading text-step-3 font-bold text-ink ${note || image ? 'mt-10' : ''}`}>
          Permanent lighting in {area.name}, {detail.county} County
        </h2>
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)} className="mt-4 max-w-measure text-ink-soft">
            {p}
          </p>
        ))}

        <Link href={QUOTE_CTA.href} className={`${btnPrimary} mt-8 px-6 py-3.5`}>
          {QUOTE_CTA.label}
        </Link>
      </Panel>

      <FaqAccordion faqs={faqs} heading={`${area.name} permanent lighting questions`} />

      {nearby.length > 0 && (
        <section aria-labelledby="nearby-heading" className="mx-auto max-w-3xl px-4 pb-16 md:pb-24 lg:px-8">
          <h2 id="nearby-heading" className="mb-4 font-heading text-step-3 font-bold text-ink">
            Nearby cities we serve
          </h2>
          <ul className="flex flex-col gap-3 text-step-0">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link href={`/service-areas/${n.slug}`} className={`flex min-h-[44px] items-center ${linkAccent}`}>
                  Permanent lighting in {n.name}, {config.primaryState}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/service-areas" className={`flex min-h-[44px] items-center ${linkAccent}`}>
                All {config.serviceAreas.length} Inland Empire cities we serve
              </Link>
            </li>
          </ul>
        </section>
      )}
    </>
  )
}
