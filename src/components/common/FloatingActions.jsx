const actions = [
  {
    label: 'WhatsApp Reception',
    href: 'https://wa.me/923294234986',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Our Location',
    href: 'https://maps.google.com/?q=Thokar+Niaz+Baig+Lahore',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

export default function FloatingActions({ onBookInspection }) {
  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
      {actions.map((action, i) => (
        <a
          key={action.label}
          href={action.href}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          aria-label={action.label}
          title={action.label}
          style={{ animationDelay: `${i * 100}ms` }}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-navy border border-navy/10 transition-all duration-300 ease-out hover:scale-110 hover:bg-amber hover:text-white hover:shadow-xl active:scale-95 animate-[floatIn_0.5s_ease-out_backwards]"
        >
          {action.icon}
        </a>
      ))}

      <button
        type="button"
        onClick={onBookInspection}
        aria-label="Book Inspection"
        title="Book Inspection"
        style={{ animationDelay: '200ms' }}
        className="group relative w-12 h-12 rounded-full bg-amber shadow-lg flex items-center justify-center text-navy border border-amber-dark/10 transition-all duration-300 ease-out hover:scale-110 hover:bg-navy hover:text-white hover:shadow-xl active:scale-95 animate-[floatIn_0.5s_ease-out_backwards]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100">Book Inspection</span>
      </button>
    </div>
  )
}
