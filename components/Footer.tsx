import Link from 'next/link'
import { config, formatTime } from '@/lib/config'
import { FOOTER_LINKS } from '@/lib/navigation'
import { siteCopy } from '@/lib/page-content'
import { PhoneIcon } from './icons'
import Phone from './Phone'

const columnHeading = 'font-heading text-step-0 font-semibold text-ink'

function handle(url: string): string {
  return `@${new URL(url).pathname.replace(/\//g, '')}`
}

export default function Footer() {
  const year = new Date().getFullYear()
  const instagram = config.profiles.instagram ?? null

  return (
    <footer className="relative border-t border-line bg-bg">
      <div aria-hidden="true" className="strip-spectrum absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-page gap-10 px-4 pb-10 pt-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:pt-20">
        <div>
          <Link href="/" className="font-body text-step-1 font-bold uppercase tracking-[0.25em] text-ink">
            {config.displayName}
          </Link>
          <p className="mt-4 max-w-xs text-step--1 text-ink-soft">
            {siteCopy.footerBlurb} {config.tagline}
          </p>
        </div>

        <div>
          <h2 className={columnHeading}>Contact</h2>
          <ul className="mt-4 space-y-3 text-step--1 text-ink-soft">
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-accent" />
              <Phone className="text-ink-soft" />
            </li>
            {config.email && (
              <li>
                <a href={`mailto:${config.email}`} className="hover:text-ink">
                  {config.email}
                </a>
              </li>
            )}
            {config.hours?.map((h) => (
              <li key={h.day}>
                {h.day}: {formatTime(h.open)} to {formatTime(h.close)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={columnHeading}>Quick Links</h2>
          <ul className="mt-4 space-y-3 text-step--1">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-soft hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={columnHeading}>Service Areas</h2>
          <ul className="mt-4 space-y-3 text-step--1 text-ink-soft">
            {config.serviceAreas.map((a) => (
              <li key={a.slug}>{a.name}</li>
            ))}
            <li>
              <Link href="/service-areas" className="text-accent hover:underline">
                View All Areas <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-4 py-6 text-step--1 text-muted lg:px-8">
          <p>
            &copy; {year} {config.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-5">
            <Link href="/privacy-policy" className="hover:text-ink">
              Privacy Policy
            </Link>
            {instagram && (
              <a href={instagram} rel="noopener" target="_blank" className="hover:text-ink">
                {handle(instagram)}
              </a>
            )}
            <a href="https://www.alignandacquire.com" rel="noopener" target="_blank" className="hover:text-ink">
              Site by Align and Acquire
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
