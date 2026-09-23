import Link from 'next/link'
import type { ReactNode } from 'react'
import { config } from '@/lib/config'
import { FeatureIcon, MapPinIcon, PhoneIcon, StepIcon } from './icons'
import Phone from './Phone'

/**
 * Trust strip under the hero: the phone number, the service region from config,
 * app control, and year-round use.
 */
export default function TrustStrip() {
  const cities = config.serviceAreas.length
  const items: { icon: ReactNode; content: ReactNode }[] = [
    { icon: <PhoneIcon className="h-5 w-5" />, content: <Phone className="text-ink" /> },
    {
      icon: <MapPinIcon className="h-5 w-5" />,
      content: (
        <Link href="/service-areas" className="underline-offset-4 hover:underline">
          Serving {cities} Inland Empire {cities === 1 ? 'city' : 'cities'}
        </Link>
      ),
    },
    { icon: <StepIcon name="app" className="h-5 w-5" />, content: 'App-controlled' },
    { icon: <FeatureIcon name="season" className="h-5 w-5" />, content: 'Year-round lighting' },
  ]
  return (
    <section aria-label="At a glance" className="border-y border-line bg-bg-alt">
      <ul className="mx-auto grid max-w-page grid-cols-2 gap-x-4 gap-y-4 px-4 py-6 md:grid-cols-4 lg:px-8">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-step-0 font-semibold text-ink">
            <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-site border border-line text-accent-ink">
              {item.icon}
            </span>
            <span className="min-w-0">{item.content}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
