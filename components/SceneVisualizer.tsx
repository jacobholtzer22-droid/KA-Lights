'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type SyntheticEvent } from 'react'

export interface VisualizerScene {
  key: string
  name: string
  description: string
  colors: string[]
  glow: string | null
  image: { src: string; srcSet: string; width: number; height: number; alt: string }
}

/** 1x1 transparent GIF: a valid src for scenes that have not been requested yet, with no network request. */
const UNREQUESTED = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

function swatch(colors: readonly string[]): string {
  if (colors.length <= 1) return colors[0] ?? 'transparent'
  const band = 100 / colors.length
  return `linear-gradient(135deg, ${colors.map((c, i) => `${c} ${i * band}% ${(i + 1) * band}%`).join(', ')})`
}

/**
 * Color visualizer, technique A: one photograph per scene, stacked and
 * cross-faded. NOT APPROVED, NOT LCP-MEASURED, NOT SIGNED OFF until the real
 * 8-scene tripod series replaces the placeholders (launch blocker B1.4).
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
  const [shown, setShown] = useState(defaultScene)
  const [focusKey, setFocusKey] = useState(defaultScene)
  const [requested, setRequested] = useState<ReadonlySet<string>>(() => new Set([defaultScene]))
  const [settled, setSettled] = useState<ReadonlySet<string>>(() => new Set())
  const [announcement, setAnnouncement] = useState('')
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const photos = useRef<(HTMLImageElement | null)[]>([])

  const nameOf = (key: string) => scenes.find((s) => s.key === key)?.name ?? key
  const settle = (key: string) => setSettled((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  const request = (key: string) => setRequested((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))

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
    // nameOf only reads scenes, which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, shown, settled, scenes])

  function select(key: string) {
    if (key === selected) return
    request(key)
    setSelected(key)
    if (key === shown) setAnnouncement(`Showing ${nameOf(key)} scene`)
    else if (!settled.has(key)) setAnnouncement(`Loading ${nameOf(key)} scene`)
  }

  function onPhotoSettled(key: string) {
    return (event: SyntheticEvent<HTMLImageElement>) => {
      if (!event.currentTarget.currentSrc.startsWith('data:')) settle(key)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = scenes.findIndex((s) => s.key === focusKey)
    const last = scenes.length - 1
    let next: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index >= last ? 0 : index + 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index <= 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    const target = next === null ? undefined : scenes[next]
    if (next === null || !target) return
    event.preventDefault()
    setFocusKey(target.key)
    buttons.current[next]?.focus()
  }

  const current = scenes.find((s) => s.key === shown) ?? scenes[0]
  if (!current) return null

  return (
    <div className="relative lg:aspect-[16/9] lg:max-h-[58.75rem] lg:w-full">
      <div className="relative z-20 px-4 pb-8 pt-16 lg:absolute lg:left-[max(2rem,5vw)] lg:top-[8%] lg:max-w-xl lg:p-0">{children}</div>

      <div data-visualizer-media="" className="relative aspect-[4/3] overflow-hidden bg-bg sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
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
              data-scene={scene.key}
              onLoad={onPhotoSettled(scene.key)}
              onError={onPhotoSettled(scene.key)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[600ms] ease-out"
              style={{ opacity: active ? 1 : 0 }}
            />
          )
        })}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-500"
          style={{
            backgroundImage: current.glow ? `radial-gradient(70% 46% at 42% 88%, ${current.glow} 0%, transparent 66%)` : 'none',
            opacity: current.glow ? 0.26 : 0,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(90deg, rgba(8, 9, 14, 0.9) 0%, rgba(8, 9, 14, 0.5) 34%, rgba(8, 9, 14, 0) 62%), linear-gradient(0deg, rgba(8, 9, 14, 0.75) 0%, rgba(8, 9, 14, 0) 42%)' }}
        />
        {selected !== shown && (
          <p aria-hidden="true" className="absolute bottom-4 left-4 rounded-full bg-surface px-3 py-1 text-step--1 text-ink">
            Loading scene
          </p>
        )}
      </div>

      <div className="relative z-20 px-4 py-6 lg:absolute lg:right-[6%] lg:top-1/2 lg:w-[17rem] lg:-translate-y-1/2 lg:rounded-[2.5rem] lg:border-[10px] lg:border-surface-raised lg:bg-surface lg:px-4 lg:py-5 lg:shadow-site">
        <div className="flex items-center gap-3 border-b border-line pb-3">
          <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-site border border-line" style={{ background: swatch(current.colors) }} />
          <div>
            <p className="text-step--1 text-muted">Now showing</p>
            <p className="font-heading text-step-0 font-semibold text-ink">{current.name}</p>
          </div>
        </div>
        <div role="group" aria-label="Lighting scenes" onKeyDown={onKeyDown} className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
          {scenes.map((scene, i) => {
            const pressed = scene.key === selected
            return (
              <button
                key={scene.key}
                ref={(el) => {
                  buttons.current[i] = el
                }}
                type="button"
                aria-pressed={pressed}
                aria-label={scene.name}
                aria-describedby={`scene-${scene.key}-description`}
                tabIndex={scene.key === focusKey ? 0 : -1}
                onPointerEnter={() => request(scene.key)}
                onFocus={() => {
                  setFocusKey(scene.key)
                  request(scene.key)
                }}
                onClick={() => select(scene.key)}
                className={`flex min-h-12 items-center gap-3 rounded-site border px-3 py-2 text-left ${pressed ? 'border-accent bg-surface-raised' : 'border-line bg-bg hover:border-muted'}`}
              >
                <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-md border border-line" style={{ background: swatch(scene.colors) }} />
                <span className="min-w-0 flex-1">
                  <span className="block text-step--1 font-semibold text-ink">{scene.name}</span>
                  <span id={`scene-${scene.key}-description`} className="block truncate text-step--1 text-muted">
                    {scene.description}
                  </span>
                </span>
                <span aria-hidden="true" className={`text-accent ${pressed ? 'opacity-100' : 'opacity-0'}`}>
                  ✓
                </span>
              </button>
            )
          })}
        </div>
        {hint && <p className="mt-3 hidden text-center text-step--1 uppercase tracking-[0.16em] text-muted lg:block">{hint}</p>}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
