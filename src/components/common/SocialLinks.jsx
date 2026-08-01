import { facebookIcon, instagramIcon, whatsappIcon } from '../../assets/images/index.js'

const links = [
  { label: 'Facebook', url: 'https://facebook.com/sagroupofhostels', icon: facebookIcon },
  { label: 'Instagram', url: 'https://instagram.com/sagroupofhostels', icon: instagramIcon },
  { label: 'WhatsApp', url: 'https://wa.me/923294234986', icon: whatsappIcon },
]

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="group grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber hover:shadow-lg"
        >
          <img src={link.icon} alt="" aria-hidden="true" className="h-11 w-11 object-cover transition-transform duration-300 group-hover:scale-110" />
        </a>
      ))}
    </div>
  )
}
