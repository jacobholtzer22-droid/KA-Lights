'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { config } from '@/lib/config'
import { QUOTE_CTA } from '@/lib/navigation'
import { btnOutlineSquare, btnPrimarySquare } from '@/lib/ui'

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
        className={`${btnOutlineSquare} min-h-[3rem] px-5`}
      >
        Call
      </a>
      <Link href={QUOTE_CTA.href} className={`${btnPrimarySquare} min-h-[3rem]`}>
        {QUOTE_CTA.label}
      </Link>
    </div>
  )
}
