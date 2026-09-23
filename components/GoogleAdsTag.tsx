import Script from 'next/script'
import { ADS, GTAG_SRC } from '@/lib/tracking'
import TelConversion from './TelConversion'

/**
 * The Google Ads base tag, on every page, plus the sitewide click-to-call
 * listener. Renders nothing at all when the build carries no tag (every preview
 * build, every `next dev`), so a preview cannot load gtag.js or fire anything.
 *
 * A server component on purpose: next/script with strategy "afterInteractive"
 * from inside a CLIENT component ends up in the layout JS chunk and never in the
 * HTML document, which makes it invisible to a build-time check and easy to
 * misdiagnose later. Rendered from the server tree, the same strategy puts a
 * real <script> in the exported HTML, which is what verify check 24 inspects.
 *
 * Works under output: 'export' because both scripts are plain client-side
 * scripts; nothing here needs a server at request time.
 */
export default function GoogleAdsTag() {
  if (!ADS) return null
  return (
    <>
      <Script id="gtag-src" src={GTAG_SRC(ADS.tagId)} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ADS.tagId}');`}
      </Script>
      <TelConversion />
    </>
  )
}
