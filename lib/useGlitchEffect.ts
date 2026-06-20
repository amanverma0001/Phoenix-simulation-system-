"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export const useGlitchEffect = (elementRef: React.RefObject<HTMLElement | null>) => {
  const glitchIntervalRef = useRef<any>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const triggerGlitch = () => {
      const glitchType = Math.random()
      const element = elementRef.current
      if (!element) return

      if (glitchType < 0.5) {
        // RGB Split glitch
        element.style.animation = "none"
        setTimeout(() => {
          element.style.animation = "rgbSplitGlitch 0.1s ease-in-out"
        }, 10)
      } else {
        // Scan line glitch
        element.style.animation = "none"
        setTimeout(() => {
          element.style.animation = "scanGlitch 0.15s ease-in-out"
        }, 10)
      }
    }

    glitchIntervalRef.current = setInterval(
      () => {
        triggerGlitch()
      },
      15000 + Math.random() * 15000,
    )

    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
    }
  }, [elementRef])

  const triggerGlitch = (intensity: "subtle" | "intense" = "subtle") => {
    const element = elementRef.current
    if (!element) return

    if (intensity === "intense") {
      element.style.animation = "none"
      setTimeout(() => {
        element.style.animation = "intenseGlitch 0.3s ease-in-out"
      }, 10)
    } else {
      element.style.animation = "none"
      setTimeout(() => {
        element.style.animation = "subtleGlitch 0.2s ease-in-out"
      }, 10)
    }
  }

  return { triggerGlitch }
}
