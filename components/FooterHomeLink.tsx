'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { linkQuiet } from '@/lib/ui'

/**
 * "Home" in the footer quick links. A real anchor with a visible accessible
 * name, the site's usual focus ring, and aria-current="page" on the homepage
 * itself. Client-side only for the pathname; everything else is static.
 */
export default function FooterHomeLink({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  return (
    <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} className={`${linkQuiet} ${className}`}>
      Home
    </Link>
  )
}
