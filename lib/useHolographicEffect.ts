"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export const useHolographicEffect = (elementRef: React.RefObject<HTMLElement>) => {
  const shimmerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const shimmer = document.createElement("div")
    shimmer.style.position = "absolute"
    shimmer.style.top = "0"
    shimmer.style.left = "0"
    shimmer.style.width = "100%"
    shimmer.style.height = "100%"
    shimmer.style.background = "linear-gradient(45deg, transparent, rgba(0,255,255,0.1), transparent)"
    shimmer.style.pointerEvents = "none"
    shimmer.style.animation = "holographicDrift 8s linear infinite"
    shimmer.style.mixBlendMode = "screen"
    shimmer.style.borderRadius = "inherit"

    elementRef.current.style.position = "relative"
    elementRef.current.style.overflow = "hidden"
    elementRef.current.appendChild(shimmer)

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return
      const rect = elementRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      shimmer.style.background = `linear-gradient(45deg, transparent, rgba(0,${200 + Math.random() * 55},${200 + Math.random() * 55},0.15), transparent)`
      shimmer.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (shimmer.parentNode) {
        shimmer.parentNode.removeChild(shimmer)
      }
    }
  }, [elementRef])
}
