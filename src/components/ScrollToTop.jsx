import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '')
      const timeoutId = setTimeout(() => {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 60)
      return () => clearTimeout(timeoutId)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

