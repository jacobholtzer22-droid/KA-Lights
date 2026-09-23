import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Img from '@/components/Img'
import PlaceholderChip from '@/components/PlaceholderChip'
import { isPlaceholder } from '@/lib/images'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Panel from '@/components/Panel'
import { config, getArea } from '@/lib/config'
import { cityIntro, pageH1 } from '@/lib/headings'
import { citiesWithPages } from '@/lib/routes'
import { breadcrumbList, localBusiness } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

/**
 * One page per city, generated ONLY for cities that have real, city-specific
 * content in site.config.ts (`cityPage`): something true about work done there,
 * or a photograph taken there. Cities without it are not generated and are not
 * in the sitemap; they stay as entries on the service areas index. Seven
 * near-identical pages with the city name swapped are not built.
 *
 * PARKED. This file sits in a private folder (`_city`), which Next excludes
 * from routing, because `output: 'export'` rejects a dynamic route whose
 * generateStaticParams() returns nothing, and today no city qualifies.
 *
 * To activate, the moment any city gets a real `cityPage` in config:
 *   mv "app/service-areas/_city/[slug]" "app/service-areas/[slug]"
 * scripts/verify.ts check 22 fails the build if content exists while this is
 * parked, or if it is active while no city qualifies, so the two cannot drift.
 */
export function generateStaticParams() {
  return citiesWithPages().map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = getArea(params.slug)
  if (!area?.cityPage) return {}
  return buildMetadata({ kind: 'city', area, path: `/service-areas/${area.slug}` }).metadata
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const area = getArea(params.slug)
  if (!area?.cityPage) notFound()
  const { note, image } = area.cityPage
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Service Areas', path: '/service-areas' },
    { name: `${area.name}, ${config.primaryState}`, path: `/service-areas/${area.slug}` },
  ]

  return (
    <>
      <JsonLd data={localBusiness([area])} />
      <JsonLd data={breadcrumbList(crumbs)} />
      <PageHeader display={{ text: area.name, highlight: null }} title={pageH1.city(area)} intro={cityIntro(area)} />
      <Panel>
        {note && <p className="max-w-measure text-step-1 text-ink-soft">{note}</p>}
        {image && (
          <div className={`relative overflow-hidden rounded-card ${note ? 'mt-8' : ''}`}>
            <Img name={image} sizes="(min-width: 1024px) 60vw, 100vw" className="h-auto w-full" />
            {isPlaceholder(image) && <PlaceholderChip />}
          </div>
        )}
      </Panel>
    </>
  )
}
