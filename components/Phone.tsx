import { config } from '@/lib/config'
import { focusRing } from '@/lib/ui'

/**
 * The only way a phone number appears on the site. Renders the derived display
 * form inside a tel: link built from the E.164 value, so no number is ever
 * typed into prose or markup.
 */
export default function Phone({ className = '', label }: { className?: string; label?: string }) {
  return (
    <a href={`tel:${config.phone}`} className={`whitespace-nowrap rounded-site font-semibold underline-offset-2 transition-colors hover:underline ${focusRing} ${className}`}>
      {label ?? config.phoneDisplay}
    </a>
  )
}
