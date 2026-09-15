import type { Metadata } from 'next'
import AppSection from '@/components/AppSection'
import CrewSection from '@/components/CrewSection'
import DifferenceSection from '@/components/DifferenceSection'
import FeatureCards from '@/components/FeatureCards'
import GalleryTeaser from '@/components/GalleryTeaser'
import Hero from '@/components/Hero'
import JsonLd from '@/components/JsonLd'
import ProcessSteps from '@/components/ProcessSteps'
import QuoteSection from '@/components/QuoteSection'
import ServiceAreaStrip from '@/components/ServiceAreaStrip'
import VisualizerSection from '@/components/VisualizerSection'
import { localBusiness, organization, website } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export function generateMetadata(): Metadata {
  return buildMetadata({ kind: 'home', path: '/' }).metadata
}

/** Section order matches the current site. Sections whose copy is entirely held render nothing. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusiness()} />
      <JsonLd data={organization()} />
      <JsonLd data={website()} />

      <Hero />
      <ServiceAreaStrip />
      <VisualizerSection />
      <FeatureCards />
      <GalleryTeaser />
      <AppSection />
      <CrewSection />
      <ProcessSteps />
      <DifferenceSection />
      <QuoteSection />
    </>
  )
}
