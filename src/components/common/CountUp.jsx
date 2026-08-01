import { useEffect, useRef, useState } from 'react'

export default function CountUp({ end, duration = 1800, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()

          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1)
            // ease-out cubic — fast start, gentle finish
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) {
              requestAnimationFrame(tick)
            } else {
              setCount(end)
            }
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
