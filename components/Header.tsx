import Link from 'next/link'
import { config } from '@/lib/config'
import { NAV, QUOTE_CTA } from '@/lib/navigation'
import { btnPrimary, focusable, linkQuiet } from '@/lib/ui'
import { PhoneIcon } from './icons'
import MobileMenu from './MobileMenu'
import Phone from './Phone'

/**
 * Sticky header. It sits outside every dark band, so it keeps the light ground
 * the whole way down the page and never changes color under the visualizer or
 * the Design Ideas band (decision 45). The background stays fully opaque: a
 * transparent or translucent bar would put dark nav text over a night
 * photograph as soon as it crossed one.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg">
      <div className="relative mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <Link href="/" className={`font-body text-step-1 font-bold uppercase tracking-[0.25em] text-ink ${focusable}`}>
          {config.displayName}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={`text-step--1 font-medium ${linkQuiet}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <span className="flex items-center gap-2 text-step--1">
            <PhoneIcon className="h-4 w-4 text-accent-ink" />
            <Phone className="text-ink" />
          </span>
          <Link href={QUOTE_CTA.href} className={`${btnPrimary} px-5 py-2 text-step--1`}>
            {QUOTE_CTA.label}
          </Link>
        </div>
        <MobileMenu />
      </div>
      <div aria-hidden="true" className="strip-spectrum" />
    </header>
  )
}
