import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../common/Logo.jsx'

const navItems = [
  { label: 'Home', to: '/#home', id: 'home' },
  { label: 'About', to: '/#about', id: 'about' },
  { label: 'Branches', to: '/#branches', id: 'branches' },
  { label: 'Amenities', to: '/#amenities', id: 'amenities' },
  { label: 'Reviews', to: '/#reviews', id: 'reviews' },
  { label: 'Contact', to: '/#contact', id: 'contact' },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MobileMenu({ open, onClose, onBookInspection }) {
  const closeButtonRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const currentHash = location.hash.replace('#', '') || (location.pathname === '/' ? 'home' : '')

  return createPortal(
    <div className="mobile-menu-layer" role="presentation">
      <button
        type="button"
        className="mobile-menu-backdrop"
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <aside
        className="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="relative overflow-hidden border-b border-navy/10 bg-gradient-to-br from-white via-white to-amber/10 px-6 pb-6 pt-5">
          <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-amber/15 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <Link to="/#home" onClick={onClose} className="group flex min-w-0 items-center gap-3">
              <div className="shrink-0 transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105">
                <Logo size={64} animated={false} />
              </div>
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-navy/10 bg-white text-navy shadow-sm transition-all duration-200 hover:rotate-90 hover:border-amber hover:bg-amber/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/25 active:scale-95"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-[.24em] text-charcoal/40">Navigation</p>

          <nav className="mt-3 space-y-1" aria-label="Mobile navigation links">
            {navItems.map((item, index) => {
              const active = location.pathname === '/' && currentHash === item.id

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  style={{ animationDelay: `${index * 35}ms` }}
                  className={`mobile-menu-link group ${active ? 'mobile-menu-link--active' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full transition-all ${active ? 'bg-amber shadow-[0_0_0_5px_rgba(240,168,60,.16)]' : 'bg-navy/15 group-hover:bg-amber'}`} />
                    {item.label}
                  </span>
                  <span className="text-amber transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-6">
            <div className="rounded-3xl border border-navy/10 bg-navy/[.035] p-4">
              <p className="text-xs font-bold text-navy">Plan a hostel visit</p>
              <p className="mt-1 text-xs leading-5 text-charcoal/55">Choose your preferred branch and inspection date.</p>

              <button
                type="button"
                onClick={() => {
                  onClose()
                  window.setTimeout(() => onBookInspection?.(), 0)
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-navy px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-navy/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber hover:text-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/30 active:translate-y-0"
              >
                <CalendarIcon />
                Book Inspection
              </button>
            </div>

            <a
              href="https://wa.me/923294234986"
              className="mt-3 flex items-center justify-between rounded-2xl border border-navy/10 bg-white px-4 py-3 text-sm transition-all hover:border-amber/60 hover:shadow-md"
            >
              <span>
                <span className="block text-xs font-bold text-navy">Call Reception</span>
                <span className="mt-0.5 block text-xs text-charcoal/50">+92 300 0000000</span>
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-amber/15 text-navy">☎</span>
            </a>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
