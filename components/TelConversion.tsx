'use client'

import { useEffect } from 'react'
import { ADS, reportConversion } from '@/lib/tracking'

/**
 * Click to Call, sitewide, from ONE delegated listener on the document.
 *
 * Not Google's copy-paste "Click" snippet, and not a handler per link: there are
 * tel: links in the header, the mobile menu, the fixed call bar, the footer and
 * on /contact, and more will be added. A listener bound to each link at mount
 * covers only the links that existed at that moment; one delegated listener
 * covers every tel: link on every page for the life of the document, including
 * anything React renders later.
 *
 * Capture phase, so a link whose own handler calls stopPropagation (none today)
 * still reports. The handler never calls preventDefault: the dial must happen
 * exactly as it would with no tracking at all. Reporting is fire-and-forget, so
 * a navigation that follows immediately cannot be delayed by it.
 *
 * Renders nothing, and is only ever mounted by GoogleAdsTag, which itself
 * renders nothing in a preview build.
 */
export default function TelConversion() {
  useEffect(() => {
    const ads = ADS
    if (!ads) return
    const onClick = (event: MouseEvent) => {
      const target = event.target
      const el = target instanceof Element ? target : target instanceof Node ? target.parentElement : null
      if (el?.closest('a[href^="tel:"]')) reportConversion(ads.clickToCallLabel)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
