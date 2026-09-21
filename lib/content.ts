import fs from 'node:fs'
import path from 'node:path'
import { compileMDX } from 'next-mdx-remote/rsc'
import { createElement, Fragment, type ReactElement } from 'react'
import { mdxComponents } from '@/components/mdx-components'
import type { Service, ServiceArea } from './config-schema'

export const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface Frontmatter {
  /** Meta description override, 140 to 160 characters. */
  description?: string
  /** Manifest filename for this page's lead image (also used for og:image). */
  image?: string
}

export interface LoadedContent {
  content: ReactElement
  frontmatter: Frontmatter
}

export function contentExists(relPath: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, relPath))
}

export function readFrontmatter(relPath: string): Frontmatter {
  const file = path.join(CONTENT_DIR, relPath)
  if (!fs.existsSync(file)) return {}
  const raw = fs.readFileSync(file, 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match?.[1]) return {}
  const fm: Frontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (!m) continue
    const key = m[1] as keyof Frontmatter
    const value = (m[2] ?? '').trim().replace(/^["']|["']$/g, '')
    if (key === 'description' || key === 'image') fm[key] = value
  }
  return fm
}

/**
 * next-mdx-remote 6 removes every JavaScript expression from MDX without an
 * error (blockJS, on by default, and it stays on). "{service.priceNote}" would
 * compile to nothing, the build would pass, and the sentence would ship with a
 * hole in it. So an expression in a content file is a build failure here.
 */
function assertNoJsExpressions(relPath: string, source: string): void {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---/, (fm) => fm.replace(/[^\n]/g, ' '))
  const hits: string[] = []
  body.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/\{[^}]*\}?/g)) hits.push(`  content/${relPath}:${i + 1}  ${m[0].slice(0, 60)}`)
  })
  if (hits.length) {
    throw new Error(
      `JavaScript expressions are not allowed in content files. next-mdx-remote 6 deletes them silently, leaving a blank in the sentence.\n` +
        `Use a component instead: <ServiceDescription />, <ServicePriceNote />, <ServiceName />, <AreaName />, <Phone />.\n${hits.join('\n')}`,
    )
  }
}

/**
 * Compile one MDX file from content/ with the fixed component library. Prose
 * gets facts through components (<Phone />, <ServiceDescription />), never
 * through a JavaScript expression and never as a bare typed fact.
 */
export async function loadContent(
  relPath: string,
  scope: { service?: Service; area?: ServiceArea } = {},
): Promise<LoadedContent> {
  const file = path.join(CONTENT_DIR, relPath)
  if (!fs.existsSync(file)) {
    throw new Error(`Missing content file: content/${relPath}. Every route in config needs a matching MDX file.`)
  }
  const source = fs.readFileSync(file, 'utf8')
  assertNoJsExpressions(relPath, source)
  // The page's own service or area, as prop-less components, since an expression cannot carry them any more.
  const fact = (name: string, value: string | null | undefined) => () => {
    if (value === null || value === undefined || value === '') {
      throw new Error(`<${name} /> is used in content/${relPath}, but there is no value for it on this page.`)
    }
    return createElement(Fragment, null, value)
  }
  const pageFacts = {
    ServiceName: fact('ServiceName', scope.service?.name),
    ServiceDescription: fact('ServiceDescription', scope.service?.shortDescription),
    ServicePriceNote: fact('ServicePriceNote', scope.service?.priceNote),
    AreaName: fact('AreaName', scope.area?.name),
  }
  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    components: { ...mdxComponents, ...pageFacts },
    // blockJS is left at its default (true). No scope is passed: nothing in content can read it.
    options: { parseFrontmatter: true },
  })
  return { content, frontmatter: frontmatter ?? {} }
}
