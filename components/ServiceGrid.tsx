import Link from 'next/link'
import { config } from '@/lib/config'

interface Props {
  heading?: string
  /** Hide one service (used on service pages to show "other services"). */
  exclude?: string
}

/**
 * Services as a numbered list with heavy rules, not a row of floating cards.
 * Each row is one link: numeral, name, description, price when known.
 */
export default function ServiceGrid({ heading = 'Our Services', exclude }: Props) {
  const services = config.services.filter((s) => s.slug !== exclude)
  if (services.length === 0) return null
  return (
    <section className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
      <h2 className="font-heading text-3xl font-bold text-primary-dark md:text-4xl">{heading}</h2>
      <ol className="mt-10 border-t-2 border-primary-dark">
        {services.map((s, i) => (
          <li key={s.slug} className="border-b border-line">
            <Link href={`/services/${s.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:items-baseline md:gap-8">
              <span className="font-heading text-sm font-semibold tabular-nums text-accent md:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-2xl font-semibold text-primary-dark group-hover:text-accent md:col-span-4">{s.name}</h3>
              <p className="text-base leading-relaxed text-muted md:col-span-5">{s.shortDescription}</p>
              <span className="text-sm font-semibold text-ink md:col-span-2 md:text-right">
                {s.priceFrom !== null ? `From $${s.priceFrom}` : 'Quoted on site'}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
