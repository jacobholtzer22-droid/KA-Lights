import { config } from '@/lib/config'

/**
 * Visible reviews. Renders only when config.reviews is non-empty, which is the
 * same condition under which lib/schema.ts emits Review and aggregateRating,
 * so schema never claims a review the visitor cannot see.
 */
export default function Reviews() {
  if (config.reviews.length === 0) return null
  return (
    <section className="mx-auto max-w-page px-4 py-16 md:py-24 lg:px-8">
      <h2 className="font-heading text-section font-bold text-ink">What Customers Say</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {config.reviews.map((r) => (
          <blockquote key={`${r.author}-${r.url}`} className="rounded-card border border-line bg-surface p-8">
            <p className="text-step--1 font-semibold text-accent-ink" aria-label={`${r.rating} out of 5 stars`}>
              {'★'.repeat(Math.round(r.rating))}
            </p>
            <p className="mt-3 max-w-measure text-step-0 text-ink-soft">{r.text}</p>
            <footer className="mt-4 text-step--1 text-muted">
              {r.author},{' '}
              <a href={r.url} rel="noopener nofollow" target="_blank" className="rounded-site underline-offset-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
                via {r.source}
              </a>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
