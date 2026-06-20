"use client"

import { useEffect, useRef } from "react"

export function usePerformanceOptimizations() {
  const requestIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Enable will-change on animated elements, but remove after animation
    const handleAnimationEnd = (e: AnimationEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.style.willChange = "auto"
      }
    }

    document.addEventListener("animationend", handleAnimationEnd)

    // Throttle mouse move events for performance
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Handle mouse move effects here
          ticking = false
        })
        ticking = true
      }
    }

    document.addEventListener("mousemove", handleMouseMove, { passive: true })

    // Debounce resize events
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        // Handle resize here
      }, 150)
    }

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      document.removeEventListener("animationend", handleAnimationEnd)
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current)
      }
    }
  }, [])

  // Report web vitals for performance monitoring
  useEffect(() => {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver(() => {
          // Performance metrics collected silently
        })

        observer.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] })

        return () => observer.disconnect()
      } catch (e) {
        // Gracefully handle if PerformanceObserver is not supported
      }
    }
  }, [])
}
