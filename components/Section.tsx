import type { ReactNode } from 'react'
import { darkVars } from '@/lib/theme-vars'

/** base: the page ground. alt: one step lighter, alternated section by section on the homepage. */
export type SectionTone = 'base' | 'alt'

/** Standard page section: spectrum strip on top, consistent vertical rhythm, page container. */
export default function Section({
  children,
  id,
  labelledBy,
  label,
  tight = false,
  tone = 'base',
  dark = false,
  className = '',
}: {
  children: ReactNode
  id?: string
  labelledBy?: string
  label?: string
  tight?: boolean
  tone?: SectionTone
  /** Keep the dark palette inside this section on the light page (decision 44). */
  dark?: boolean
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      style={dark ? darkVars : undefined}
      className={`relative ${tone === 'alt' ? 'bg-bg-alt' : 'bg-bg'} ${dark ? 'text-ink-soft' : ''} ${tight ? 'py-12 md:py-16' : 'py-16 md:py-24'} ${className}`}
    >
      <div aria-hidden="true" className="strip-spectrum absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-page px-4 lg:px-8">{children}</div>
    </section>
  )
}
