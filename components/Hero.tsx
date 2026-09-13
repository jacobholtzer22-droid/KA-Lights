import Link from 'next/link'
import { config } from '@/lib/config'
import theme from '@/theme'
import Img from './Img'
import Phone from './Phone'

/**
 * Homepage hero. Owns the page's single <h1>. Layout comes from
 * theme.heroVariant; every word comes from config.
 *
 * 'full-bleed': the client photograph under a dark scrim, headline and phone
 * CTA left-aligned in the lower third. 'split': large photo one side, oversized
 * type the other, for photography that cannot carry a full bleed. With no hero
 * image configured, 'split' renders type only.
 */
export default function Hero() {
  const h1 = `${config.primaryService.name} in ${config.primaryCity}, ${config.primaryState}`
  const hero = config.images.hero

  const cta = (dark: boolean) => (
    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
      <Link href="/contact" className="rounded-site bg-accent px-6 py-3.5 text-base font-semibold text-on-accent hover:bg-accent-dark">
        Request a Free Quote
      </Link>
      <span className={`text-base ${dark ? 'text-on-primary' : 'text-ink'}`}>
        or call <Phone className={dark ? 'text-on-primary' : 'text-primary-dark'} />
      </span>
    </div>
  )

  if (theme.heroVariant === 'full-bleed' && hero) {
    return (
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden bg-primary-dark text-on-primary">
        <Img name={hero} priority sizes="100vw" className="absolute inset-0 z-0 h-full w-full object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(180deg, rgb(0 0 0 / 0.15) 0%, rgb(0 0 0 / 0.45) 45%, rgb(0 0 0 / 0.78) 100%)' }}
        />
        <div className="relative z-10 mx-auto w-full max-w-page px-4 pb-16 pt-40 sm:px-6 md:pb-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-85">{config.displayName}</p>
          <h1 className="mt-4 max-w-4xl font-heading text-hero font-bold">{h1}</h1>
          <p className="mt-6 max-w-2xl text-lg opacity-90 md:text-xl">{config.tagline}</p>
          {cta(true)}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-bg">
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-5 md:py-28">
        <div className="md:col-span-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{config.displayName}</p>
          <h1 className="mt-4 font-heading text-hero font-bold text-primary-dark">{h1}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{config.tagline}</p>
          {cta(false)}
        </div>
        {hero && (
          <div className="overflow-hidden rounded-site shadow-site md:col-span-2">
            <Img name={hero} priority sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] h-auto w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
