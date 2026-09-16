import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollReveal() {
  const location = useLocation()

  useEffect(() => {
    const selector = '.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    )

    const observeElements = () => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => {
        if (!el.classList.contains('is-revealed')) {
          observer.observe(el)
        }
      })
    }

    observeElements()

    const mutationObserver = new MutationObserver(() => {
      observeElements()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [location.pathname])
}
