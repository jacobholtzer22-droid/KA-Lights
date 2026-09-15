import { config } from '@/lib/config'
import { homeCopy } from '@/lib/page-content'
import Eyebrow from './Eyebrow'
import Img from './Img'
import Section from './Section'

export default function CrewSection() {
  const copy = homeCopy.crew
  const photos = config.images.crew
  if (!copy.heading && !copy.body && photos.length === 0) return null
  return (
    <Section labelledBy={copy.heading ? 'crew-heading' : undefined} label={copy.heading ? undefined : 'Our team'}>
      <div className="mx-auto max-w-3xl text-center">
        {copy.eyebrow && <Eyebrow className="text-accent">{copy.eyebrow}</Eyebrow>}
        {copy.heading && (
          <h2 id="crew-heading" className="mt-4 font-heading text-section font-bold text-ink">
            {copy.heading}
          </h2>
        )}
        {copy.body && <p className="mt-4 text-step-1 text-ink-soft">{copy.body}</p>}
      </div>
      {photos.length > 0 && (
        <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-6">
          {photos.map((name) => (
            <li key={name} className="overflow-hidden rounded-card border border-line bg-surface">
              <Img name={name} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[3/2] h-auto w-full object-cover" />
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
