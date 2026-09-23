import type { Display } from '@/lib/page-content'
import Highlight from './Highlight'

/**
 * Interior page header. Owns the page's single <h1>, which always carries the
 * service and, where natural, the city. When the current site shows a short
 * display headline ("How It Works"), it keeps its size and position as a
 * styled <p>, and the H1 sits under it as a native-looking subhead.
 */
export default function PageHeader({
  display,
  highlightClass = 'text-accent-ink',
  title,
  intro,
  lead,
}: {
  display?: Display | null
  highlightClass?: string
  title: string
  intro?: string
  lead?: string | null
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'var(--page-glow)' }} />
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center md:pb-16 md:pt-24 lg:px-8">
        {display ? (
          <>
            <p className="font-heading text-page font-bold text-ink">
              <Highlight text={display.text} highlight={display.highlight} className={highlightClass} />
            </p>
            <h1 className="mt-5 font-body text-step-1 font-semibold text-ink md:text-step-2">{title}</h1>
          </>
        ) : (
          <h1 className="font-heading text-page font-bold text-ink">{title}</h1>
        )}
        {intro && <p className="mx-auto mt-4 max-w-measure text-step-1 text-ink-soft">{intro}</p>}
        {lead && <p className="mx-auto mt-3 max-w-measure text-step-1 text-ink-soft">{lead}</p>}
      </div>
    </section>
  )
}
