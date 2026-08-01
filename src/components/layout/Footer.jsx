import Logo from '../common/Logo.jsx'
import SocialLinks from '../common/SocialLinks.jsx'
import branches from '../../data/branches.js'

const icon = {
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" />
    </svg>
  ),
  pin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
}

const quickLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Branches', href: '/#branches' },
  { label: 'Amenities', href: '/#amenities' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/#contact' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-cream mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* brand */}
        <div>
          <a href="/#home" className="group inline-block">
            <div className="transition-transform duration-300 group-hover:scale-105">
              <Logo size={72} animated={false} light />
            </div>
          </a>
          <p className="text-sm font-semibold text-cream mt-4">
            Stay Safe · Study Better · Achieve More
          </p>
          <p className="text-sm text-cream/70 mt-3 max-w-xs">
            Affordable, secure hostel living for students and professionals across
            four branches in Lahore.
          </p>
          <div className="mt-4">
            <SocialLinks className="text-cream" />
          </div>
        </div>

        {/* quick links */}
        <div>
          <h4 className="font-display font-bold text-cream mb-1">Quick Links</h4>
          <div className="w-8 h-0.5 bg-amber mb-4" />
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-cream/75 hover:text-amber transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h4 className="font-display font-bold text-cream mb-1">Contact</h4>
          <div className="w-8 h-0.5 bg-amber mb-4" />
          <ul className="space-y-3 text-sm text-cream/75">
            <li className="flex items-center gap-2.5">
              <span className="text-amber">{icon.phone}</span>
              <a href="https://wa.me/923294234986" className="hover:text-amber transition-colors">0329-4234986</a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-amber">{icon.calendar}</span>
              <a href="/#contact" className="hover:text-amber transition-colors">Book Inspection</a>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber mt-0.5">{icon.mail}</span>
              <div className="space-y-1">
                <a href="mailto:reception@sagrouphostels.com" className="block hover:text-amber transition-colors">reception@sagrouphostels.com</a>
                <a href="mailto:bookings@sagrouphostels.com" className="block hover:text-amber transition-colors">bookings@sagrouphostels.com</a>
                <a href="mailto:info@sagrouphostels.com" className="block hover:text-amber transition-colors">info@sagrouphostels.com</a>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-amber">{icon.pin}</span>
              <a href="https://maps.google.com/?q=Thokar+Niaz+Baig+Lahore" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">View on Google Maps</a>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber mt-0.5">{icon.clock}</span>
              <span>Monday – Saturday<br />9:00 AM – 9:00 PM</span>
            </li>
          </ul>
        </div>

        {/* branches */}
        <div>
          <h4 className="font-display font-bold text-cream mb-1">Our Branches</h4>
          <div className="w-8 h-0.5 bg-amber mb-4" />
          <ul className="space-y-2.5">
            {branches.map((branch) => (
              <li key={branch.id} className="flex items-center gap-2 text-sm text-cream/75">
                <span className="text-amber">{icon.check}</span>
                {branch.location.split(',')[0]}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="text-center text-xs text-cream/50 border-t border-cream/10 py-4">
        © {new Date().getFullYear()} SA Group of Hostels. All rights reserved.
      </div>
    </footer>
  )
}
