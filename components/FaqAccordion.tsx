import type { Faq } from '@/lib/config-schema'

/**
 * Native <details> accordion, no JavaScript. The questions rendered here are the
 * same objects lib/schema.ts turns into FAQPage markup, so visible content and
 * schema cannot drift. Pass heading={null} when the page header already names it.
 */
export default function FaqAccordion({ faqs, heading = 'Frequently Asked Questions' }: { faqs: readonly Faq[]; heading?: string | null }) {
  if (faqs.length === 0) return null
  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 md:pb-24 lg:px-8">
      {heading && <h2 className="mb-6 font-heading text-step-4 font-bold text-ink">{heading}</h2>}
      <div className="space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-card border border-line bg-surface px-6 py-5">
            <summary className="cursor-pointer list-none font-heading text-step-1 font-semibold text-ink">
              <span className="flex items-center justify-between gap-4">
                {f.q}
                <span aria-hidden="true" className="text-accent group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
