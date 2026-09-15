import { config } from '@/lib/config'
import Img from './Img'

/** config.images.gallery as a two-column grid of 16:9 images. Nothing renders when the list is empty. */
export default function GalleryGrid({ limit }: { limit?: number }) {
  const images = config.images.gallery.slice(0, limit)
  if (images.length === 0) return null
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {images.map((name) => (
        <li key={name} className="overflow-hidden rounded-card border border-line bg-surface">
          <Img name={name} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-video h-auto w-full object-cover" />
        </li>
      ))}
    </ul>
  )
}
