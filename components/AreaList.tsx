import Link from 'next/link'
import { config } from '@/lib/config'
import { focusable } from '@/lib/ui'

/**
 * Service area cities as cards on the /service-areas index.
 *
 * A city links to its own page only when it qualifies (`hasCityPage`, decision
 * 50); the rest are plain text, because a page per city with nothing specific
 * to say is a thin page. A qualifying card shows what that page actually holds,
 * so the index reads as a directory rather than a list of identical words.
 */
export default function AreaList() {
  const areas = config.serviceAreas
  if (areas.length === 0) return null
  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {areas.map((a) => (
        <li key={a.slug} className="rounded-card border border-line bg-bg text-step-1 text-ink">
          {a.hasCityPage && a.cityPage?.localDetail ? (
            <Link
              href={`/service-areas/${a.slug}`}
              className={`flex h-full min-h-[44px] flex-col gap-1 px-4 py-4 transition-colors hover:text-accent-ink ${focusable}`}
            >
              <span className="font-semibold">{a.name}</span>
              <span className="text-step--1 text-muted">
                {a.cityPage.localDetail.county} County, {a.cityPage.localDetail.neighborhoods.length} neighborhoods
              </span>
            </Link>
          ) : (
            <span className="block px-4 py-4 text-center">{a.name}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
