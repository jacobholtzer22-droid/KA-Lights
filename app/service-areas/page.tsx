import type { Metadata } from 'next'
import AreaList from '@/components/AreaList'
import { MapPinIcon } from '@/components/icons'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Panel from '@/components/Panel'
import { pageH1, pageIntro } from '@/lib/headings'
import { areasCopy } from '@/lib/page-content'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Service Areas', path: '/service-areas' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'service-areas', path: '/service-areas' }).metadata
}

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={areasCopy.display} title={pageH1.serviceAreas()} intro={pageIntro()} lead={areasCopy.lead} />
      <Panel className="text-center">
        <MapPinIcon className="mx-auto h-10 w-10 text-accent-ink" />
        <div className="mt-8 text-left">
          <AreaList />
        </div>
        {areasCopy.closing && <p className="mx-auto mt-8 max-w-measure text-ink-soft">{areasCopy.closing}</p>}
      </Panel>
    </>
  )
}
