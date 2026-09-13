import Link from 'next/link'
import { config } from '@/lib/config'
import Phone from './Phone'

export default function CtaBand({ heading }: { heading?: string }) {
  return (
    <section className="border-t-2 border-primary-dark bg-primary-soft">
      <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:py-24">
        <div>
          <h2 className="font-heading text-3xl font-bold text-primary-dark md:text-4xl">
            {heading ?? `Ready to get started in ${config.primaryCity}?`}
          </h2>
          <p className="mt-3 text-base text-muted md:text-lg">
            Call <Phone className="text-primary-dark" /> or send a message and we will get back to you with a quote.
          </p>
        </div>
        <Link href="/contact" className="rounded-site bg-accent px-6 py-3.5 text-base font-semibold text-on-accent hover:bg-accent-dark">
          Request a Free Quote
        </Link>
      </div>
    </section>
  )
}
