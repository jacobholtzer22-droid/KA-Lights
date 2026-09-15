import type { ReactNode } from 'react'

/** Standard page section: spectrum strip on top, consistent vertical rhythm, page container. */
export default function Section({
  children,
  id,
  labelledBy,
  label,
  tight = false,
  className = '',
}: {
  children: ReactNode
  id?: string
  labelledBy?: string
  label?: string
  tight?: boolean
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} aria-label={label} className={`relative ${tight ? 'py-12 md:py-16' : 'py-16 md:py-24'} ${className}`}>
      <div aria-hidden="true" className="strip-spectrum absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-page px-4 lg:px-8">{children}</div>
    </section>
  )
}
