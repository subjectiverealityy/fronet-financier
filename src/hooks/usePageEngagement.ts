import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackDwellTime, trackScrollDepth } from '@/lib/ga'

const SCROLL_THRESHOLDS = [25, 50, 75, 100]

export function usePageEngagement() {
  const location = useLocation()
  const startTimeRef = useRef<number>(Date.now())
  const reachedThresholdsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    startTimeRef.current = Date.now()
    reachedThresholdsRef.current = new Set()

    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      if (documentHeight <= 0) return

      const scrollPercent = Math.min(100, Math.max(0, (window.scrollY / documentHeight) * 100))

      for (const threshold of SCROLL_THRESHOLDS) {
        if (scrollPercent >= threshold && !reachedThresholdsRef.current.has(threshold)) {
          reachedThresholdsRef.current.add(threshold)
          trackScrollDepth(location.pathname, threshold)
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      const dwellMs = Date.now() - startTimeRef.current
      trackDwellTime(location.pathname, dwellMs)
    }
  }, [location.pathname])
}
