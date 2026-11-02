import { pic } from './artwork.js'

const images = import.meta.glob('../assets/project-posters/*.webp', { eager: true, import: 'default' })
const file = (name) => images[`../assets/project-posters/${name}.webp`]

/**
 * FEATURED PRODUCTIONS
 *
 * Every entry below is DEMO CONTENT with abstract placeholder artwork.
 * Replace with the client's real productions (official posters, stills,
 * titles, descriptions and trailers) before launch, then set isDemo: false.
 *
 * Fields:
 *   title        — official project title
 *   category     — production type, as supplied by the client
 *   description  — one or two sentences
 *   poster       — portrait poster (pic(large, small, width, height, smallWidth))
 *   gallery      — array of { image, alt }
 *   youtubeId    — trailer video ID, or null when no trailer exists
 *   isDemo       — shows a visible "Demo" label while true
 */
const demo = (n, title, category, description) => {
  const id = String(n).padStart(2, '0')
  return {
    id: `demo-${id}`,
    title,
    category,
    description,
    poster: pic(file(`demo-${id}`), file(`demo-${id}-540`), 900, 1260, 540),
    gallery: [1, 2].map((g) => ({
      image: pic(file(`demo-${id}-still-${g}`), null, 1400, 800),
      alt: `Abstract placeholder artwork ${g} for ${title}`,
    })),
    youtubeId: null,
    isDemo: true,
  }
}

export const projects = [
  demo(1, 'Sample Feature Film', 'Feature Film', 'Placeholder entry. The client’s official title, poster and synopsis will appear here.'),
  demo(2, 'Sample Short Film', 'Short Film', 'Placeholder entry for a short-form production. Replace with real project details.'),
  demo(3, 'Sample Music Video', 'Music Video', 'Placeholder entry for a music video. Replace with the official artwork and description.'),
  demo(4, 'Sample Promotional Film', 'Promotional Film', 'Placeholder entry for promotional work. Replace with real campaign details.'),
  demo(5, 'Sample Documentary', 'Documentary', 'Placeholder entry for a documentary. Replace with the official synopsis.'),
  demo(6, 'Sample Web Series', 'Web Series', 'Placeholder entry for an episodic production. Replace with real details.'),
]
