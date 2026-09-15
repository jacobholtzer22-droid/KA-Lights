import Link from 'next/link'
import { config } from '@/lib/config'
import { getImage } from '@/lib/images'
import { QUOTE_CTA } from '@/lib/navigation'
import { homeCopy } from '@/lib/page-content'
import Eyebrow from './Eyebrow'
import Highlight from './Highlight'
import SceneVisualizer, { type VisualizerScene } from './SceneVisualizer'

/** Server wrapper: resolves each scene's photo from the manifest and supplies the section copy. */
export default function VisualizerSection() {
  const v = config.visualizer
  if (!v) return null
  const copy = homeCopy.visualizer
  const scenes: VisualizerScene[] = v.scenes.map((s) => {
    const img = getImage(s.image)
    return { key: s.key, name: s.name, description: s.description, colors: s.colors, glow: s.glow, image: { src: img.src, srcSet: img.srcSet, width: img.width, height: img.height, alt: img.alt } }
  })

  return (
    <section aria-labelledby="visualizer-heading" className="relative bg-bg">
      <div aria-hidden="true" className="strip-spectrum absolute inset-x-0 top-0 z-30" />
      <SceneVisualizer scenes={scenes} defaultScene={v.defaultScene} hint={copy.hint}>
        {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
        <h2 id="visualizer-heading" className="mt-4 font-heading text-section font-bold text-ink lg:text-step-6">
          <Highlight text={copy.heading.text} highlight={copy.heading.highlight} />
        </h2>
        {copy.body && <p className="mt-4 max-w-[44ch] text-step-1 text-ink-soft">{copy.body}</p>}
        <Link href={QUOTE_CTA.href} className="mt-6 inline-flex rounded-site bg-accent px-6 py-3.5 font-semibold text-on-accent shadow-glow hover:bg-accent-dark">
          {QUOTE_CTA.label}
        </Link>
      </SceneVisualizer>
    </section>
  )
}
