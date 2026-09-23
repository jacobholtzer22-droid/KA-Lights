import type { Metadata } from 'next'
import GalleryGrid from '@/components/GalleryGrid'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { pageH1, pageIntro } from '@/lib/headings'
import { darkVars } from '@/lib/theme-vars'
import { galleryCopy } from '@/lib/page-content'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Design Ideas', path: '/gallery' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'gallery', path: '/gallery' }).metadata
}

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={galleryCopy.display} highlightClass="text-spectrum" title={pageH1.gallery()} intro={pageIntro()} lead={galleryCopy.lead} />
      {/* Night renderings end to end, so the grid keeps the dark palette (decision 44). */}
      <section aria-label="Design renderings" style={darkVars} className="relative bg-bg text-ink-soft">
        <div aria-hidden="true" className="strip-spectrum absolute inset-x-0 top-0" />
        <div className="mx-auto max-w-page px-4 py-16 md:py-24 lg:px-8">
          <GalleryGrid />
        </div>
      </section>
    </>
  )
}
