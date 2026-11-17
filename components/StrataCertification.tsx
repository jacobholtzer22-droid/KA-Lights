import Img from './Img'

/**
 * Strata Certified Installer marks, supplied by the client in the ops intake.
 * These are trust badges, not job photos: never the logo, hero or a gallery image.
 * The round badge (5274.jpg) sits with the trust points and in the footer; the wide
 * banner (5275.jpg) sits with the permanent lighting content. Alt text lives in
 * public/images/manifest.json.
 */
export const STRATA_BADGE = '5274.jpg'
export const STRATA_BANNER = '5275.jpg'

export function StrataBadge({ className = 'h-24 w-24', sizes = '96px' }: { className?: string; sizes?: string }) {
  return <Img name={STRATA_BADGE} sizes={sizes} className={`${className} shrink-0 rounded-full object-contain`} />
}

export function StrataBanner({ className = '', sizes = '(min-width: 640px) 28rem, 100vw' }: { className?: string; sizes?: string }) {
  return (
    <div className={`overflow-hidden rounded-site ${className}`}>
      <Img name={STRATA_BANNER} sizes={sizes} className="block h-auto w-full" />
    </div>
  )
}
