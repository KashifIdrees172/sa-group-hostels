import { motion } from 'framer-motion'

// Parent controls the stagger timing between its children.
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

// Each child fades/slides in on its own as the container reveals.
export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

/**
 * Wrap a grid of items with this so each child animates in
 * separately (staggered) instead of the whole block popping in at once.
 */
export default function StaggerGrid({ children, className = '', stagger = 0.08, delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  )
}
