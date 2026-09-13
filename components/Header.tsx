import Link from 'next/link'
import { config } from '@/lib/config'
import Phone from './Phone'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-primary-dark">
          {config.displayName}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-ink hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Phone className="hidden text-sm text-primary-dark sm:inline" />
          <Link
            href="/contact"
            className="rounded-site bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:bg-accent-dark"
          >
            Free Quote
          </Link>
        </div>
      </div>
      <nav aria-label="Main mobile" className="flex justify-center gap-5 border-t border-line px-4 py-2 md:hidden">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="text-sm font-medium text-ink hover:text-primary">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
