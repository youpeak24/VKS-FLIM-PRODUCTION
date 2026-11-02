import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import BrandLogo from '../common/BrandLogo'
import PrimaryButton from '../common/PrimaryButton'
import MobileMenu from './MobileMenu'
import { siteConfig } from '../../data/siteConfig'

const textLinks = siteConfig.nav.filter((r) => r.path !== '/contact')
const contactLink = siteConfig.nav.find((r) => r.path === '/contact')

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-soft px-5 py-3 text-sm font-bold text-obsidian transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="container-x">
          <div
            className={`mt-3 flex items-center justify-between rounded-full border transition-[padding,background-color,border-color] duration-500 ease-cinema ${
              scrolled
                ? 'border-soft/10 bg-obsidian/75 py-2.5 pl-5 pr-2.5 backdrop-blur-md md:pl-6'
                : 'border-transparent bg-transparent py-4 pl-0 pr-0'
            }`}
          >
            <Link to="/" aria-label={`${siteConfig.name} — home`} className="rounded-full">
              <BrandLogo size="md" />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {textLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      className={({ isActive }) =>
                        `group relative block px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.24em] transition-colors duration-300 ${
                          isActive ? 'text-soft' : 'text-soft/60 hover:text-soft'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.label}
                          {isActive ? (
                            <motion.span
                              layoutId="nav-active"
                              aria-hidden="true"
                              className="absolute inset-x-5 bottom-1.5 h-[2px] rounded-full bg-aurora"
                              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-5 bottom-1.5 h-px origin-left scale-x-0 bg-soft/50 transition-transform duration-500 ease-cinema group-hover:scale-x-100"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <span className="hidden lg:inline-flex">
                <PrimaryButton to={contactLink.path} size="sm" aria-current={pathname === contactLink.path ? 'page' : undefined}>
                  {contactLink.label}
                </PrimaryButton>
              </span>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="group grid size-12 place-items-center rounded-full border border-soft/15 bg-obsidian/60 backdrop-blur lg:hidden"
              >
                <span className="sr-only">Open menu</span>
                <span aria-hidden="true" className="flex w-5 flex-col items-end gap-[5px]">
                  <span className="h-[2px] w-5 rounded-full bg-soft" />
                  <span className="h-[2px] w-3 rounded-full bg-aurora transition-all duration-300 group-hover:w-5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
