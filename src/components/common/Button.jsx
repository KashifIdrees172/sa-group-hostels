import { Link } from 'react-router-dom'

export default function Button({ children, href, to, onClick, variant = 'primary', type = 'button', className = '', ...props }) {
  const base = 'btn-animated inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber/30 disabled:opacity-60 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-navy text-cream hover:bg-navy-soft',
    secondary: 'bg-amber text-navy hover:bg-amber-soft',
    outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-cream',
    light: 'bg-white text-navy hover:bg-cream',
  }
  const classes = `${base} ${variants[variant]} ${className}`

  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>
  if (href) return <a href={href} className={classes} {...props}>{children}</a>
  return <button type={type} onClick={onClick} className={classes} {...props}>{children}</button>
}
