import { motion } from 'framer-motion'

/**
 * Fades + slides an element into view as it scrolls into the viewport.
 * Wrap any section/card with this to animate it in individually.
 *
 * Usage:
 *   <FadeIn><h2>Title</h2></FadeIn>
 *   <FadeIn delay={0.15} y={30}>...</FadeIn>
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 0.5,
  once = true,
  className = '',
  as = 'div',
}) {
  const Component = motion[as] || motion.div

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </Component>
  )
}
