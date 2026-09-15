'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { NAV, QUOTE_CTA } from '@/lib/navigation'

/**
 * Mobile navigation as a native <details> disclosure, so it opens and closes
 * without JavaScript. With JavaScript it also closes on navigation.
 */
export default function MobileMenu() {
  const menu = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()
  const close = () => {
    if (menu.current) menu.current.open = false
  }
  useEffect(close, [pathname])

  return (
    <details ref={menu} className="group lg:hidden">
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-site text-ink">
        <span className="sr-only">Menu</span>
        <svg viewBox="0 0 24 24" className="h-6 w-6 group-open:hidden" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg viewBox="0 0 24 24" className="hidden h-6 w-6 group-open:block" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </summary>
      <nav aria-label="Mobile" className="absolute inset-x-0 top-full border-b border-line bg-surface px-4 pb-6 pt-2">
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={close} className="block py-3 text-step-1 text-ink-soft hover:text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={QUOTE_CTA.href} onClick={close} className="mt-4 block rounded-full bg-accent py-3 text-center font-semibold text-on-accent">
          {QUOTE_CTA.label}
        </Link>
      </nav>
    </details>
  )
}
