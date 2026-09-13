import { config } from '@/lib/config'
import Img from './Img'

/**
 * config.images.gallery on a full-dark section: the homepage's guaranteed
 * change of visual treatment. Nothing renders when the list is empty.
 */
export default function Gallery({ heading = 'Recent Work' }: { heading?: string }) {
  const images = config.images.gallery
  if (images.length === 0) return null
  return (
    <section className="bg-primary-dark text-on-primary">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <h2 className="font-heading text-3xl font-bold md:text-4xl">{heading}</h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((name, i) => (
            <figure key={name} className={`overflow-hidden rounded-site ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}>
              <Img
                name={name}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
