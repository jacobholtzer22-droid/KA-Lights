'use client'

import { useRef, useState, type KeyboardEvent } from 'react'

export interface PanelScene {
  key: string
  name: string
  description: string
  colors: string[]
}

export function swatch(colors: readonly string[]): string {
  if (colors.length <= 1) return colors[0] ?? 'transparent'
  const band = 100 / colors.length
  return `linear-gradient(135deg, ${colors.map((c, i) => `${c} ${i * band}% ${(i + 1) * band}%`).join(', ')})`
}

/**
 * The visualizer scene picker (docs/DESIGN-DECISIONS.md decision 9): real buttons
 * with aria-pressed, one tab stop for the group, and arrow, Home, and End keys
 * within it. The parent owns the selection and the polite live region.
 */
export default function ScenePanel({
  scenes,
  current,
  selected,
  onSelect,
  onPrefetch,
  hint,
  className = '',
  columns = 'auto',
}: {
  scenes: PanelScene[]
  /** The scene on screen, shown in the "Now showing" row. */
  current: PanelScene
  selected: string
  onSelect: (key: string) => void
  /** Called on hover or focus, so a photo scene can start loading early. */
  onPrefetch?: (key: string) => void
  hint?: string | null
  className?: string
  /** 'single' keeps one column at every width: the phone mockup is too narrow for two. */
  columns?: 'auto' | 'single'
}) {
  const [focusKey, setFocusKey] = useState(selected)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

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

  return (
    <div className={className}>
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-site border border-line" style={{ background: swatch(current.colors) }} />
        <div>
          <p className="text-step--1 text-muted">Now showing</p>
          <p className="font-heading text-step-0 font-semibold text-ink">{current.name}</p>
        </div>
      </div>
      <div role="group" aria-label="Lighting scenes" onKeyDown={onKeyDown} className={`mt-3 grid gap-2 ${columns === 'single' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-1'}`}>
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
              onPointerEnter={() => onPrefetch?.(scene.key)}
              onFocus={() => {
                setFocusKey(scene.key)
                onPrefetch?.(scene.key)
              }}
              onClick={() => onSelect(scene.key)}
              className={`flex min-h-12 items-center gap-3 rounded-site border px-3 py-2 text-left transition-[background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:bg-surface-raised ${pressed ? 'border-accent bg-surface-raised' : 'border-line bg-bg hover:border-muted hover:bg-surface-raised'}`}
            >
              <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-md border border-line" style={{ background: swatch(scene.colors) }} />
              <span className="min-w-0 flex-1">
                <span className="block text-step--1 font-semibold text-ink">{scene.name}</span>
                <span id={`scene-${scene.key}-description`} className="block truncate text-step--1 text-muted">
                  {scene.description}
                </span>
              </span>
              <span aria-hidden="true" className={`text-accent-ink ${pressed ? 'opacity-100' : 'opacity-0'}`}>
                ✓
              </span>
            </button>
          )
        })}
      </div>
      {hint && <p className="mt-3 hidden text-center text-step--1 uppercase tracking-[0.16em] text-muted lg:block">{hint}</p>}
    </div>
  )
}
