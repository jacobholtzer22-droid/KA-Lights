import Link from 'next/link'
import { config } from '@/lib/config'
import { pageH1, pageIntro } from '@/lib/headings'
import { QUOTE_CTA } from '@/lib/navigation'
import { homeCopy } from '@/lib/page-content'
import Highlight from './Highlight'
import { PhoneIcon } from './icons'
import { isPlaceholder, isRendering } from '@/lib/images'
import { darkVars } from '@/lib/theme-vars'
import { btnOutline, btnPrimary } from '@/lib/ui'
import Img from './Img'
import PlaceholderChip from './PlaceholderChip'
import RenderingLabel from './RenderingLabel'

/**
 * Homepage hero. The brand line keeps the current site's display treatment as
 * a styled <p>; the page's single <h1> is the service-plus-city line directly
 * under it. Overlays are divs, never images.
 *
 * The hero sits on a night photograph, so it keeps the dark palette on a light
 * page (decision 44): darkVars redefines every token for this subtree, which is
 * why the buttons, the trust dots and the rendering label need no dark variant.
 */
export default function Hero() {
  const copy = homeCopy.hero
  const hero = config.images.hero

  return (
    <section
      style={darkVars}
      className="relative isolate flex min-h-[90vh] items-center overflow-hidden bg-bg text-ink-soft"
      {...(hero && isRendering(hero) ? { 'data-rendering-frame': '' } : {})}
    >
      {hero && <Img name={hero} priority sizes="100vw" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
      {hero && isPlaceholder(hero) && <PlaceholderChip position="below-header" />}
      {hero && isRendering(hero) && <RenderingLabel position="hero" />}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'var(--hero-scrim-flat)' }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'var(--hero-scrim-side)' }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: 'var(--hero-scrim-bottom)' }} />

      <div className="mx-auto w-full max-w-page px-4 pb-16 pt-24 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="max-w-3xl">
          <p className="font-heading text-display font-bold text-ink">
            <Highlight text={copy.brandLine.text} highlight={copy.brandLine.highlight} />
          </p>
          <h1 className="mt-6 font-body text-step-1 font-semibold text-ink md:text-step-2">{pageH1.home()}</h1>
          <p className="mt-4 max-w-measure text-step-1 text-ink-soft">
            {pageIntro()}
            {copy.lead && ` ${copy.lead}`}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href={QUOTE_CTA.href} className={`${btnPrimary} px-8 py-4 text-step-1`}>
              {QUOTE_CTA.label}
            </Link>
            <a
              href={`tel:${config.phone}`}
              className={`${btnOutline} px-8 py-4 text-step-1`}
            >
              <PhoneIcon className="h-5 w-5 text-accent-ink" />
              {config.phoneDisplay}
            </a>
          </div>

          {copy.trustLabels.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-6 text-step--1 font-medium text-muted">
              {copy.trustLabels.map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent shadow-glow" />
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
