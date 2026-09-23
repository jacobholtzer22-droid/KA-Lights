import { config } from '@/lib/config'
import { isPlaceholder } from '@/lib/images'
import { homeCopy } from '@/lib/page-content'
import Eyebrow from './Eyebrow'
import Img from './Img'
import PlaceholderChip from './PlaceholderChip'
import Section, { type SectionTone } from './Section'

/**
 * The crew band: one line of copy and three photographs of the crew, no names
 * or titles.
 *
 * Phones get a horizontal snap strip rather than three thumbnails squeezed into a
 * row, so each photo keeps its size. The group shot leads in both layouts.
 */
export default function CrewSection({ tone = 'base' }: { tone?: SectionTone } = {}) {
  const copy = homeCopy.crew
  const photos = config.images.crew
  if (!copy.heading && !copy.body && photos.length === 0) return null

  return (
    <Section tight tone={tone} labelledBy={copy.heading ? 'crew-heading' : undefined} label={copy.heading ? undefined : 'Our crew'}>
      <div className="max-w-2xl">
        {copy.eyebrow && <Eyebrow className="text-accent-ink">{copy.eyebrow}</Eyebrow>}
        {copy.heading && (
          <h2 id="crew-heading" className="mt-3 font-heading text-section font-bold text-ink">
            {copy.heading}
          </h2>
        )}
        {copy.body && <p className="mt-3 max-w-measure text-step-1 text-ink-soft">{copy.body}</p>}
      </div>
      {photos.length > 0 && (
        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:gap-6 [&::-webkit-scrollbar]:hidden">
          {photos.map((name) => (
            <li
              key={name}
              className="relative w-[78vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-card border border-line bg-surface md:w-auto md:max-w-none"
            >
              <Img name={name} sizes="(min-width: 768px) 33vw, 78vw" className="aspect-[3/2] h-auto w-full object-cover" />
              {isPlaceholder(name) && <PlaceholderChip />}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
