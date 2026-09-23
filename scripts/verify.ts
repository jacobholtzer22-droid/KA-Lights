import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'
import rawConfig from '../site.config'
import { CONTACT_ENDPOINT, HONEYPOT_FIELD, SCHEMA_TYPES, SLUG_REGEX, siteConfigSchema } from '../lib/config-schema'
import { DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX, TITLE_MIN } from './verify-limits'
import { inspectLaunchState } from './launch-gate.mjs'

/**
 * THE GATE. Runs after `next build` against the static output in ./out and
 * exits non-zero on any failure. `npm run verify` = `next build && tsx scripts/verify.ts`.
 *
 * Every check is fatal. Nothing here is a warning, because every one of these
 * has cost real money before: a lost lead is invisible until the client asks
 * why the phone stopped ringing.
 *
 * The report table is the artifact. Read it, not the narration around it.
 */

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')
const CONTENT = path.join(ROOT, 'content')
const CONFIG_FILE = path.join(ROOT, 'site.config.ts')
const FORM_FILE = path.join(ROOT, 'components/ContactForm.tsx')
const FORM_BASELINE = path.join(ROOT, 'scripts/contact-form.sha256')
const INDEXING_FILE = path.join(ROOT, 'indexing.json')
const PREVIEW = process.env.PREVIEW === '1'
const VERIFY_SLUG_URL = 'https://www.alignandacquire.com/api/verify-slug'

/** Identity markers of the shipped sample config. Any of these in the identity fields means the template is unfilled. */
const SAMPLE_MARKERS = ['sample', 'example', 'template', 'EXAMPLE_']

/**
 * The shipped sample business by name. Scanned across site.config.ts AND every
 * content file, so an agent cannot fill the five identity fields and still ship
 * the sample services, FAQs, or body copy under a real client's name.
 */
const SAMPLE_TOKENS = ['sample-lawn-care', 'Sample Lawn Care']

const PLACEHOLDER_TOKENS = ['TODO', 'TKTK', 'Lorem', '[CITY]', '[SERVICE]', 'EXAMPLE_', 'your business', 'Insert ']

/** Every schema.org type this template can legitimately emit. Anything else is rejected, not warned about. */
const TYPE_ALLOWLIST = new Set<string>([
  ...SCHEMA_TYPES,
  'Organization',
  'WebSite',
  'WebPage',
  'Service',
  'Offer',
  'OfferCatalog',
  'FAQPage',
  'Question',
  'Answer',
  'BreadcrumbList',
  'ListItem',
  'PostalAddress',
  'GeoCoordinates',
  'OpeningHoursSpecification',
  'AggregateRating',
  'Review',
  'Rating',
  'Person',
  'City',
  'AdministrativeArea',
  'Place',
  'ContactPoint',
  'ImageObject',
])

interface Result {
  id: number
  name: string
  pass: boolean
  detail: string
}

const results: Result[] = []
function record(id: number, name: string, pass: boolean, detail = '') {
  results.push({ id, name, pass, detail })
}

// ---------- helpers ----------

function walk(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return []
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p, ext))
    else if (entry.name.endsWith(ext)) out.push(p)
  }
  return out.sort()
}

interface Page {
  file: string
  route: string
  html: string
  $: cheerio.CheerioAPI
}

/** Every prose or copy file in content/: MDX and the structured JSON page copy. */
function contentFiles(): string[] {
  return [...walk(CONTENT, '.mdx'), ...walk(CONTENT, '.json')].sort()
}

function routeFromFile(file: string): string {
  const rel = path.relative(OUT, file).replace(/\\/g, '/')
  if (rel === 'index.html') return '/'
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length)
  return '/' + rel.replace(/\.html$/, '')
}

function loadPages(): Page[] {
  return walk(OUT, '.html')
    .filter((f) => path.basename(f) !== '404.html' && !path.relative(OUT, f).startsWith('_'))
    .map((file) => {
      const html = fs.readFileSync(file, 'utf8')
      return { file, route: routeFromFile(file), html, $: cheerio.load(html) }
    })
}

function routeExists(route: string): boolean {
  const clean = route.split('#')[0]?.split('?')[0] ?? ''
  if (clean === '' || clean === '/') return fs.existsSync(path.join(OUT, 'index.html'))
  const rel = clean.replace(/^\//, '')
  return (
    fs.existsSync(path.join(OUT, `${rel}.html`)) ||
    fs.existsSync(path.join(OUT, rel, 'index.html')) ||
    (fs.existsSync(path.join(OUT, rel)) && fs.statSync(path.join(OUT, rel)).isFile())
  )
}

function collectTypes(node: unknown, acc: string[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, acc)
    return
  }
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>
    const t = obj['@type']
    if (typeof t === 'string') acc.push(t)
    else if (Array.isArray(t)) for (const x of t) if (typeof x === 'string') acc.push(x)
    for (const [k, v] of Object.entries(obj)) if (k !== '@type') collectTypes(v, acc)
  }
}

function hasKeyDeep(node: unknown, key: string): boolean {
  if (Array.isArray(node)) return node.some((n) => hasKeyDeep(n, key))
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>
    if (key in obj) return true
    return Object.values(obj).some((v) => hasKeyDeep(v, key))
  }
  return false
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length
}

function imageKey(src: string): string {
  // /images/processed/foo-1024.webp -> foo
  return path.basename(src).replace(/-\d+\.webp$/, '').replace(/\.[a-z]+$/, '')
}

// ---------- checks ----------

async function run() {
  if (!fs.existsSync(OUT)) {
    console.error(`No build output at ${OUT}. Run \`npm run verify\` (which builds first) or \`npm run build\`.`)
    process.exit(1)
  }

  // 1. Config parses.
  const parsed = siteConfigSchema.safeParse(rawConfig)
  if (parsed.success) {
    record(1, 'site.config.ts parses against schema', true)
  } else {
    const detail = parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ')
    record(1, 'site.config.ts parses against schema', false, detail)
  }
  const cfg = parsed.success ? parsed.data : null
  const slug = String((rawConfig as { businessSlug?: unknown }).businessSlug ?? '')

  // 2. Slug is real, not the sample identity.
  {
    const identity = [
      ['businessSlug', slug],
      ['displayName', String((rawConfig as { displayName?: unknown }).displayName ?? '')],
      ['legalName', String((rawConfig as { legalName?: unknown }).legalName ?? '')],
      ['domain', String((rawConfig as { domain?: unknown }).domain ?? '')],
    ] as const
    const problems: string[] = []
    if (!SLUG_REGEX.test(slug)) problems.push(`businessSlug "${slug}" is not kebab-case`)
    for (const [field, value] of identity) {
      const hit = SAMPLE_MARKERS.find((m) => value.toLowerCase().includes(m.toLowerCase()))
      if (hit) problems.push(`${field} still carries the sample identity ("${hit}")`)
    }
    if (cfg) {
      const sampleImages = [cfg.images.hero, cfg.images.about, ...cfg.images.gallery, ...cfg.services.map((s) => s.image)].filter(
        (n): n is string => typeof n === 'string' && n.startsWith('sample-'),
      )
      if (sampleImages.length) problems.push(`config still references sample images: ${[...new Set(sampleImages)].join(', ')}`)
    }
    for (const file of [CONFIG_FILE, ...contentFiles()]) {
      const text = fs.readFileSync(file, 'utf8')
      for (const token of SAMPLE_TOKENS) {
        const idx = text.indexOf(token)
        if (idx !== -1) problems.push(`${path.relative(ROOT, file)}:${lineOf(text, idx)} still contains "${token}"`)
      }
    }
    record(
      2,
      'businessSlug and identity are filled in (not the template sample)',
      problems.length === 0,
      problems.length ? `The template has not been filled in. ${problems.slice(0, 12).join('. ')}.` : `slug "${slug}"`,
    )
  }

  // 3. Slug exists on the platform.
  {
    let pass = false
    let detail = ''
    try {
      const res = await fetch(`${VERIFY_SLUG_URL}?slug=${encodeURIComponent(slug)}`, {
        signal: AbortSignal.timeout(10_000),
        headers: { accept: 'application/json' },
      })
      if (res.status === 200) {
        pass = true
        detail = `platform confirmed slug "${slug}"`
      } else if (res.status === 404) {
        detail = `GET ${VERIFY_SLUG_URL} returned 404. Either the slug "${slug}" is not a Business row on the platform, or the verify-slug endpoint does not exist yet (the platform must expose it). Do not deploy until this is a 200.`
      } else {
        detail = `GET ${VERIFY_SLUG_URL}?slug=${slug} returned ${res.status}`
      }
    } catch (err) {
      detail = `could not reach ${VERIFY_SLUG_URL}: ${err instanceof Error ? err.message : String(err)}. This check does not pass silently on a network error.`
    }
    record(3, 'businessSlug exists in the live platform database', pass, detail)
  }

  // 4. ContactForm checksum.
  {
    const actual = createHash('sha256').update(fs.readFileSync(FORM_FILE)).digest('hex')
    const expected = fs.existsSync(FORM_BASELINE) ? fs.readFileSync(FORM_BASELINE, 'utf8').trim() : ''
    record(
      4,
      'components/ContactForm.tsx matches sealed checksum',
      actual === expected,
      actual === expected ? actual.slice(0, 12) : `expected ${expected.slice(0, 12) || '(no baseline)'} got ${actual.slice(0, 12)}. The sealed form was edited.`,
    )
  }

  const pages = loadPages()
  if (pages.length === 0) {
    record(0, 'build output contains pages', false, 'no HTML files in ./out')
  }

  // 5. Endpoint string present; bare apex absent.
  {
    const withEndpoint = pages.filter((p) => p.html.includes(CONTACT_ENDPOINT)).map((p) => p.route)
    const bare = pages.filter((p) => /(?<!www\.)alignandacquire\.com\/api\/contact/.test(p.html)).map((p) => p.route)
    const pass = withEndpoint.length > 0 && bare.length === 0
    record(
      5,
      'built HTML posts to the www contact endpoint, never the bare apex',
      pass,
      pass ? `endpoint on ${withEndpoint.join(', ')}` : `endpoint on: ${withEndpoint.join(', ') || 'none'}; bare apex on: ${bare.join(', ') || 'none'}`,
    )
  }

  // 6. Honeypot in hidden wrapper; no "company" field.
  {
    const problems: string[] = []
    const formPages = pages.filter((p) => p.$(`form[data-endpoint="${CONTACT_ENDPOINT}"]`).length > 0)
    if (formPages.length === 0) problems.push('no page renders the contact form')
    for (const p of formPages) {
      const hp = p.$(`[name="${HONEYPOT_FIELD}"]`)
      if (hp.length === 0) problems.push(`${p.route}: no ${HONEYPOT_FIELD} field`)
      else if (hp.closest('[hidden]').length === 0) problems.push(`${p.route}: ${HONEYPOT_FIELD} is not inside a hidden wrapper`)
    }
    for (const p of pages) {
      if (p.$('[name="company"]').length > 0) problems.push(`${p.route}: has a field named "company" (autofill bait)`)
    }
    record(6, `honeypot ${HONEYPOT_FIELD} inside hidden wrapper, no "company" field`, problems.length === 0, problems.join('; '))
  }

  // 7. No bare facts in content.
  {
    const patterns: { name: string; re: RegExp }[] = [
      { name: 'phone', re: /(\+1\s?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g },
      {
        name: 'street address',
        re: /\b\d{1,6}\s+(?:[A-Z][a-zA-Z]+\s+){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Highway|Hwy|Parkway|Pkwy|Place|Pl|Trail|Trl|Circle|Cir)\b\.?/g,
      },
      { name: 'email', re: /[\w.+-]+@[\w-]+\.[\w.-]+/g },
      { name: 'price', re: /\$\s?\d/g },
    ]
    const problems: string[] = []
    for (const file of contentFiles()) {
      const text = fs.readFileSync(file, 'utf8')
      for (const { name, re } of patterns) {
        for (const m of text.matchAll(re)) {
          problems.push(`${path.relative(ROOT, file)}:${lineOf(text, m.index ?? 0)} bare ${name} "${m[0]}"`)
        }
      }
    }
    record(7, 'content/ contains no bare phone, address, email, or price', problems.length === 0, problems.slice(0, 8).join('; '))
  }

  // 8. No placeholder tokens.
  {
    const problems: string[] = []
    const files = [...contentFiles(), CONFIG_FILE]
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8')
      for (const token of PLACEHOLDER_TOKENS) {
        let idx = text.indexOf(token)
        while (idx !== -1) {
          problems.push(`${path.relative(ROOT, file)}:${lineOf(text, idx)} "${token}"`)
          idx = text.indexOf(token, idx + token.length)
        }
      }
    }
    record(8, 'no placeholder tokens in content/ or site.config.ts', problems.length === 0, problems.slice(0, 8).join('; '))
  }

  // 9. JSON-LD valid and typed from the allowlist. 10. Reviews honest.
  {
    const ldProblems: string[] = []
    const reviewProblems: string[] = []
    for (const p of pages) {
      p.$('script[type="application/ld+json"]').each((_, el) => {
        const raw = p.$(el).text()
        let data: unknown
        try {
          data = JSON.parse(raw)
        } catch {
          ldProblems.push(`${p.route}: JSON-LD does not parse`)
          return
        }
        const obj = data as Record<string, unknown>
        if (!obj['@context']) ldProblems.push(`${p.route}: JSON-LD missing @context`)
        if (!obj['@type']) ldProblems.push(`${p.route}: JSON-LD missing @type`)
        const types: string[] = []
        collectTypes(data, types)
        for (const t of types) if (!TYPE_ALLOWLIST.has(t)) ldProblems.push(`${p.route}: @type "${t}" is not on the allowlist`)

        if (types.includes('Review') || hasKeyDeep(data, 'aggregateRating')) {
          if (!cfg || cfg.reviews.length === 0) {
            reviewProblems.push(`${p.route}: emits Review/aggregateRating with config.reviews empty`)
          } else {
            const body = p.$('body').text()
            for (const r of cfg.reviews) {
              if (!body.includes(r.text)) reviewProblems.push(`${p.route}: review by ${r.author} is in schema but not visible on the page`)
            }
          }
        }
      })
    }
    record(9, 'every JSON-LD block parses, has @context/@type, all types on allowlist', ldProblems.length === 0, ldProblems.slice(0, 8).join('; '))
    record(10, 'Review/aggregateRating only with real, visible reviews', reviewProblems.length === 0, reviewProblems.slice(0, 8).join('; '))
  }

  // 11. Alt text.
  {
    const problems: string[] = []
    const altToFiles = new Map<string, Set<string>>()
    for (const p of pages) {
      p.$('img').each((_, el) => {
        const alt = (p.$(el).attr('alt') ?? '').trim()
        const src = p.$(el).attr('src') ?? ''
        if (alt.length < 15) problems.push(`${p.route}: <img src="${src}"> alt "${alt}" is under 15 characters`)
        const key = imageKey(src)
        const set = altToFiles.get(alt) ?? new Set<string>()
        set.add(key)
        altToFiles.set(alt, set)
      })
    }
    for (const [alt, files] of altToFiles) {
      if (files.size > 1) problems.push(`alt "${alt.slice(0, 40)}..." is shared by different images: ${[...files].join(', ')}`)
    }
    record(11, 'every image has a 15+ char alt; no two images share an alt', problems.length === 0, problems.slice(0, 8).join('; '))
  }

  // 12. One h1.
  {
    const problems = pages.filter((p) => p.$('h1').length !== 1).map((p) => `${p.route}: ${p.$('h1').length} h1`)
    record(12, 'exactly one <h1> per page', problems.length === 0, problems.join('; '))
  }

  // 13. Titles.
  {
    const problems: string[] = []
    const seen = new Map<string, string>()
    for (const p of pages) {
      const title = p.$('head > title').first().text().trim()
      if (!title) {
        problems.push(`${p.route}: no <title>`)
        continue
      }
      if (title.length < TITLE_MIN || title.length > TITLE_MAX) problems.push(`${p.route}: title ${title.length} chars "${title}"`)
      const dup = seen.get(title)
      if (dup) problems.push(`${p.route}: title duplicates ${dup}`)
      seen.set(title, p.route)
    }
    record(13, `titles unique, ${TITLE_MIN} to ${TITLE_MAX} chars as rendered`, problems.length === 0, problems.slice(0, 8).join('; '))
  }

  // 14. Descriptions.
  {
    const problems: string[] = []
    const seen = new Map<string, string>()
    for (const p of pages) {
      const desc = (p.$('meta[name="description"]').attr('content') ?? '').trim()
      if (!desc) {
        problems.push(`${p.route}: no meta description`)
        continue
      }
      if (desc.length < DESCRIPTION_MIN || desc.length > DESCRIPTION_MAX) problems.push(`${p.route}: description ${desc.length} chars`)
      const dup = seen.get(desc)
      if (dup) problems.push(`${p.route}: description duplicates ${dup}`)
      seen.set(desc, p.route)
    }
    record(14, `meta descriptions present, unique, ${DESCRIPTION_MIN} to ${DESCRIPTION_MAX} chars`, problems.length === 0, problems.slice(0, 8).join('; '))
  }

  // 15. Canonicals.
  {
    const problems: string[] = []
    const domain = String((rawConfig as { domain?: unknown }).domain ?? '')
    for (const p of pages) {
      // Next strips the trailing slash from the root canonical; compare without it on both sides.
      const strip = (u: string) => u.replace(/\/$/, '')
      const canonical = p.$('link[rel="canonical"]').attr('href') ?? ''
      const expected = domain ? strip(new URL(p.route, domain).toString()) : ''
      if (!canonical) problems.push(`${p.route}: no canonical`)
      else if (strip(canonical) !== expected) problems.push(`${p.route}: canonical "${canonical}" expected "${expected}"`)
    }
    record(15, 'canonical present on every page and matches config.domain', problems.length === 0, problems.slice(0, 8).join('; '))
  }

  // 16. Sitemap matches routes.
  {
    const problems: string[] = []
    const sitemapFile = path.join(OUT, 'sitemap.xml')
    if (!fs.existsSync(sitemapFile)) {
      problems.push('out/sitemap.xml missing')
    } else {
      const xml = fs.readFileSync(sitemapFile, 'utf8')
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
        const u = new URL(m[1] ?? '')
        return u.pathname === '/' ? '/' : u.pathname.replace(/\/$/, '')
      })
      const built = new Set(pages.map((p) => p.route))
      const listed = new Set(locs)
      for (const r of built) if (!listed.has(r)) problems.push(`built route ${r} is not in the sitemap`)
      for (const r of listed) if (!built.has(r)) problems.push(`sitemap lists ${r} which was not built`)
    }
    record(16, 'sitemap lists every built route and nothing else', problems.length === 0, problems.slice(0, 8).join('; '))
  }

  // 17. Internal links resolve.
  {
    const problems = new Set<string>()
    for (const p of pages) {
      p.$('a[href]').each((_, el) => {
        const href = p.$(el).attr('href') ?? ''
        if (!href.startsWith('/') || href.startsWith('//')) return
        if (!routeExists(href)) problems.add(`${p.route} links to ${href}`)
      })
    }
    record(17, 'every internal link resolves to a built route', problems.size === 0, [...problems].slice(0, 8).join('; '))
  }

  // 18. Launch gate: provisional values, placeholders, search engine blocking.
  {
    const name = 'launch gate (no provisional values, placeholders, or noindex)'
    const { blockers, errors } = inspectLaunchState(ROOT)
    const summary = (items: { rule: string; where: string }[]) => items.slice(0, 6).map((i) => `${i.rule} at ${i.where}`).join('; ')
    if (errors.length) record(18, name, false, `consistency errors: ${summary(errors)}`)
    else if (blockers.length === 0) record(18, name, true, 'clear')
    else if (PREVIEW) record(18, name, true, `BYPASSED by PREVIEW=1: ${blockers.length} launch blocker(s). Not deployable to production.`)
    else record(18, name, false, `${blockers.length} launch blocker(s): ${summary(blockers)}`)
  }

  // 19. Built HTML robots meta matches indexing.json on every page.
  {
    const problems: string[] = []
    let noindex: boolean | null = null
    try {
      const value: unknown = JSON.parse(fs.readFileSync(INDEXING_FILE, 'utf8')).noindex
      if (typeof value === 'boolean') noindex = value
      else problems.push('indexing.json "noindex" is not a boolean')
    } catch {
      problems.push('indexing.json missing or unreadable')
    }
    if (noindex !== null) {
      for (const p of pages) {
        const robots = (p.$('meta[name="robots"]').attr('content') ?? '').toLowerCase()
        if (noindex && !robots.includes('noindex')) problems.push(`${p.route}: robots meta "${robots}" lacks noindex while indexing.json says noindex`)
        if (!noindex && robots.includes('noindex')) problems.push(`${p.route}: robots meta "${robots}" still says noindex`)
      }
    }
    record(19, 'robots meta on every page matches indexing.json', problems.length === 0, problems.length ? problems.slice(0, 8).join('; ') : `noindex=${noindex}`)
  }

  // 20. Lead form mode matches the build: never live in a preview, never disabled in production.
  {
    const problems: string[] = []
    const seen: string[] = []
    const formPages = pages.filter((p) => p.$(`form[data-endpoint="${CONTACT_ENDPOINT}"]`).length > 0)
    if (formPages.length === 0) problems.push('no page renders the contact form')
    for (const p of formPages) {
      p.$(`form[data-endpoint="${CONTACT_ENDPOINT}"]`).each((_, el) => {
        const mode = p.$(el).closest('[data-lead-form-mode]').attr('data-lead-form-mode')
        if (!mode) problems.push(`${p.route}: contact form is not inside the LeadForm wrapper`)
        else if (PREVIEW && mode !== 'preview-disabled') problems.push(`${p.route}: PREVIEW build, but the form is "${mode}" and would write live leads`)
        else if (!PREVIEW && mode !== 'live') problems.push(`${p.route}: production build, but lead submission is still disabled ("${mode}")`)
        else seen.push(`${p.route}=${mode}`)
      })
    }
    record(20, PREVIEW ? 'lead form cannot POST in a preview build' : 'lead form POSTs in a production build', problems.length === 0, problems.length ? problems.join('; ') : seen.join(', '))
  }

  // 21. No build command forces the preview bypass. No exemption, not even under PREVIEW=1:
  //     a repo that sets PREVIEW=1 in its own scripts can never pass a launch verify.
  {
    const problems: string[] = []
    const forced = /\bPREVIEW\s*=\s*["']?1\b/
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as { scripts?: Record<string, string> }
      for (const [name, script] of Object.entries(pkg.scripts ?? {})) {
        if (forced.test(script)) problems.push(`package.json scripts.${name} sets PREVIEW=1 ("${script}")`)
      }
    } catch {
      problems.push('package.json missing or unreadable')
    }
    const vercelFile = path.join(ROOT, 'vercel.json')
    if (fs.existsSync(vercelFile)) {
      try {
        const buildCommand = (JSON.parse(fs.readFileSync(vercelFile, 'utf8')) as { buildCommand?: string }).buildCommand
        if (buildCommand && forced.test(buildCommand)) problems.push(`vercel.json buildCommand sets PREVIEW=1 ("${buildCommand}")`)
      } catch {
        problems.push('vercel.json unreadable')
      }
    }
    record(21, 'no build command forces PREVIEW=1 (preview bypass cannot ship)', problems.length === 0, problems.length ? problems.join('; ') : 'build scripts clean')
  }

  // 22. City pages exist for exactly the cities that have real, city-specific content.
  {
    const activeRoute = path.join(ROOT, 'app/service-areas/[slug]/page.tsx')
    const parkedRoute = path.join(ROOT, 'app/service-areas/_city/[slug]/page.tsx')
    const isActive = fs.existsSync(activeRoute)
    const isParked = fs.existsSync(parkedRoute)
    const qualifying = cfg ? cfg.serviceAreas.filter((a) => a.cityPage !== null).map((a) => a.slug) : []
    const problems: string[] = []
    if (!isActive && !isParked) problems.push('the city page route is missing from app/service-areas')
    if (isActive && isParked) problems.push('the city page route exists both active and parked')
    if (qualifying.length > 0 && !isActive) {
      problems.push(`${qualifying.length} city page(s) have content (${qualifying.join(', ')}) but the route is parked: mv "app/service-areas/_city/[slug]" "app/service-areas/[slug]"`)
    }
    if (qualifying.length === 0 && isActive) {
      problems.push('no city has cityPage content, and output: export cannot build a dynamic route with no params: park it at app/service-areas/_city/[slug]')
    }
    const built = pages.filter((p) => p.route.startsWith('/service-areas/')).map((p) => p.route.slice('/service-areas/'.length))
    const extra = built.filter((slug) => !qualifying.includes(slug))
    const missing = qualifying.filter((slug) => !built.includes(slug))
    if (extra.length) problems.push(`built city page(s) with no content in config: ${extra.join(', ')}`)
    if (missing.length) problems.push(`city(ies) with content but no built page: ${missing.join(', ')}`)
    record(22, 'city pages exist only for cities with real content', problems.length === 0, problems.length ? problems.join('; ') : `${qualifying.length} city page(s); route ${isActive ? 'active' : 'parked'}`)
  }

  // 23. AI design renderings are disclosed on the page, every time they appear.
  //     Re-encoding strips the file's C2PA manifest, so the visible label IS the
  //     disclosure. A rendering (placeholders.json status starting "Rendering")
  //     must render inside a [data-rendering-frame] that contains a visible
  //     [data-rendering-label] reading "Design rendering", and its alt must start
  //     "Rendering of". This stops the label quietly disappearing later.
  //     Visualizer scene layers are matched by their data-image attribute too: only
  //     the default scene has a real src until a visitor picks another one.
  {
    const problems: string[] = []
    const register = JSON.parse(fs.readFileSync(path.join(ROOT, 'placeholders.json'), 'utf8')) as { placeholders: { file: string; status: string }[] }
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/images/manifest.json'), 'utf8')) as Record<string, { base: string; alt: string | null }>
    const renderingFiles = register.placeholders.filter((e) => /^rendering\b/i.test(e.status.trim())).map((e) => e.file)
    const byBase = new Map<string, string>()
    const renderingFiles_ = new Set(renderingFiles)
    for (const file of renderingFiles) {
      const entry = manifest[file]
      if (!entry) {
        problems.push(`${file}: registered as a rendering but missing from the manifest`)
        continue
      }
      if (!(entry.alt ?? '').trim().startsWith('Rendering of')) problems.push(`${file}: manifest alt must start "Rendering of"`)
      byBase.set(entry.base, file)
    }
    const HIDDEN_CLASS = /(^|\s)([a-z0-9]+:)*(sr-only|hidden|invisible|opacity-0)(\s|$)/
    const HIDDEN_STYLE = /display:\s*none|visibility:\s*hidden|opacity:\s*0(?![.\d])/
    let shown = 0
    for (const p of pages) {
      p.$('img').each((_, el) => {
        const img = p.$(el)
        const declared = img.attr('data-image')
        const candidates = [img.attr('src') ?? '', ...(img.attr('srcset') ?? '').split(',').map((s) => s.trim().split(/\s+/)[0] ?? '')].filter(Boolean)
        const file =
          declared && renderingFiles_.has(declared) ? declared : candidates.map((c) => byBase.get(imageKey(c))).find((f): f is string => Boolean(f))
        if (!file) return
        shown++
        if (!(img.attr('alt') ?? '').trim().startsWith('Rendering of')) problems.push(`${p.route}: ${file} alt does not start "Rendering of"`)
        const frame = img.closest('[data-rendering-frame]')
        if (frame.length === 0) {
          problems.push(`${p.route}: ${file} is not inside a [data-rendering-frame]`)
          return
        }
        const visible = frame.find('[data-rendering-label]').filter((_, label) => {
          const $label = p.$(label)
          if (!/design rendering/i.test($label.text())) return false
          const chain = $label.add($label.parentsUntil('[data-rendering-frame]'))
          return chain.toArray().every((n) => {
            const $n = p.$(n)
            return !HIDDEN_CLASS.test($n.attr('class') ?? '') && $n.attr('hidden') === undefined && !HIDDEN_STYLE.test($n.attr('style') ?? '')
          })
        })
        if (visible.length === 0) problems.push(`${p.route}: ${file} is shown without a visible "Design rendering" label`)
      })
    }
    record(
      23,
      'every AI rendering carries a visible label and a "Rendering of" alt',
      problems.length === 0,
      problems.length ? problems.slice(0, 8).join('; ') : `${renderingFiles.length} registered, ${shown} placement(s) labeled`,
    )
  }

  // 24. Google Ads tag: present in a production build, absent in a preview build. Both directions.
  //
  //     "Present" means the LOADER, not the strings. config.googleAds is part of
  //     site.config.ts, so its tag ID and labels sit in the client config chunk of
  //     every build as inert data (in a preview build ADS minifies to `let o=null`
  //     and the conversion body can never run). The executable signature is the
  //     gtag.js URL and the gtag('config', ...) call, and those appear only when
  //     components/GoogleAdsTag.tsx actually rendered, which it does only when
  //     TRACKING_MODE is live. That is what is checked here.
  {
    const problems: string[] = []
    const ads = cfg?.googleAds ?? null
    const detail: string[] = []
    if (!ads) {
      detail.push('site.config.ts has no googleAds block')
      if (!PREVIEW) problems.push('production build with no googleAds in site.config.ts: no conversion would ever be recorded')
    } else {
      const loader = `googletagmanager.com/gtag/js?id=${ads.tagId}`
      const configCall = new RegExp(`gtag\\((?:\\\\?["'])config(?:\\\\?["']),\\s*(?:\\\\?["'])${ads.tagId}(?:\\\\?["'])\\)`)
      const withLoader = pages.filter((p) => p.html.includes(loader))
      const withConfig = pages.filter((p) => configCall.test(p.html))
      const jsFiles = walk(path.join(ROOT, 'out/_next/static'), '.js')
      const jsWithLoader = jsFiles.filter((f) => fs.readFileSync(f, 'utf8').includes('googletagmanager.com/gtag/js'))
      const labels = [
        ['quoteFormSubmitLabel', ads.quoteFormSubmitLabel],
        ['clickToCallLabel', ads.clickToCallLabel],
      ] as const
      if (PREVIEW) {
        if (withLoader.length) problems.push(`${withLoader.length} page(s) load gtag.js in a PREVIEW build (first: ${withLoader[0]?.route}): a preview never POSTs, so any conversion from it is fabricated`)
        if (withConfig.length) problems.push(`${withConfig.length} page(s) carry the gtag config call in a PREVIEW build`)
        if (jsWithLoader.length) problems.push(`${jsWithLoader.length} JS chunk(s) carry the gtag.js loader in a PREVIEW build (first: ${path.relative(ROOT, jsWithLoader[0] ?? '')})`)
        detail.push(problems.length ? 'tag present' : `no gtag.js loader in ${pages.length} pages or ${jsFiles.length} chunks (tag ID remains in the config chunk as inert data)`)
      } else {
        const missingLoader = pages.filter((p) => !p.html.includes(loader)).map((p) => p.route)
        const missingConfig = pages.filter((p) => !configCall.test(p.html)).map((p) => p.route)
        if (missingLoader.length) problems.push(`${missingLoader.length} page(s) do not load gtag.js: ${missingLoader.slice(0, 4).join(', ')}`)
        if (missingConfig.length) problems.push(`${missingConfig.length} page(s) lack gtag('config', '${ads.tagId}'): ${missingConfig.slice(0, 4).join(', ')}`)
        for (const [name, value] of labels) {
          const shipped = jsFiles.some((f) => fs.readFileSync(f, 'utf8').includes(value))
          if (!shipped) problems.push(`${name} (${value}) appears in no built script: its conversion can never fire`)
        }
        detail.push(`${pages.length} pages load ${ads.tagId}; both conversion labels shipped`)
      }
      for (const [name, value] of labels) {
        if (!value.startsWith(`${ads.tagId}/`)) problems.push(`${name} does not belong to ${ads.tagId}`)
      }
    }
    record(24, PREVIEW ? 'no Google Ads tag in a preview build' : 'Google Ads tag on every page in a production build', problems.length === 0, problems.length ? problems.join('; ') : detail.join('; '))
  }

  // ---------- report ----------
  results.sort((a, b) => a.id - b.id)
  const nameWidth = Math.max(...results.map((r) => r.name.length))
  console.log('')
  console.log(`${'#'.padEnd(3)} ${'check'.padEnd(nameWidth)}  result  detail`)
  console.log(`${'-'.repeat(3)} ${'-'.repeat(nameWidth)}  ------  ------`)
  for (const r of results) {
    console.log(`${String(r.id).padEnd(3)} ${r.name.padEnd(nameWidth)}  ${r.pass ? 'PASS  ' : 'FAIL  '}  ${r.detail}`)
  }
  const failed = results.filter((r) => !r.pass)
  console.log('')
  console.log(`${results.length - failed.length}/${results.length} checks passed across ${pages.length} pages.`)
  if (failed.length) {
    console.log(`FAILED: ${failed.map((f) => `#${f.id}`).join(', ')}. Do not deploy.`)
    process.exit(1)
  }
  if (PREVIEW) console.log('All checks passed for a PREVIEW build. The launch gate was bypassed: NOT deployable to production.')
  else console.log('All checks passed.')
}

run().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err)
  process.exit(1)
})
