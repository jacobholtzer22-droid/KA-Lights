'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type SyntheticEvent } from 'react'
import { SAMPLE_HOME_LABEL } from '@/lib/images'
import RenderingLabel from './RenderingLabel'
import ScenePanel from './ScenePanel'

export interface VisualizerScene {
  key: string
  name: string
  description: string
  colors: string[]
  glow: string | null
  /** Party: the glow cycles through the scene colors while the photo stays still. */
  glowCycle: boolean
  /** Manifest filename, so verify check 23 can match a scene layer that has not loaded yet. */
  file: string
  /** True when the image is registered as a rendering: the frame then shows the visible label. */
  rendering: boolean
  image: { src: string; srcSet: string; width: number; height: number; alt: string }
}

/** 1x1 transparent GIF: a valid src for scenes that have not been requested yet, with no network request. */
const UNREQUESTED = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

/**
 * Color visualizer, technique A: one photograph per scene, stacked and
 * cross-faded. The scenes are the sample-home renderings until a real tripod
 * series of a Kalights install replaces them (B1.4, an upgrade).
 *
 * The stage owns the active scene and the polite live region. The reference
 * site repeats this scene list in a "Total control in your pocket" phone
 * mockup; this site deliberately has one set of controls (decision 42).
 *
 * Structure (docs/DESIGN-DECISIONS.md decisions 9 and 10):
 * - Every scene is an <img> with its own descriptive alt. Only the scene on
 *   screen is exposed to assistive tech; the rest carry aria-hidden="true".
 * - Glow and scrim are divs, never images.
 * - Scene buttons are real buttons with aria-pressed, one tab stop, and arrow
 *   keys within the group. A polite live region announces scene changes, so
 *   the control is usable and understandable with images off.
 *
 * Loading: the default scene is fetched with the page. Every other scene is
 * fetched only when a visitor hovers, focuses, or picks it (native lazy
 * loading would fetch all of them, because the section sits close to the
 * first viewport). A picked scene appears once its photo settles, loaded or
 * failed, so the frame is never blank and a failed photo never locks the
 * control. The 0.6s cross-fade is an instant cut under reduced motion
 * (app/globals.css).
 */
export default function SceneVisualizer({
  scenes,
  defaultScene,
  hint,
  children,
}: {
  scenes: VisualizerScene[]
  defaultScene: string
  hint?: string | null
  children: ReactNode
}) {
  const [selected, setSelected] = useState(defaultScene)
  const [requested, setRequested] = useState<ReadonlySet<string>>(() => new Set([defaultScene]))
  const [announcement, setAnnouncement] = useState('')
  const [shown, setShown] = useState(defaultScene)
  const [settled, setSettled] = useState<ReadonlySet<string>>(() => new Set())
  const photos = useRef<(HTMLImageElement | null)[]>([])

  const nameOf = (key: string) => scenes.find((s) => s.key === key)?.name ?? key
  const settle = (key: string) => setSettled((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  const request = (key: string) => setRequested((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))

  function select(key: string) {
    if (key === selected) return
    request(key)
    setSelected(key)
  }

  // A photo that settled before hydration never fires onLoad or onError in React.
  useEffect(() => {
    photos.current.forEach((img, i) => {
      const scene = scenes[i]
      if (scene && img?.complete && img.currentSrc && !img.currentSrc.startsWith('data:')) settle(scene.key)
    })
  }, [scenes])

  useEffect(() => {
    if (selected !== shown && settled.has(selected)) {
      setShown(selected)
      setAnnouncement(`Showing ${nameOf(selected)} scene`)
    }
    if (selected !== shown && !settled.has(selected)) setAnnouncement(`Loading ${nameOf(selected)} scene`)
    // nameOf only reads scenes, which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, shown, settled, scenes])

  function onPhotoSettled(key: string) {
    return (event: SyntheticEvent<HTMLImageElement>) => {
      if (!event.currentTarget.currentSrc.startsWith('data:')) settle(key)
    }
  }

  const current = scenes.find((s) => s.key === shown) ?? scenes[0]
  if (!current) return null

  return (
    <div className="relative lg:aspect-[16/9] lg:max-h-[58.75rem] lg:w-full">
      <div className="relative z-20 px-4 pb-12 pt-16 lg:absolute lg:left-[max(2rem,5vw)] lg:top-[8%] lg:max-w-xl lg:p-0">{children}</div>

      <div
        data-visualizer-media=""
        {...(scenes.some((s) => s.rendering) ? { 'data-rendering-frame': '' } : {})}
        className="relative aspect-[4/3] overflow-hidden bg-bg sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto"
      >
        {scenes.map((scene, i) => {
          const active = scene.key === shown
          const wanted = requested.has(scene.key)
          return (
            <img
              key={scene.key}
              ref={(el) => {
                photos.current[i] = el
              }}
              src={wanted ? scene.image.src : UNREQUESTED}
              srcSet={wanted ? scene.image.srcSet : undefined}
              sizes="100vw"
              width={scene.image.width}
              height={scene.image.height}
              alt={scene.image.alt}
              aria-hidden={active ? undefined : true}
              decoding="async"
              // The hero is the LCP element; the stage sits below it, so scene photos never
              // compete for bandwidth with it.
              // Lazy and low priority: the hero above is the LCP element, and the browser
              // still fetches the default scene well before the stage scrolls into view.
              loading="lazy"
              {...{ fetchpriority: 'low' }}
              data-scene={scene.key}
              data-image={scene.file}
              onLoad={onPhotoSettled(scene.key)}
              onError={onPhotoSettled(scene.key)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[600ms] ease-out"
              style={{ opacity: active ? 1 : 0 }}
            />
          )
        })}
        {/* Glow: a div, never an image (decision 10), and no blur on a full-bleed layer.
            Party cycles --kv-glow through its colors, like the current site. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-500 ${current.glowCycle ? 'kv-bloom-cycle' : ''}`}
          style={{
            ...(current.glow ? ({ ['--kv-glow' as string]: current.glow } as CSSProperties) : {}),
            backgroundImage: current.glow ? 'radial-gradient(70% 46% at 42% 88%, var(--kv-glow) 0%, transparent 66%)' : 'none',
            opacity: current.glow ? 0.26 : 0,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: 'var(--stage-scrim)' }}
        />
        {/* Mandatory disclosure on the sample-home renderings (verify check 23). Top
            corner at every width, so it is on screen with the image on a phone. */}
        {scenes.some((s) => s.rendering) && <RenderingLabel position="visualizer" text={SAMPLE_HOME_LABEL} />}
        {selected !== shown && (
          <p aria-hidden="true" className="absolute bottom-4 left-4 rounded-full bg-surface px-3 py-1 text-step--1 text-ink">
            Loading scene
          </p>
        )}
      </div>

      <ScenePanel
        scenes={scenes}
        current={current}
        selected={selected}
        onSelect={select}
        onPrefetch={request}
        hint={hint}
        className="relative z-20 px-4 py-6 lg:absolute lg:right-[6%] lg:top-1/2 lg:w-[17rem] lg:-translate-y-1/2 lg:rounded-[2.5rem] lg:border-[10px] lg:border-surface-raised lg:bg-surface lg:px-4 lg:py-5 lg:shadow-site"
      />

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
