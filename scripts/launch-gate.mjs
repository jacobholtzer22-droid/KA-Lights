#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * LAUNCH GATE. Runs inside every `next build` (hooked in next.config.mjs) and
 * as `npm run gate`. It fails the build while the site still carries anything
 * that must never reach production:
 *
 *   1. provisional value: the provisional marker word (see MARKER) anywhere in
 *      site source: config, theme, app, components, lib, content, public.
 *   2. placeholder asset: any file under public/ named placeholder-*, or any
 *      source reference to an image file named placeholder-*.
 *   3. placeholder registered: an entry in placeholders.json (the build-time
 *      register: filenames and status only) whose status is Placeholder.
 *   4. search engines blocked: indexing.json still has noindex: true.
 *
 * Preview builds may bypass 1 to 4 ONLY with the explicit env flag PREVIEW=1.
 * Nothing else bypasses them. Consistency errors fail every build, preview
 * included: a missing or malformed placeholders.json or indexing.json,
 * indexing.json and vercel.json disagreeing about noindex, or (where
 * docs/ASSET-PROVENANCE.md is present) its Placeholder rows and
 * placeholders.json listing different files.
 *
 * scripts/ is deliberately not scanned: this file has to name the marker in
 * order to look for it.
 */

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const MARKER = 'PROVISIONAL'
const MARKER_RE = new RegExp(`\\b${MARKER}\\b`)
const PLACEHOLDER_FILE_RE = /^placeholder-/i
const PLACEHOLDER_REF_RE = /placeholder-[A-Za-z0-9._-]*\.(?:jpe?g|png|webp|avif|gif|tiff?|svg)\b/gi

const SCAN = ['site.config.ts', 'theme.ts', 'tailwind.config.ts', 'next.config.mjs', 'vercel.json', 'indexing.json', 'app', 'components', 'lib', 'content', 'public']
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', '.git', '.vercel'])
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.md', '.mdx', '.css', '.txt', '.xml', '.svg', '.html'])

function walk(root, rel) {
  const out = []
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const child = path.join(rel, entry.name)
    if (entry.isDirectory()) out.push(...walk(root, child))
    else if (entry.isFile()) out.push(child)
  }
  return out
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
}

function clean(cell) {
  return cell.replace(/[*`_]/g, '').trim()
}

/** Rows of any markdown table with a Status column whose status is Placeholder. Legend text outside tables is ignored. */
export function placeholderRows(markdown) {
  const lines = markdown.split('\n')
  const rows = []
  let i = 0
  while (i < lines.length) {
    if (!lines[i].trim().startsWith('|')) {
      i++
      continue
    }
    const start = i
    while (i < lines.length && lines[i].trim().startsWith('|')) i++
    const block = lines.slice(start, i)
    if (block.length < 3 || !/^\|?\s*:?-{3,}/.test(block[1].trim())) continue
    const col = splitRow(block[0]).map((c) => clean(c).toLowerCase()).indexOf('status')
    if (col === -1) continue
    block.slice(2).forEach((row, k) => {
      const cells = splitRow(row)
      if (/^placeholder\b/i.test(clean(cells[col] ?? ''))) rows.push({ line: start + 3 + k, label: clean(cells[0] ?? '') })
    })
  }
  return rows
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function inspectLaunchState(root = DEFAULT_ROOT) {
  const blockers = []
  const errors = []

  const files = SCAN.flatMap((entry) => {
    const abs = path.join(root, entry)
    if (!fs.existsSync(abs)) return []
    return fs.statSync(abs).isDirectory() ? walk(root, entry) : [entry]
  })

  for (const rel of files) {
    const posix = rel.split(path.sep).join('/')
    if (posix.startsWith('public/') && PLACEHOLDER_FILE_RE.test(path.basename(rel))) {
      blockers.push({ rule: 'placeholder asset', where: posix, detail: 'file under public/ named placeholder-*' })
    }
    if (!TEXT_EXT.has(path.extname(rel).toLowerCase())) continue
    const lines = fs.readFileSync(path.join(root, rel), 'utf8').split('\n')
    lines.forEach((line, n) => {
      if (MARKER_RE.test(line)) blockers.push({ rule: 'provisional value', where: `${posix}:${n + 1}`, detail: line.trim().slice(0, 160) })
      for (const m of line.matchAll(PLACEHOLDER_REF_RE)) {
        blockers.push({ rule: 'placeholder reference', where: `${posix}:${n + 1}`, detail: m[0] })
      }
    })
  }

  const registerFile = path.join(root, 'placeholders.json')
  let registered = null
  if (!fs.existsSync(registerFile)) {
    errors.push({ rule: 'placeholder register', where: 'placeholders.json', detail: 'file missing, so the gate cannot confirm that no placeholder is registered' })
  } else {
    try {
      const list = readJson(registerFile).placeholders
      if (!Array.isArray(list) || list.some((e) => typeof e?.file !== 'string' || typeof e?.status !== 'string')) throw new Error('shape')
      registered = new Set()
      for (const entry of list) {
        if (/^placeholder$/i.test(entry.status.trim())) {
          registered.add(entry.file)
          blockers.push({ rule: 'placeholder registered', where: 'placeholders.json', detail: entry.file })
        }
      }
    } catch {
      errors.push({ rule: 'placeholder register', where: 'placeholders.json', detail: 'must be {"placeholders": [{"file": "...", "status": "..."}]}' })
    }
  }

  // Where the full asset provenance record is present, it and the register must agree.
  const provenance = path.join(root, 'docs/ASSET-PROVENANCE.md')
  if (registered && fs.existsSync(provenance)) {
    const documented = new Set(
      placeholderRows(fs.readFileSync(provenance, 'utf8')).map((row) => (row.label.match(/placeholder-[A-Za-z0-9._-]+/) ?? [row.label])[0]),
    )
    const docsOnly = [...documented].filter((f) => !registered.has(f))
    const registerOnly = [...registered].filter((f) => !documented.has(f))
    if (docsOnly.length || registerOnly.length) {
      errors.push({
        rule: 'placeholder register',
        where: 'placeholders.json',
        detail: `out of sync with docs/ASSET-PROVENANCE.md (docs only: ${docsOnly.join(', ') || 'none'}; register only: ${registerOnly.join(', ') || 'none'})`,
      })
    }
  }

  const indexingFile = path.join(root, 'indexing.json')
  const vercelFile = path.join(root, 'vercel.json')
  let noindex = null
  if (!fs.existsSync(indexingFile)) {
    errors.push({ rule: 'indexing state', where: 'indexing.json', detail: 'file missing' })
  } else {
    try {
      const value = readJson(indexingFile).noindex
      if (typeof value === 'boolean') noindex = value
      else errors.push({ rule: 'indexing state', where: 'indexing.json', detail: '"noindex" must be true or false' })
    } catch {
      errors.push({ rule: 'indexing state', where: 'indexing.json', detail: 'not valid JSON' })
    }
  }
  let headerSent = false
  if (fs.existsSync(vercelFile)) {
    try {
      headerSent = (readJson(vercelFile).headers ?? []).some(
        (h) => h.source === '/(.*)' && (h.headers ?? []).some((x) => String(x.key).toLowerCase() === 'x-robots-tag' && /noindex/i.test(String(x.value))),
      )
    } catch {
      errors.push({ rule: 'indexing state', where: 'vercel.json', detail: 'not valid JSON' })
    }
  }
  if (noindex === true) {
    blockers.push({ rule: 'search engines blocked', where: 'indexing.json', detail: 'noindex is true (preview state). Set it to false and remove the vercel.json header at DNS cutover.' })
    if (!headerSent) errors.push({ rule: 'indexing state', where: 'vercel.json', detail: 'indexing.json says noindex, but vercel.json sends no site-wide X-Robots-Tag noindex header' })
  }
  if (noindex === false && headerSent) {
    errors.push({ rule: 'indexing state', where: 'vercel.json', detail: 'vercel.json still sends X-Robots-Tag noindex while indexing.json says the site is indexable' })
  }

  return { blockers, errors }
}

function describe(items, limit = 10) {
  const byRule = new Map()
  for (const item of items) byRule.set(item.rule, [...(byRule.get(item.rule) ?? []), item])
  const lines = []
  for (const [rule, list] of byRule) {
    lines.push(`  ${rule} (${list.length})`)
    for (const item of list.slice(0, limit)) lines.push(`    - ${item.where}: ${item.detail}`)
    if (list.length > limit) lines.push(`    ... and ${list.length - limit} more`)
  }
  return lines.join('\n')
}

export function enforceLaunchGate({ root = DEFAULT_ROOT, env = process.env, log = console } = {}) {
  const { blockers, errors } = inspectLaunchState(root)
  const preview = env.PREVIEW === '1'
  if (errors.length) {
    throw new Error(`LAUNCH GATE: ${errors.length} consistency error(s). These fail every build, preview included.\n${describe(errors)}`)
  }
  if (blockers.length && !preview) {
    const flagNote = env.PREVIEW !== undefined ? `\nPREVIEW is set to "${env.PREVIEW}". Only PREVIEW=1 enables the preview bypass.` : ''
    throw new Error(
      `LAUNCH GATE: ${blockers.length} launch blocker(s). This build cannot go to production.\n${describe(blockers)}\n` +
        `A preview build may bypass these only with PREVIEW=1.${flagNote}`,
    )
  }
  if (blockers.length && preview) {
    log.warn(`\nLAUNCH GATE BYPASSED (PREVIEW=1): ${blockers.length} launch blocker(s) present. NOT deployable to production.\n${describe(blockers, 5)}\n`)
  }
  return { blockers, errors, preview }
}

const invokedDirectly = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
if (invokedDirectly) {
  const flag = process.argv.indexOf('--root')
  const root = flag === -1 ? DEFAULT_ROOT : path.resolve(process.argv[flag + 1])
  try {
    const { blockers } = enforceLaunchGate({ root })
    if (blockers.length === 0) console.log('LAUNCH GATE: clear. No provisional values, placeholders, or search engine blocking.')
    process.exit(0)
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }
}
