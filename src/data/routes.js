// Plain data (no imports) — read by the React app AND by the build-time SEO plugin
// (scripts/vite-seo-plugin.js) to generate per-route <head> tags, JSON-LD, sitemap.xml
// and crawlable fallback content. Edit titles / descriptions HERE only.
//
// Title budget: ≤ ~60 characters. Description budget: ≤ ~155 characters.

export const routes = [
  {
    path: '/',
    label: 'Home',
    nav: true,
    priority: '1.0',
    schemaType: 'WebPage',
    title: 'VKS Film Production | Film Production & Visual Storytelling',
    description:
      'VKS Film Production brings powerful ideas, captivating visuals and creative storytelling together — film production, cinematography and post-production.',
    h1: 'We don’t just make films. We create magic.',
    intro:
      'Where powerful ideas, captivating visuals, and creative storytelling come together to create unforgettable cinematic experiences.',
    sources: ['src/pages/Home.jsx', 'src/components/home'],
  },
  {
    path: '/about',
    label: 'About Us',
    nav: true,
    priority: '0.8',
    schemaType: 'AboutPage',
    title: 'About VKS Film Production | Producer S. Vijay Krishnan',
    description: 'Discover the creative vision and passion behind VKS Film Production, and meet producer S. Vijay Krishnan.',
    h1: 'A world of stories. A passion for cinema.',
    intro:
      'VKS Film Production was created around a simple belief: every idea carries a story waiting to be seen. We approach each project as a canvas — a place where imagination, colour and craft meet. The company is led by producer S. Vijay Krishnan, guiding each project from the first conversation to the final frame.',
    sources: ['src/pages/About.jsx'],
  },
  {
    path: '/services',
    label: 'Services',
    nav: true,
    priority: '0.8',
    schemaType: 'WebPage',
    title: 'Film Production Services | VKS Film Production',
    description:
      'Film production, creative direction, cinematography, post-production, promotional films and visual storytelling from VKS Film Production.',
    h1: 'Every idea deserves the perfect execution.',
    intro: 'Exploring the creative process from initial concept to cinematic presentation.',
    sources: ['src/pages/Services.jsx', 'src/data/serviceCopy.js'],
  },
  {
    path: '/contact',
    label: 'Contact',
    nav: true,
    priority: '0.8',
    schemaType: 'ContactPage',
    title: 'Contact VKS Film Production | Start Your Film Project',
    description:
      'Got an idea? Contact VKS Film Production — call producer S. Vijay Krishnan on +91 90876 15708, email or WhatsApp to start your film project.',
    h1: 'Got an idea? Let’s make it cinematic.',
    intro: 'From your first idea to your next big production, the conversation starts here.',
    sources: ['src/pages/Contact.jsx', 'src/data/company.js'],
  },
  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
    nav: false,
    priority: '0.3',
    schemaType: 'WebPage',
    title: 'Privacy Policy | VKS Film Production',
    description:
      'How VKS Film Production handles information shared through this website, email, phone and WhatsApp.',
    h1: 'Privacy Policy',
    intro: 'How VKS Film Production handles information shared through this website, email, phone and WhatsApp.',
    sources: ['src/pages/PrivacyPolicy.jsx'],
  },
  {
    path: '/terms-and-conditions',
    label: 'Terms & Conditions',
    nav: false,
    priority: '0.3',
    schemaType: 'WebPage',
    title: 'Terms & Conditions | VKS Film Production',
    description: 'Terms and conditions for using the VKS Film Production website.',
    h1: 'Terms & Conditions',
    intro: 'Terms and conditions for using the VKS Film Production website.',
    sources: ['src/pages/TermsConditions.jsx'],
  },
]

/** Shown (with noindex) for any URL that is not a real route. */
export const notFound = {
  title: 'Page not found | VKS Film Production',
  description: 'This page could not be found.',
}

export const routeByPath = (path) => routes.find((r) => r.path === path)
