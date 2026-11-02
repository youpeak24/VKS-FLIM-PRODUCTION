// Plain data (no imports) — also read by vite.config.js to build sitemap.xml.
export const routes = [
  { path: '/', label: 'Home', nav: true, priority: '1.0' },
  { path: '/about', label: 'About Us', nav: true, priority: '0.8' },
  { path: '/services', label: 'Services', nav: true, priority: '0.8' },
  { path: '/contact', label: 'Contact', nav: true, priority: '0.8' },
  { path: '/privacy-policy', label: 'Privacy Policy', nav: false, priority: '0.3' },
  { path: '/terms-and-conditions', label: 'Terms & Conditions', nav: false, priority: '0.3' },
]
