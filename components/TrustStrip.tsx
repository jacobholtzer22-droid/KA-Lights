import Link from 'next/link'
import type { ReactNode } from 'react'
import { config } from '@/lib/config'
import { FeatureIcon, MapPinIcon, PhoneIcon, StepIcon } from './icons'
import Phone from './Phone'
import { StrataBadge } from './StrataCertification'

/**
 * Trust strip under the hero: the phone number, the service region from config,
 * app control, and year-round use, beside the round Strata Certified Installer badge.
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
      <div className="mx-auto flex max-w-page items-center gap-4 px-4 py-6 sm:gap-8 lg:px-8">
        <StrataBadge className="h-20 w-20 sm:h-24 sm:w-24" sizes="(min-width: 640px) 96px, 80px" />
        <ul className="grid min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-step-0 font-semibold text-ink">
            <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-site border border-line text-accent-ink">
              {item.icon}
            </span>
            <span className="min-w-0">{item.content}</span>
          </li>
        ))}
        </ul>
      </div>
    </section>
  )
}
