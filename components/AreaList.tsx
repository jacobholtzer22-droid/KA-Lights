import { config } from '@/lib/config'

/** Service area cities as tiles. No links: there are no per-city pages. */
export default function AreaList() {
  const areas = config.serviceAreas
  if (areas.length === 0) return null
  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {areas.map((a) => (
        <li key={a.slug} className="rounded-card border border-line bg-bg px-4 py-4 text-center text-step-1 text-ink">
          {a.name}
        </li>
      ))}
    </ul>
  )
}
