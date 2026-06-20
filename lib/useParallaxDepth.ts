"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export const useParallaxDepth = (containerRef: React.RefObject<HTMLElement>) => {
  const parallaxLayersRef = useRef<Map<HTMLElement, number>>(new Map())

  useEffect(() => {
    if (!containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const offsetX = (e.clientX - centerX) * 0.05
      const offsetY = (e.clientY - centerY) * 0.05

      parallaxLayersRef.current.forEach((speed, element) => {
        const xOffset = offsetX * speed
        const yOffset = offsetY * speed
        element.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [containerRef])

  const registerLayer = (element: HTMLElement, speed: number) => {
    parallaxLayersRef.current.set(element, speed)
  }

  return { registerLayer }
}
