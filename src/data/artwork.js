/**
 * Original procedural artwork (scripts/generate-artwork.py).
 * Every entry is decorative brand artwork — not photography, not client work.
 */
import heroBurst from '../assets/artwork/hero-burst.webp'
import heroBurst800 from '../assets/artwork/hero-burst-800.webp'
import heroBurstMobile from '../assets/artwork/hero-burst-mobile.webp'
import colorMoment from '../assets/artwork/color-moment.webp'
import colorMoment1280 from '../assets/artwork/color-moment-1280.webp'
import colorMomentPortrait from '../assets/artwork/color-moment-portrait.webp'
import aboutHero from '../assets/artwork/about-hero.webp'
import aboutHero900 from '../assets/artwork/about-hero-900.webp'
import servicesHero from '../assets/artwork/services-hero.webp'
import servicesHero900 from '../assets/artwork/services-hero-900.webp'
import contactArt from '../assets/artwork/contact-art.webp'
import contactArt600 from '../assets/artwork/contact-art-600.webp'
import ctaPaint from '../assets/artwork/cta-paint.webp'
import ctaPaint1100 from '../assets/artwork/cta-paint-1100.webp'
import signatureTrail from '../assets/artwork/signature-trail.webp'
import signatureTrail1100 from '../assets/artwork/signature-trail-1100.webp'
import footerFlow from '../assets/artwork/footer-flow.webp'
import footerFlow1200 from '../assets/artwork/footer-flow-1200.webp'
import introFrame from '../assets/artwork/intro-frame.webp'
import introFrame640 from '../assets/artwork/intro-frame-640.webp'
import philosophyFrame from '../assets/artwork/philosophy-frame.webp'
import philosophyFrame640 from '../assets/artwork/philosophy-frame-640.webp'
import producerFrame from '../assets/artwork/producer-frame.webp'
import producerFrame640 from '../assets/artwork/producer-frame-640.webp'
import canvasFrame from '../assets/artwork/canvas-frame.webp'
import canvasFrame800 from '../assets/artwork/canvas-frame-800.webp'
import showreelPoster from '../assets/artwork/showreel-poster.webp'
import showreelPoster960 from '../assets/artwork/showreel-poster-960.webp'
import pillar1 from '../assets/artwork/pillar-01.webp'
import pillar1s from '../assets/artwork/pillar-01-480.webp'
import pillar2 from '../assets/artwork/pillar-02.webp'
import pillar2s from '../assets/artwork/pillar-02-480.webp'
import pillar3 from '../assets/artwork/pillar-03.webp'
import pillar3s from '../assets/artwork/pillar-03-480.webp'
import pillar4 from '../assets/artwork/pillar-04.webp'
import pillar4s from '../assets/artwork/pillar-04-480.webp'

/** Responsive image descriptor: large + small source with intrinsic size. */
export const pic = (large, small, width, height, smallWidth) => ({
  src: large,
  srcSet: small ? `${small} ${smallWidth}w, ${large} ${width}w` : undefined,
  width,
  height,
})

export const art = {
  heroBurst: pic(heroBurst, heroBurst800, 1500, 1500, 800),
  heroBurstMobile: pic(heroBurstMobile, null, 900, 900),
  colorMoment: pic(colorMoment, colorMoment1280, 2400, 1200, 1280),
  colorMomentPortrait: pic(colorMomentPortrait, null, 1000, 1400),
  aboutHero: pic(aboutHero, aboutHero900, 1800, 1200, 900),
  servicesHero: pic(servicesHero, servicesHero900, 1800, 1200, 900),
  contactArt: pic(contactArt, contactArt600, 1100, 1400, 600),
  ctaPaint: pic(ctaPaint, ctaPaint1100, 2200, 1200, 1100),
  signatureTrail: pic(signatureTrail, signatureTrail1100, 2200, 1100, 1100),
  footerFlow: pic(footerFlow, footerFlow1200, 2400, 760, 1200),
  introFrame: pic(introFrame, introFrame640, 1200, 1500, 640),
  philosophyFrame: pic(philosophyFrame, philosophyFrame640, 1200, 1500, 640),
  producerFrame: pic(producerFrame, producerFrame640, 1000, 1250, 640),
  canvasFrame: pic(canvasFrame, canvasFrame800, 1600, 1000, 800),
  showreelPoster: pic(showreelPoster, showreelPoster960, 1920, 1080, 960),
  pillars: [
    pic(pillar1, pillar1s, 900, 900, 480),
    pic(pillar2, pillar2s, 900, 900, 480),
    pic(pillar3, pillar3s, 900, 900, 480),
    pic(pillar4, pillar4s, 900, 900, 480),
  ],
}
