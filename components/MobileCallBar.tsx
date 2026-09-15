'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { config } from '@/lib/config'
import { QUOTE_CTA } from '@/lib/navigation'

/**
 * Sticky call and quote bar under 1024px, matching the current site. Hidden on
 * the contact page, where the form is the call to action. The body carries
 * matching bottom padding so the footer is never covered.
 */
export default function MobileCallBar() {
  const pathname = usePathname()
  if (pathname === '/contact') return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] gap-3 border-t border-line bg-bg p-3 lg:hidden">
      <a
        href={`tel:${config.phone}`}
        aria-label={`Call ${config.displayName} at ${config.phoneDisplay}`}
        className="flex min-h-[3rem] items-center justify-center gap-2 rounded-site border border-line px-5 font-semibold text-ink"
      >
        Call
      </a>
      <Link href={QUOTE_CTA.href} className="flex min-h-[3rem] items-center justify-center rounded-site bg-accent font-semibold text-on-accent">
        {QUOTE_CTA.label}
      </Link>
    </div>
  )
}
