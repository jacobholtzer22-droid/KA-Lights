import { homeCopy } from '@/lib/page-content'
import Section from './Section'

const DOTS = ['#FF3B3B', '#22C55E', '#3B82F6', '#FACC15', '#D946EF', '#2DD4FF', '#F4F6FB', '#22C55E', '#FF3B3B', '#3B82F6', '#FB923C']

/** "Total control in your pocket." The phone is a static decorative drawing, not a control. */
export default function AppSection() {
  const copy = homeCopy.app
  if (!copy.heading && !copy.body) return null
  return (
    <Section labelledBy={copy.heading ? 'app-heading' : undefined} label={copy.heading ? undefined : 'App control'}>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div aria-hidden="true" className="mx-auto w-full max-w-[16rem] rounded-[2.25rem] border-[8px] border-surface-raised bg-bg p-5 shadow-site">
          <p className="text-center font-body text-step--1 font-semibold uppercase tracking-[0.2em] text-ink">Scenes</p>
          <div className="mt-4 grid grid-cols-9 gap-1.5">
            {DOTS.flatMap((color, row) =>
              Array.from({ length: 9 }, (_, col) => <span key={`${row}-${col}`} className="aspect-square rounded-full" style={{ background: color, boxShadow: `0 0 5px -1px ${color}` }} />),
            )}
          </div>
        </div>
        <div>
          {copy.heading && (
            <h2 id="app-heading" className="font-heading text-section font-bold text-ink">
              {copy.heading}
            </h2>
          )}
          {copy.body && <p className="mt-4 text-step-1 text-ink-soft">{copy.body}</p>}
          {copy.bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {copy.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-ink-soft">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  )
}
