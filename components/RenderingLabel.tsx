import { RENDERING_LABEL } from '@/lib/images'

/**
 * Visible disclosure on every AI design rendering. Mandatory: re-encoding
 * drops the file's C2PA manifest, so this label is the disclosure. Verify
 * check 23 fails the build when a rendering appears without it.
 *
 * aria-hidden because the image alt already starts "Rendering of"; screen
 * readers get the disclosure there, sighted visitors get it here.
 */
export default function RenderingLabel({
  position = 'bottom-right',
  text = RENDERING_LABEL,
}: {
  position?: 'bottom-right' | 'bottom-left' | 'hero' | 'top-right' | 'visualizer'
  /** Must still contain "design rendering": verify check 23 matches on it. */
  text?: string
}) {
  // 'hero': top-right below lg, so the label is on the first screen at phone and
  // tablet widths. There the hero's bottom edge falls below the fold (phones) or
  // under the fixed MobileCallBar, which is also lg:hidden (tablets). Bottom-right from lg up.
  const place =
    position === 'hero'
      ? 'right-3 top-3 lg:bottom-3 lg:top-auto'
      : position === 'top-right'
        ? 'right-3 top-3'
        : position === 'visualizer'
          ? // Top-right on phones, where the label sits on the image itself; bottom-left from lg,
            // where the scene panel covers the top-right corner of the full-bleed stage.
            'right-3 top-3 lg:bottom-3 lg:left-3 lg:right-auto lg:top-auto'
        : position === 'bottom-left'
          ? 'bottom-3 left-3'
          : 'bottom-3 right-3'
  return (
    <p
      aria-hidden="true"
      data-rendering-label=""
      className={`pointer-events-none absolute ${place} z-10 rounded-full border border-line bg-bg px-3 py-1 text-step--1 font-semibold text-ink`}
    >
      {text}
    </p>
  )
}
