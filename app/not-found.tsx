import type { Metadata } from 'next'
import Link from 'next/link'
import { config } from '@/lib/config'

export const metadata: Metadata = {
  title: { absolute: `Page Not Found | ${config.displayName}` },
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="mx-auto max-w-page px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-page font-bold text-ink">Page not found</h1>
      <p className="mx-auto mt-4 max-w-measure text-ink-soft">That page does not exist. Head back to the homepage or get in touch.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-on-accent shadow-glow transition-[background-color,transform] hover:bg-accent-dark active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
          Home
        </Link>
        <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-6 py-3 font-semibold text-ink transition-[background-color,border-color,transform] hover:border-muted hover:bg-surface-raised active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
          Contact
        </Link>
      </div>
    </section>
  )
}
