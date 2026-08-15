import { whatsappIcon } from '../../assets/images/index.js'

const socialLinks = [
  {
    label: 'WhatsApp',
    url: 'https://wa.me/923193815068',
    icon: whatsappIcon,
  },
]

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center
                     shadow-md transition-all duration-300
                     hover:-translate-y-1 hover:shadow-lg hover:scale-105"
        >
          <img
            src={social.icon}
            alt="WhatsApp"
            className="w-8 h-8 object-contain"
          />
        </a>
      ))}
    </div>
  )
}