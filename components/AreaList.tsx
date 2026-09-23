import Link from 'next/link'
import { config } from '@/lib/config'
import { focusable } from '@/lib/ui'

/**
 * Service area cities as tiles. A city links to its own page only when it has
 * real, city-specific content in config (`cityPage`); the rest are plain text,
 * because a page per city with nothing specific to say is a thin page.
 */
export default function AreaList() {
  const areas = config.serviceAreas
  if (areas.length === 0) return null
  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {areas.map((a) => (
        <li key={a.slug} className="rounded-card border border-line bg-bg text-center text-step-1 text-ink">
          {a.cityPage ? (
            <Link href={`/service-areas/${a.slug}`} className={`block px-4 py-4 transition-colors hover:text-accent-ink ${focusable}`}>
              {a.name}
            </Link>
          ) : (
            <span className="block px-4 py-4">{a.name}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
