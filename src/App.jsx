import { Suspense, lazy, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'motion/react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import PageTransition from './components/layout/PageTransition'
import ScrollToTop from './components/layout/ScrollToTop'
import Seo from './components/common/Seo'
import { ScrollTrigger } from './lib/gsap'

const pages = {
  home: () => import('./pages/Home'),
  about: () => import('./pages/About'),
  services: () => import('./pages/Services'),
  contact: () => import('./pages/Contact'),
  privacy: () => import('./pages/PrivacyPolicy'),
  terms: () => import('./pages/TermsConditions'),
}

const Home = lazy(pages.home)
const About = lazy(pages.about)
const Services = lazy(pages.services)
const Contact = lazy(pages.contact)
const PrivacyPolicy = lazy(pages.privacy)
const TermsConditions = lazy(pages.terms)

function NotFound() {
  return (
    <section className="container-x grid min-h-[100svh] w-full place-content-center py-32 text-center">
      <Seo path="/__not-found" noindex />
      <p className="eyebrow text-cyan">Error 404</p>
      <h1 className="display-xl mt-6">Scene not found.</h1>
      <p className="lede mx-auto mt-6">The page you were looking for isn&rsquo;t part of this production.</p>
      <Link to="/" className="mx-auto mt-10 inline-flex min-h-12 items-center rounded-full bg-soft px-7 text-sm font-bold uppercase tracking-[0.2em] text-obsidian">
        Back to home
      </Link>
    </section>
  )
}

/** Reserves the viewport while a route chunk loads, so there is no layout flash. */
function RouteFallback() {
  return <div className="min-h-[100svh]" aria-busy="true" />
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    // Warm the remaining route chunks once the first page is idle — avoids a flash on navigation.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500))
    const id = idle(() => Object.values(pages).forEach((load) => load()))
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden="true" className="film-grain" />
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            window.scrollTo(0, 0)
            requestAnimationFrame(() => ScrollTrigger.refresh())
          }}
        >
          <PageTransition key={location.pathname}>
            <Suspense fallback={<RouteFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsConditions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </MotionConfig>
  )
}
