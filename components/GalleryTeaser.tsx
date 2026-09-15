import Link from 'next/link'
import { homeCopy } from '@/lib/page-content'
import GalleryGrid from './GalleryGrid'
import Section from './Section'

export default function GalleryTeaser() {
  const copy = homeCopy.galleryTeaser
  return (
    <Section labelledBy={copy.heading ? 'gallery-heading' : undefined} label={copy.heading ? undefined : 'Gallery'}>
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          {copy.heading && (
            <h2 id="gallery-heading" className="font-heading text-section font-bold text-ink">
              {copy.heading}
            </h2>
          )}
          {copy.subheading && <p className="mt-3 text-step-1 text-ink-soft">{copy.subheading}</p>}
        </div>
        <Link href="/gallery" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-step--1 font-medium text-ink hover:bg-surface">
          {copy.cta} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <GalleryGrid limit={4} />
    </Section>
  )
}
