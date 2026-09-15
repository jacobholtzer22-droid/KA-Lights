import Link from 'next/link'
import { config } from '@/lib/config'
import { NAV, QUOTE_CTA } from '@/lib/navigation'
import { PhoneIcon } from './icons'
import MobileMenu from './MobileMenu'
import Phone from './Phone'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg">
      <div className="relative mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <Link href="/" className="font-body text-step-1 font-bold uppercase tracking-[0.25em] text-ink">
          {config.displayName}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-step--1 font-medium text-ink-soft hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <span className="flex items-center gap-2 text-step--1">
            <PhoneIcon className="h-4 w-4 text-accent" />
            <Phone className="text-ink" />
          </span>
          <Link href={QUOTE_CTA.href} className="rounded-full bg-accent px-5 py-2 text-step--1 font-semibold text-on-accent shadow-glow hover:bg-accent-dark">
            {QUOTE_CTA.label}
          </Link>
        </div>
        <MobileMenu />
      </div>
      <div aria-hidden="true" className="strip-spectrum" />
    </header>
  )
}
