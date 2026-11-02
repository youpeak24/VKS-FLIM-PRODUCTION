import { pic } from './artwork.js'

const images = import.meta.glob('../assets/services/service-*.webp', { eager: true, import: 'default' })
const image = (n) => {
  const id = String(n).padStart(2, '0')
  return pic(
    images[`../assets/services/service-${id}.webp`],
    images[`../assets/services/service-${id}-720.webp`],
    1400,
    1000,
    720,
  )
}

/**
 * PROPOSED service categories — pending client confirmation.
 * Do not present these as a verified list of offerings until approved.
 *
 * accent: one of the brand accent tokens (cyan | magenta | orange | violet | yellow | blue)
 */
export const services = [
  {
    slug: 'film-production',
    number: '01',
    title: 'Film Production',
    short: 'Creative storytelling brought to life through thoughtful production and cinematic execution.',
    long: 'From the first page of a story to the last day on set, production is where imagination meets planning. We bring ideas to the screen with care for every creative and practical decision along the way.',
    accent: 'cyan',
    image: image(1),
  },
  {
    slug: 'creative-direction',
    number: '02',
    title: 'Creative Direction',
    short: 'Shaping visual ideas into compelling creative concepts.',
    long: 'Every memorable visual begins with a clear point of view. Creative direction shapes tone, palette, rhythm and mood so that every frame speaks the same language.',
    accent: 'magenta',
    image: image(2),
  },
  {
    slug: 'cinematography',
    number: '03',
    title: 'Cinematography',
    short: 'Capturing atmosphere, emotion, and unforgettable visual moments.',
    long: 'Light, lens and movement are the grammar of cinema. Cinematography turns a moment into atmosphere and a scene into a feeling the audience carries with them.',
    accent: 'orange',
    image: image(3),
  },
  {
    slug: 'post-production',
    number: '04',
    title: 'Post-Production',
    short: 'Bringing footage, sound, pacing, and visual storytelling together.',
    long: 'The story is written once more in the edit. Pacing, sound and colour come together in post-production to give the finished film its final shape and voice.',
    accent: 'violet',
    image: image(4),
  },
  {
    slug: 'promotional-films',
    number: '05',
    title: 'Promotional Films',
    short: 'Crafting powerful moving-image content that helps stories connect with audiences.',
    long: 'Trailers, teasers and promotional pieces are short films with a big job. They distil a story into moments that spark curiosity and connect with the right audience.',
    accent: 'yellow',
    image: image(5),
  },
  {
    slug: 'visual-storytelling',
    number: '06',
    title: 'Visual Storytelling',
    short: 'Combining creativity and cinematic language to communicate meaningful ideas.',
    long: 'Some ideas are best understood when they are seen. Visual storytelling uses cinematic language to make meaningful messages clear, human and memorable.',
    accent: 'magenta',
    image: image(6),
  },
]

/** Inquiry types offered in the contact form. */
export const inquiryTypes = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: 'collaboration', label: 'Creative Collaboration' },
  { value: 'other', label: 'Something Else' },
]

/** Proposed creative process — not a formally established client workflow. */
export const processSteps = [
  { number: '01', title: 'Discover', text: 'Understand the vision.' },
  { number: '02', title: 'Conceptualize', text: 'Develop the creative direction.' },
  { number: '03', title: 'Create', text: 'Bring ideas into production.' },
  { number: '04', title: 'Refine', text: 'Shape the final experience.' },
]
