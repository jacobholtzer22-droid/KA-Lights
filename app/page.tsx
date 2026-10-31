import type { Metadata } from 'next'
import CrewSection from '@/components/CrewSection'
import DifferenceSection from '@/components/DifferenceSection'
import FeatureCards from '@/components/FeatureCards'
import GalleryTeaser from '@/components/GalleryTeaser'
import Hero from '@/components/Hero'
import JsonLd from '@/components/JsonLd'
import ProcessSteps from '@/components/ProcessSteps'
import QuoteSection from '@/components/QuoteSection'
import ServiceAreaStrip from '@/components/ServiceAreaStrip'
import TrustStrip from '@/components/TrustStrip'
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
      <TrustStrip />
      {/*
        Order differs by width, so each gets what it needs:
        - Phones lead with the thing visitors came to play with (the visualizer stage),
          because the crew band pushed the visualizer 2.8 screens down.
        - From lg the crew band comes first, directly under the hero, as on desktop before.
        Source order follows the phone layout, so the reading and tab order match what most
        visitors see; a desktop keyboard user meets the crew band after the stage instead of
        before it. Section grounds alternate base / alt for rhythm.
      */}
      <div className="flex flex-col">
        <div className="order-1 lg:order-2">
          <VisualizerSection />
        </div>
        {/* The crew photos are the only real images on the site, so they stay high in both layouts. */}
        <div className="order-2 lg:order-1">
          <CrewSection tone="alt" />
        </div>
      </div>
      <ServiceAreaStrip tone="base" />
      <FeatureCards tone="alt" />
      <GalleryTeaser tone="base" />
      <ProcessSteps tone="alt" />
      <DifferenceSection />
      <QuoteSection tone="base" />
    </>
  )
}
