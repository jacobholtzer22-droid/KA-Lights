import type { Metadata } from 'next'
import ContactDetails from '@/components/ContactDetails'
import LeadForm from '@/components/LeadForm'
import JsonLd from '@/components/JsonLd'
import PageHeader from '@/components/PageHeader'
import { loadContent, readFrontmatter } from '@/lib/content'
import { pageH1, pageIntro } from '@/lib/headings'
import { breadcrumbList } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

const CONTENT = 'contact.mdx'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export function generateMetadata(): Metadata {
  const fm = readFrontmatter(CONTENT)
  return buildMetadata({ kind: 'contact', path: '/contact', description: fm.description, image: fm.image }).metadata
}

export default async function ContactPage() {
  const { content } = await loadContent(CONTENT)
  return (
    <>
      <JsonLd data={breadcrumbList(CRUMBS)} />
      <PageHeader display={{ text: 'Contact', highlight: null }} title={pageH1.contact()} intro={pageIntro()} />
      <div className="mx-auto grid max-w-page gap-10 px-4 pb-16 md:pb-24 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          <article className="mb-8">{content}</article>
          <LeadForm />
        </div>
        <aside>
          <ContactDetails />
        </aside>
      </div>
    </>
  )
}
