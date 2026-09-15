import Link from 'next/link'
import { config } from '@/lib/config'

interface Props {
  heading?: string
  /** Hide one service (used on service pages to show "other services"). */
  exclude?: string
}

/** Services as a ruled list. Each row is one link: numeral, name, description, price when published. */
export default function ServiceGrid({ heading = 'Our Services', exclude }: Props) {
  const services = config.services.filter((s) => s.slug !== exclude)
  if (services.length === 0) return null
  return (
    <section className="mx-auto max-w-page px-4 py-16 md:py-24 lg:px-8">
      <h2 className="font-heading text-section font-bold text-ink">{heading}</h2>
      <ol className="mt-10 border-t border-line">
        {services.map((s, i) => (
          <li key={s.slug} className="border-b border-line">
            <Link href={`/services/${s.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:items-baseline md:gap-8">
              <span className="font-heading text-step--1 font-semibold tabular-nums text-accent md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-heading text-step-2 font-semibold text-ink group-hover:text-accent md:col-span-4">{s.name}</h3>
              <p className="text-ink-soft md:col-span-5">{s.shortDescription}</p>
              <span className="text-step--1 font-semibold text-ink md:col-span-2 md:text-right">
                {s.priceFrom !== null ? `From $${s.priceFrom}` : 'Request a quote'}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
