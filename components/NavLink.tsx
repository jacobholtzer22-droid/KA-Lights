'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { linkQuiet } from '@/lib/ui'

/**
 * A navigation link that knows whether it is the current page.
 *
 * One component for the header, the mobile menu and the footer, so
 * aria-current is decided in exactly one place and cannot drift between them.
 * It is a real anchor (next/link renders <a>), so it is keyboard focusable,
 * middle-clickable and openable in a new tab; the site's standard focus ring
 * comes from linkQuiet.
 *
 * "/" matches only the homepage. Every other href also matches its children,
 * so a future /service-areas/corona keeps "Service Areas" marked current.
 */
export function isCurrent(pathname: string | null, href: string): boolean {
  if (!pathname) return false
  const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`)
}

export default function NavLink({
  href,
  children,
  className = '',
  onClick,
}: {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const current = isCurrent(usePathname(), href)
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={current ? 'page' : undefined}
      className={`${linkQuiet} ${current ? 'text-ink' : ''} ${className}`}
    >
      {children}
    </Link>
  )
}
