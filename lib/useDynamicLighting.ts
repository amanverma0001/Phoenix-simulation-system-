"use client"

import type React from "react"

import { useEffect, useRef } from "react"

export const useDynamicLighting = (containerRef: React.RefObject<HTMLElement>) => {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const spotlight = document.createElement("div")
    spotlight.style.position = "fixed"
    spotlight.style.width = "800px"
    spotlight.style.height = "800px"
    spotlight.style.borderRadius = "50%"
    spotlight.style.pointerEvents = "none"
    spotlight.style.background = "radial-gradient(circle, rgba(0,255,255,0.4) 0%, transparent 70%)"
    spotlight.style.zIndex = "5"
    spotlight.style.filter = "blur(40px)"
    spotlight.style.mixBlendMode = "screen"

    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const updateSpotlight = () => {
      // Smooth follow with 200ms delay
      currentX += (targetX - currentX) * 0.1
      currentY += (targetY - currentY) * 0.1

      if (spotlight) {
        spotlight.style.left = `${currentX - 400}px`
        spotlight.style.top = `${currentY - 400}px`
      }

      requestAnimationFrame(updateSpotlight)
    }

    window.addEventListener("mousemove", handleMouseMove)
    updateSpotlight()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (spotlight.parentNode) {
        spotlight.parentNode.removeChild(spotlight)
      }
    }
  }, [containerRef])
}
