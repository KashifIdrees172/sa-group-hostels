import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../common/Logo.jsx'
import MobileMenu from './MobileMenu.jsx'

const links = [
  ['About', 'about'],
  ['Branches', 'branches'],
  ['Amenities', 'amenities'],
  ['Reviews', 'reviews'],
  ['Contact', 'contact'],
]

export default function Navbar({ onBookInspection }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const location = useLocation()

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -55%' },
    )

    document.querySelectorAll('section[id]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [location.pathname])

  const openInspection = () => {
    setMenuOpen(false)
    onBookInspection?.()
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/90 shadow-lg shadow-navy/5 backdrop-blur-xl border-b border-navy/10' : 'bg-cream/75 backdrop-blur-md'}`}>
      <div className={`max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 transition-all ${scrolled ? 'py-2.5' : 'py-4'}`}>
        <Link to="/#home" className="group flex items-center gap-3" aria-label="SA Group of Hostels home">
          <div className="transition-transform duration-300 group-hover:rotate-1 group-hover:scale-105">
            <Logo size={58} animated={false} />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary navigation">
          {links.map(([label, id]) => (
            <Link
              key={id}
              to={`/#${id}`}
              className={`nav-underline text-sm font-semibold transition-colors ${active === id ? 'active text-navy' : 'text-charcoal/65 hover:text-navy'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openInspection}
            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full border border-navy bg-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber hover:text-navy hover:border-amber hover:shadow-lg active:translate-y-0"
          >
            Book Inspection <span aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-xl border border-navy/15 bg-white/80 hover:border-amber hover:shadow-md active:scale-95 transition-all group"
          >
            <span className="w-5 h-0.5 bg-navy rounded group-hover:w-6 transition-all" />
            <span className="w-6 h-0.5 bg-navy rounded" />
            <span className="w-4 h-0.5 bg-navy rounded group-hover:w-6 transition-all" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onBookInspection={openInspection}
      />
    </header>
  )
}
