import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    // Prevent the browser from restoring the previous scroll position after refresh.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  useEffect(() => {
    // A refresh should always start from the top of the current page.
    if (firstRender.current) {
      firstRender.current = false
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return undefined
    }

    if (hash) {
      const timer = window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1))
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)

      return () => window.clearTimeout(timer)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return undefined
  }, [pathname, hash])

  return null
}
