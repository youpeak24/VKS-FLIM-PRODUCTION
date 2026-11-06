import { pic } from './artwork.js'
import { serviceCopy } from './serviceCopy.js'

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
 * PROPOSED service categories — pending client confirmation (wording lives in serviceCopy.js).
 * Do not present these as a verified list of offerings until approved.
 */
export const services = serviceCopy.map((s, i) => ({ ...s, image: image(i + 1) }))

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
