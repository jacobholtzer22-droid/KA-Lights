import Link from 'next/link'
import { QUOTE_CTA } from '@/lib/navigation'
import Phone from './Phone'

/** Not used on the current page set (the current site has no closing call-to-action bands). Kept claim-free for reuse. */
export default function CtaBand({ heading }: { heading: string }) {
  return (
    <section className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-8 px-4 py-16 md:flex-row md:items-center md:py-24 lg:px-8">
        <div>
          <h2 className="font-heading text-section font-bold text-ink">{heading}</h2>
          <p className="mt-3 text-step-1 text-ink-soft">
            Call <Phone className="text-ink" /> or send the form to request a quote.
          </p>
        </div>
        <Link href={QUOTE_CTA.href} className="rounded-full bg-accent px-6 py-3.5 font-semibold text-on-accent hover:bg-accent-dark">
          {QUOTE_CTA.label}
        </Link>
      </div>
    </section>
  )
}
