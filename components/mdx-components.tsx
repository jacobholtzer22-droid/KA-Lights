import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'
import AreaList from './AreaList'
import Credentials from './Credentials'
import GalleryGrid from './GalleryGrid'
import Img from './Img'
import Phone from './Phone'
import ServiceGrid from './ServiceGrid'

/**
 * Everything a content file may use. Facts arrive through these components and
 * the per-page ones added in lib/content.ts (<ServiceDescription />,
 * <ServicePriceNote />, <ServiceName />, <AreaName />). JavaScript expressions
 * are NOT available: next-mdx-remote 6 deletes them silently, and lib/content.ts
 * fails the build if one appears.
 */

function H1(): never {
  throw new Error(
    'Content files must not contain an H1 ("# ..."). The page template renders the H1 from config. Start the file at "## ".',
  )
}

function Anchor({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const internal = href.startsWith('/')
  if (internal) {
    return (
      <Link href={href} className="font-medium text-accent underline-offset-2 hover:underline" {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} rel="noopener" target={href.startsWith('http') ? '_blank' : undefined} className="font-medium text-accent underline-offset-2 hover:underline" {...rest}>
      {children}
    </a>
  )
}

export const mdxComponents: MDXComponents = {
  h1: H1,
  h2: (props) => <h2 className="mt-12 font-heading text-step-3 font-bold text-ink first:mt-0" {...props} />,
  h3: (props) => <h3 className="mt-8 font-heading text-step-2 font-semibold text-ink" {...props} />,
  p: (props) => <p className="mt-4 text-step-0 leading-relaxed text-ink-soft" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-soft" {...props} />,
  li: (props) => <li {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  blockquote: (props) => <blockquote className="mt-6 border-l-4 border-accent pl-4 italic text-muted" {...props} />,
  hr: () => <hr className="my-10 border-line" />,
  a: Anchor,
  Phone,
  Img,
  GalleryGrid,
  ServiceGrid,
  AreaList,
  Credentials,
}
