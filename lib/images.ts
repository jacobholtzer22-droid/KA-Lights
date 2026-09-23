import manifest from '@/public/images/manifest.json'
import register from '@/placeholders.json'

/**
 * Read side of the image pipeline. scripts/process-images.ts writes
 * public/images/manifest.json keyed by ORIGINAL FILENAME, never by position,
 * so alt text can never shift onto the wrong photo.
 */

export interface ManifestEntry {
  width: number
  height: number
  alt: string | null
  /** Slugified basename used for the processed WebP files. */
  base: string
  /** Widths that were generated (never wider than the original). */
  sizes: number[]
}

export type Manifest = Record<string, ManifestEntry>

const entries = manifest as Manifest

export const PROCESSED_DIR = '/images/processed'

export interface ResolvedImage {
  /** Default src: the largest rendition at or below 1024px. */
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
  sizes: number[]
}

/** True for the labeled stand-in frames used while real photography is pending (launch blocker B1). */
export function isPlaceholder(filename: string): boolean {
  return /^placeholder-/i.test(filename)
}

/**
 * Status in the image register (placeholders.json) that marks an AI-generated
 * design rendering. A rendering must always carry the visible "Design
 * rendering" label and an alt starting "Rendering of" (verify check 23).
 */
export const RENDERING_STATUS = 'Rendering (AI, labeled)'
export const RENDERING_LABEL = 'Design rendering'
/** The visualizer scenes: one sample home, shown as a rendering rather than a Kalights job. */
export const SAMPLE_HOME_LABEL = 'Sample home, design rendering'

const renderings = new Set(
  (register as { placeholders: { file: string; status: string }[] }).placeholders
    .filter((e) => e.status === RENDERING_STATUS)
    .map((e) => e.file),
)

/** True for an image registered as an AI design rendering. */
export function isRendering(filename: string): boolean {
  return renderings.has(filename)
}

/**
 * First candidate that may represent the business off-page (og:image, schema
 * image). Renderings are skipped: a share card or search result shows the
 * image without the page's visible "Design rendering" label.
 */
export function shareableImage(candidates: (string | null | undefined)[]): string | null {
  return candidates.find((name): name is string => !!name && hasImage(name) && !isRendering(name)) ?? null
}

export function hasImage(filename: string): boolean {
  return Object.prototype.hasOwnProperty.call(entries, filename)
}

export function listImages(): string[] {
  return Object.keys(entries)
}

/**
 * Throws at build for an unknown file or a missing alt. Both are defects that
 * must stop the build rather than ship an unlabeled or broken image.
 */
export function getImage(filename: string): ResolvedImage {
  const entry = entries[filename]
  if (!entry) {
    throw new Error(
      `Image "${filename}" is not in public/images/manifest.json. ` +
        `Drop the file in public/images/originals/ and run \`npm run images\`. Known images: ${listImages().join(', ') || '(none)'}`,
    )
  }
  if (!entry.alt || entry.alt.trim().length === 0) {
    throw new Error(
      `Image "${filename}" has no alt text in public/images/manifest.json. ` +
        `View the file and write a descriptive alt (10 to 20 words) before building.`,
    )
  }
  const sizes = [...entry.sizes].sort((a, b) => a - b)
  const largestDefault = sizes.filter((w) => w <= 1024).at(-1) ?? sizes[0]
  if (largestDefault === undefined) {
    throw new Error(`Image "${filename}" has no generated sizes. Re-run \`npm run images\`.`)
  }
  const file = (w: number) => `${PROCESSED_DIR}/${entry.base}-${w}.webp`
  const maxW = sizes.at(-1) ?? largestDefault
  return {
    src: file(largestDefault),
    srcSet: sizes.map((w) => `${file(w)} ${w}w`).join(', '),
    width: entry.width,
    height: entry.height,
    alt: entry.alt.trim(),
    sizes: sizes.length ? sizes : [maxW],
  }
}
