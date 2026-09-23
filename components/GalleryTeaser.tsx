import Link from 'next/link'
import { homeCopy } from '@/lib/page-content'
import { btnOutline } from '@/lib/ui'
import GalleryGrid from './GalleryGrid'
import Section, { type SectionTone } from './Section'

/**
 * Design Ideas teaser. The band keeps the dark palette (decision 44): every
 * image in it is a night rendering, and a light ground between pure-night
 * frames reads as unfinished. The page returns to light at the next section.
 */
export default function GalleryTeaser({ tone = 'base' }: { tone?: SectionTone } = {}) {
  const copy = homeCopy.galleryTeaser
  return (
    <Section dark tone={tone} labelledBy={copy.heading ? 'gallery-heading' : undefined} label={copy.heading ? undefined : 'Gallery'}>
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          {copy.heading && (
            <h2 id="gallery-heading" className="font-heading text-section font-bold text-ink">
              {copy.heading}
            </h2>
          )}
          {copy.subheading && <p className="mt-3 max-w-measure text-step-1 text-ink-soft">{copy.subheading}</p>}
        </div>
        <Link href="/gallery" className={`${btnOutline} px-5 py-2.5 text-step--1`}>
          {copy.cta} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <GalleryGrid limit={4} />
    </Section>
  )
}
