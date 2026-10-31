import Link from 'next/link'
import type { ReactNode } from 'react'
import { config } from '@/lib/config'
import { getImage, isRendering } from '@/lib/images'
import { darkVars } from '@/lib/theme-vars'
import { QUOTE_CTA } from '@/lib/navigation'
import { homeCopy } from '@/lib/page-content'
import { btnPrimary } from '@/lib/ui'
import Eyebrow from './Eyebrow'
import Highlight from './Highlight'
import SceneVisualizer, { type VisualizerScene } from './SceneVisualizer'

/**
 * Server wrapper for the color visualizer. visualizer.mode in site.config.ts
 * picks the illustration (default) or the photo series (technique A).
 *
 * The stage is night photography edge to edge, so the section keeps the dark
 * palette on the light page (decision 44). Its copy, buttons and scene panel
 * read the tokens darkVars redefines, so none of them need a dark variant.
 */
export default function VisualizerSection() {
  const v = config.visualizer
  if (!v) return null
  const copy = homeCopy.visualizer

  const heading = (large: boolean): ReactNode => (
    <>
      {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
      <h2 id="visualizer-heading" className={`mt-4 font-heading text-section font-bold text-ink ${large ? 'lg:text-step-6' : ''}`}>
        <Highlight text={copy.heading.text} highlight={copy.heading.highlight} />
      </h2>
      {copy.body && <p className="mt-4 max-w-measure text-step-1 text-ink-soft">{copy.body}</p>}
      <Link href={QUOTE_CTA.href} className={`${btnPrimary} mt-6 rounded-site px-6 py-3.5`}>
        {QUOTE_CTA.label}
      </Link>
    </>
  )

  const scenes: VisualizerScene[] = v.scenes.map((s) => {
    const img = getImage(s.image)
    return {
      key: s.key,
      name: s.name,
      description: s.description,
      colors: s.colors,
      glow: s.glow,
      glowCycle: s.glowCycle,
      file: s.image,
      rendering: isRendering(s.image),
      image: { src: img.src, srcSet: img.srcSet, width: img.width, height: img.height, alt: img.alt },
    }
  })

  return (
    <section aria-labelledby="visualizer-heading" style={darkVars} className="relative bg-bg text-ink-soft">
      <div aria-hidden="true" className="strip-spectrum absolute inset-x-0 top-0 z-30" />
      <SceneVisualizer scenes={scenes} defaultScene={v.defaultScene} hint={copy.hint}>
        {heading(true)}
      </SceneVisualizer>
    </section>
  )
}
