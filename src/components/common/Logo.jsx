import { logo, logoWhite } from '../../assets/images/index.js'

export default function Logo({ size = 56, animated = true, light = false, className = '' }) {
  const logoSource = light ? logoWhite : logo

  return (
    <img
      src={logoSource}
      alt="SA Group of Hostels"
      className={`block object-contain ${animated ? 'sa-logo-animated' : ''} ${className}`}
      style={{ height: size, width: 'auto', maxWidth: size * 1.8 }}
    />
  )
}
