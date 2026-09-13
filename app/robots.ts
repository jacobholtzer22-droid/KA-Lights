import type { MetadataRoute } from 'next'
import { config } from '@/lib/config'

export const dynamic = 'force-static'

/** AI crawlers explicitly allowed so answer engines can cite the site. */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Amazonbot',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }, ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/' }))],
    sitemap: new URL('/sitemap.xml', config.domain).toString(),
    host: config.domain,
  }
}
