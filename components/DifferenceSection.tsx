import { homeCopy } from '@/lib/page-content'
import Eyebrow from './Eyebrow'
import Section from './Section'

/** "The Kalights difference" panel. Renders nothing until its copy is added to content/pages/home.json. */
export default function DifferenceSection() {
  const copy = homeCopy.difference
  if (!copy.heading && copy.paragraphs.length === 0) return null
  return (
    <Section labelledBy={copy.heading ? 'difference-heading' : undefined} label={copy.heading ? undefined : 'The Kalights difference'}>
      <div className="max-w-2xl rounded-panel border border-line bg-surface p-8 md:p-12">
        {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
        {copy.heading && (
          <h2 id="difference-heading" className="mt-4 font-heading text-section font-bold text-ink">
            {copy.heading}
            {copy.headingSecondLine && (
              <>
                <br />
                <span className="text-accent">{copy.headingSecondLine}</span>
              </>
            )}
          </h2>
        )}
        {copy.paragraphs.map((p) => (
          <p key={p} className="mt-4 text-step-1 text-ink-soft">
            {p}
          </p>
        ))}
        {copy.labels.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-8">
            {copy.labels.map((label) => (
              <li key={label} className="font-heading text-step-2 font-bold text-ink">
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}
