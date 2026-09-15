import type { Metadata } from 'next'
import GalleryGrid from '@/components/GalleryGrid'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { pageH1, pageIntro } from '@/lib/headings'
import { galleryCopy } from '@/lib/page-content'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
]

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'gallery', path: '/gallery' }).metadata
}

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={galleryCopy.display} highlightClass="text-spectrum" title={pageH1.gallery()} intro={pageIntro()} lead={galleryCopy.lead} />
      <div className="mx-auto max-w-page px-4 pb-16 md:pb-24 lg:px-8">
        <GalleryGrid />
      </div>
    </>
  )
}
