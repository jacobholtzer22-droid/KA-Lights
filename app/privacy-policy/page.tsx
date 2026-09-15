import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import Phone from '@/components/Phone'
import { config } from '@/lib/config'
import { contentExists, loadContent, readFrontmatter } from '@/lib/content'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'privacy-policy.mdx'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
]

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({ kind: 'privacy', path: '/privacy-policy', description: fm.description }).metadata
}

/**
 * Generated from config so the legal name, site, and contact details can never
 * be stale copy from another client. content/privacy-policy.mdx, if present,
 * renders above it for any client-specific additions.
 */
export default async function PrivacyPolicyPage() {
  const extra = contentExists(CONTENT) ? await loadContent(CONTENT) : null
  const host = new URL(config.domain).host
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader title="Privacy Policy" />
      <article className="mx-auto max-w-3xl px-4 pb-16 text-step-0 leading-relaxed text-ink-soft lg:px-8">
        {extra?.content}

        <h2 className="mt-10 font-heading text-2xl font-bold text-ink">Who we are</h2>
        <p className="mt-4">
          This website, {host}, is operated by {config.legalName} (&quot;{config.displayName}&quot;). This policy explains what
          information the site collects and how it is used.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold text-ink">Information you send us</h2>
        <p className="mt-4">
          When you submit the contact form, we receive the name, phone number, email address, and message you enter, along
          with basic technical details such as your IP address and browser type. We use this information to respond to your
          request, prepare a quote, and schedule work. We do not sell it.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold text-ink">Text messages</h2>
        <p className="mt-4">
          If you check the consent box on the contact form, {config.displayName} may send you text messages about your request.
          Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to any message to opt out, or
          reply HELP for assistance. Mobile information is not shared with third parties for marketing purposes.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold text-ink">Service providers</h2>
        <p className="mt-4">
          Form submissions are delivered to us through a customer relationship platform operated on our behalf by Align and
          Acquire, which stores them so we can follow up. The site is hosted by a commercial hosting provider, which may
          log standard request data.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold text-ink">Cookies and analytics</h2>
        <p className="mt-4">
          This site does not set tracking cookies of its own. If analytics or advertising tags are added in the future, this
          policy will be updated to describe them.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-bold text-ink">Your choices</h2>
        <p className="mt-4">
          You can ask us to correct or delete the information you sent us at any time. Call <Phone /> {config.email ? (
            <>
              or email{' '}
              <a href={`mailto:${config.email}`} className="font-medium text-primary underline-offset-2 hover:underline">
                {config.email}
              </a>
            </>
          ) : null}{' '}
          and we will take care of it.
        </p>
      </article>
    </>
  )
}
