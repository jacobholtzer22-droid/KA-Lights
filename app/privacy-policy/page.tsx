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
      <article className="mx-auto max-w-3xl px-4 pb-16 text-step-0 text-ink-soft [&_p]:max-w-measure lg:px-8">
        {extra?.content}

        <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">Who we are</h2>
        <p className="mt-4">
          This website, {host}, is operated by {config.legalName} (&quot;{config.displayName}&quot;). This policy explains what
          information the site collects and how it is used.
        </p>

        <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">Information you send us</h2>
        <p className="mt-4">
          When you submit the contact form, we receive the name, phone number, email address, and message you enter, along
          with basic technical details such as your IP address and browser type. We use this information to respond to your
          request, prepare a quote, and schedule work. We do not sell it.
        </p>

        <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">Text messages</h2>
        <p className="mt-4">
          If you check the consent box on the contact form, {config.displayName} may send you text messages about your request.
          Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to any message to opt out, or
          reply HELP for assistance. Mobile information is not shared with third parties for marketing purposes.
        </p>

        <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">Service providers</h2>
        <p className="mt-4">
          Form submissions are delivered to us through a customer relationship platform operated on our behalf by Align and
          Acquire, which stores them so we can follow up. The site is hosted by a commercial hosting provider, which may
          log standard request data.
        </p>

        {config.googleAds ? (
          <>
            <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">Advertising cookies</h2>
            <p className="mt-4">
              This site uses Google Ads conversion tracking. Google&apos;s tag (gtag.js) loads on every page and may set
              cookies in your browser. If you reached the site from a Google ad, it also reads the click identifier Google
              adds to the link you followed. Its purpose is to tell {config.displayName} which ads lead to contact, and
              Google uses the same data for ad measurement and optimization under its own privacy policy.
            </p>
            <p className="mt-4">
              Two actions are reported, each as a count: tapping a phone number link on this site, and submitting the
              contact form when our server accepts it. What you type into the form is not sent to Google. We do not use
              enhanced conversions, which would send Google a scrambled copy of your name, phone number, or email address.
              No dollar value is attached to either action.
            </p>
            <p className="mt-4">
              Nothing else on this site tracks you. There is no analytics product, no social media pixel, and no
              advertising tag from any other company.
            </p>
            <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">How to opt out</h2>
            <p className="mt-4">
              You can turn off personalized Google advertising in Google&apos;s own settings at{' '}
              <a href="https://myadcenter.google.com" className="font-medium text-primary underline-offset-2 hover:underline">
                myadcenter.google.com
              </a>
              , and you can block the tag entirely by blocking third-party cookies or turning on your browser&apos;s
              tracking protection. Nothing on this site depends on it: every page, the phone number, and the contact form
              work exactly the same with the tag blocked.
            </p>
            <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">California privacy rights</h2>
            <p className="mt-4">
              If you are a California resident, you have the right to know what personal information we have collected
              about you, to ask us to delete or correct it, to opt out of its sale or of its sharing for cross-context
              behavioral advertising, and not to be treated differently for exercising any of those rights. We do not sell
              your personal information. The advertising cookies described above can count as sharing under California
              law, which is what the opt-out section covers. To make any other request, call <Phone />
              {config.email ? (
                <>
                  {' '}
                  or email{' '}
                  <a href={`mailto:${config.email}`} className="font-medium text-primary underline-offset-2 hover:underline">
                    {config.email}
                  </a>
                </>
              ) : null}
              , and tell us what you would like us to do.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">Cookies and analytics</h2>
            <p className="mt-4">
              This site does not set tracking cookies of its own. If analytics or advertising tags are added in the future,
              this policy will be updated to describe them.
            </p>
          </>
        )}

        <h2 className="mt-10 font-heading text-step-2 font-bold text-ink">Your choices</h2>
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
